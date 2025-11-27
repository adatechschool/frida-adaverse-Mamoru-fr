'use client';
import {AdaPromotion} from "@/content/adaPromotions"
import {createContext, useContext, useState, useEffect} from "react"
import type {ReactNode} from "react"

type AdaPromotionsContextType = {
    listAdaPromotions: AdaPromotion[],
    setListAdaPromotions: React.Dispatch<React.SetStateAction<AdaPromotion[]>>,
    loading: boolean,
    error: string | null
}

const AdaPromotionsContext = createContext<AdaPromotionsContextType | undefined>(undefined)

type AdaPromotionsProviderProps = {
    children: ReactNode
}

export function AdaPromotionsProvider({children}: AdaPromotionsProviderProps) {
    const [listAdaPromotions, setListAdaPromotions] = useState<AdaPromotion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        console.log('[AdaPromotionsContext] Starting fetch')
        
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        fetch('/api/ada-promotion', {
            headers: {
                'x-api-key': apiKey || '',
            },
        })
            .then(res => {
                console.log('[AdaPromotionsContext] Fetch response status:', res.status)
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                return res.json()
            })
            .then(data => {
                console.log('[AdaPromotionsContext] Raw data received:', data)
                if (isMounted) {
                    setListAdaPromotions(data as AdaPromotion[])
                    setLoading(false)
                    console.log('[AdaPromotionsContext] Setting promotions, count:', data.length)
                }
            })
            .catch(err => {
                console.error('[AdaPromotionsContext] Error fetching Ada Promotions:', err)
                if (isMounted) {
                    setError(err.message)
                    setLoading(false)
                }
            })
        
        return () => {
            isMounted = false
        }
    }, [])

    return (
        <AdaPromotionsContext.Provider value={{listAdaPromotions, setListAdaPromotions, loading, error}}>
            {children}
        </AdaPromotionsContext.Provider>
    )
}

export function useAdaPromotions() {
    const context = useContext(AdaPromotionsContext)
    if (!context) {
        throw new Error('useAdaPromotions must be used within a AdaPromotionsProvider');
    }
    return context
}
'use client';
import {adaProject} from "@/content/adaProject"
import {createContext, useContext, useState, useEffect} from "react"
import type {ReactNode} from "react"

type AdaProjectsContextType = {
    listAdaProjects: adaProject[],
    setListAdaProjects: React.Dispatch<React.SetStateAction<adaProject[]>>,
    loading: boolean,
    error: string | null
}

const AdaProjectsContext = createContext<AdaProjectsContextType | undefined>(undefined)

type AdaProjectsProviderProps = {
    children: ReactNode
}

export function AdaProjectsProvider({children}: AdaProjectsProviderProps) {
    const [listAdaProjects, setListAdaProjects] = useState<adaProject[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        console.log('[AdaProjectsContext] Starting fetch at', new Date().toISOString())
        
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        fetch('/api/ada-project', {
            headers: {
                'x-api-key': apiKey || '',
            },
        })
            .then(res => {
                console.log('[AdaProjectsContext] Fetch response status:', res.status)
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                return res.json()
            })
            .then(data => {
                console.log('[AdaProjectsContext] Raw data received:', data)
                if (isMounted) {
                    setListAdaProjects(data as adaProject[])
                    setLoading(false)
                    console.log('[AdaProjectsContext] Setting projects, count:', data.length)
                }
            })
            .catch(err => {
                console.error('[AdaProjectsContext] Error fetching Ada Projects:', err)
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
        <AdaProjectsContext.Provider value={{listAdaProjects, setListAdaProjects, loading, error}}>
            {children}
        </AdaProjectsContext.Provider>
    )
}

export function useAdaProjects() {
    const context = useContext(AdaProjectsContext)
    if (!context) {
        throw new Error('useAdaProjects must be used within a AdaProjectsProvider');
    }
    return context
}

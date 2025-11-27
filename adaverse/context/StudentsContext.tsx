'use client';
import {Student} from "@/content/student"
import {createContext, useContext, useState, useEffect} from "react"
import type {ReactNode} from "react"

type StudentsContextType = {
    listStudents: Student[],
    setListStudents: React.Dispatch<React.SetStateAction<Student[]>>,
    loading: boolean,
    error: string | null
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined)
type StudentsProviderProps = {
    children: ReactNode
}

export function StudentsProvider({children}: StudentsProviderProps) {
    const [listStudents, setListStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        console.log('[StudentsContext] Starting fetch at', new Date().toISOString())
        
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        fetch('/api/student', {
            headers: {
                'x-api-key': apiKey || '',
            },
        })
            .then(res => {
                console.log('[StudentsContext] Fetch response status:', res.status)
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                return res.json()
            })
            .then(data => {
                console.log('[StudentsContext] Raw data received:', data)
                if (isMounted) {
                    setListStudents(data as Student[])
                    setLoading(false)
                    console.log('[StudentsContext] Setting students, count:', data.length)
                }
            })
            .catch(err => {
                console.error('[StudentsContext] Error fetching Students:', err)
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
        <StudentsContext.Provider value={{listStudents, setListStudents, loading, error}}>
            {children}
        </StudentsContext.Provider>
    )
}

export function useStudents() {
    const context = useContext(StudentsContext)
    if (!context) {
        throw new Error('useStudents must be used within a StudentsProvider');
    }
    return context
}

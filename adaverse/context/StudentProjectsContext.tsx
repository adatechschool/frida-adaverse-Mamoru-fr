'use client';
import { Project } from "@/content/project"
import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

type StudentProjectsContextType = {
    listStudentProjects: Project[],
    setListStudentProjects: React.Dispatch<React.SetStateAction<Project[]>>,
    loading: boolean,
    error: string | null
}

const StudentProjectsContext = createContext<StudentProjectsContextType | undefined>(undefined)

type StudentProjectsProviderProps = {
    children: ReactNode
}

export function StudentProjectsProvider({ children }: StudentProjectsProviderProps) {
    const [listStudentProjects, setListStudentProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        console.log('[StudentProjectsContext] Starting fetch at', new Date().toISOString())
        
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        
        fetch('/api/student-project', {
            headers: {
                'x-api-key': apiKey || '',
            },
        })
            .then(res => {
                console.log('[StudentProjectsContext] Fetch response status:', res.status)
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                return res.json()
            })
            .then(data => {
                console.log('[StudentProjectsContext] Raw data received:', data)
                if (isMounted) {
                    setListStudentProjects(data as Project[])
                    setLoading(false)
                    console.log('[StudentProjectsContext] Setting student projects, count:', data.length)
                }
            })
            .catch(err => {
                console.error('[StudentProjectsContext] Error:', err)
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
        <StudentProjectsContext.Provider value={{ listStudentProjects, setListStudentProjects, loading, error }}>
            {children}
        </StudentProjectsContext.Provider>
    )
}

export function useStudentProjects() {
    const context = useContext(StudentProjectsContext)
    if (context === undefined) {
        throw new Error('useStudentProjects must be used within a StudentProjectsProvider')
    }
    return context
}

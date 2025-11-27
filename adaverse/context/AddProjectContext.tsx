'use client'
import React, {createContext, ReactNode, useState, useEffect} from 'react';

type PendingProject = {
    id: number;
    title: string;
    image: string;
    URLName: string;
    adaProjectID: number;
    githubRepoURL: string;
    demoURL: string | null;
    studentIds: string;
    createdAt: Date;
    publishedAt: Date | null;
}

type AddProjectContextType = {
    isModalOpen: boolean;
    toggleModal: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pendingProjects: PendingProject[];
    fetchPendingProjects: () => Promise<void>;
}

const AddProjectContext = createContext<AddProjectContextType | undefined>(undefined);

type AddProjectProviderProps = {
    children: ReactNode;
}

export function AddProjectProvider({children}: AddProjectProviderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);

    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
    };

    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const fetchPendingProjects = async () => {
        try {
            console.log('[AddProjectContext] Try fetching pending projects');
            const res = await fetch('/api/pending-project',{
            headers: {
                'x-api-key': apiKey || '',
            },
        });
            console.log('[AdaProjectContext] pending projects are fetched : ', res.json);
            if (res.ok) {
                const data = await res.json();
                setPendingProjects(data);
            }
        } catch (error) {
            console.error('[AddProjectContext] Error fetching pending projects:', error);
        }
    };

    useEffect(() => {
        fetchPendingProjects();
    }, []);

    return (
        <AddProjectContext.Provider value={{isModalOpen, toggleModal, setIsModalOpen, pendingProjects, fetchPendingProjects}}>
            {children}
        </AddProjectContext.Provider>
    )
}

export function useAddProject() {
    const context = React.useContext(AddProjectContext);
    if (context === undefined) {
        throw new Error('useAddProject must be used within an AddProjectProvider');
    }
    return context;
}
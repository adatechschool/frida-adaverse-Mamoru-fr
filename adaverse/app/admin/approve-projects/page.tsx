'use client';

import { useAddProject } from '@/context/AddProjectContext';
import { useAdaProjects } from '@/context/AdaProjectsContext';
import { useStudents } from '@/context/StudentsContext';
import { CombinedColors } from '@/content/Colors';
import { useState } from 'react';
import { X, CheckCheck } from 'lucide-react';
import { PendingProjectCard } from '@/components/admin/PendingProjectCard';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import {useSession} from '@/context/SessionContext';
import {redirect} from 'next/navigation';

export default function ApproveProjectsPage() {
    const { pendingProjects, fetchPendingProjects } = useAddProject();
    const { listAdaProjects } = useAdaProjects();
    const { listStudents } = useStudents();
    const [loading, setLoading] = useState<number | null>(null);
    const [hiddenProjects, setHiddenProjects] = useState<Set<number>>(new Set());
    const {session} = useSession();

    // If not admin, show access denied
    if (!session || session.user.role !== 'admin') {
        redirect('/')
    }

    // Helper function to get project name by ID
    const getProjectName = (projectId: number | null) => {
        if (!projectId) return 'N/A';
        const project = listAdaProjects.find(p => p.id === projectId);
        return project ? project.projectName : `ID ${projectId}`;
    };

    // Helper function to get student names from comma-separated IDs
    const getStudentNames = (studentIds: string) => {
        const ids = studentIds.split(',').map(id => parseInt(id.trim()));
        const names = ids.map(id => {
            const student = listStudents.find(s => s.id === id);
            return student ? student.name : `ID ${id}`;
        });
        return names.join(', ');
    };

    // Filter out hidden projects
    const visibleProjects = pendingProjects.filter(p => !hiddenProjects.has(p.id));

    const handleApprove = async (projectId: number) => {
        setLoading(projectId);
        try {
            const res = await fetch(`/api/pending-project/approve?id=${projectId}`, {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            if (res.ok) {
                // Hide the project immediately
                setHiddenProjects(prev => new Set(prev).add(projectId));
                alert('✅ Projet approuvé ! Exécutez "npm run approve" pour appliquer les changements.');
            } else {
                alert('❌ Erreur lors de l\'approbation');
            }
        } catch (error) {
            console.error('[ApproveProjects] Error:', error);
            alert('❌ Erreur de connexion');
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async (projectId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir rejeter ce projet ?')) return;

        setLoading(projectId);
        try {
            const res = await fetch(`/api/pending-project?id=${projectId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
            });

            if (res.ok) {
                // Hide the project immediately
                setHiddenProjects(prev => new Set(prev).add(projectId));
                alert('✅ Projet rejeté');
            } else {
                alert('❌ Erreur lors du rejet');
            }
        } catch (error) {
            console.error('[ApproveProjects] Error:', error);
            alert('❌ Erreur de connexion');
        } finally {
            setLoading(null);
        }
    };

    const handleRejectAll = async () => {
        if (visibleProjects.length === 0) return;
        
        if (!confirm(`Êtes-vous sûr de vouloir rejeter tous les ${visibleProjects.length} projet(s) en attente ?`)) return;

        setLoading(-1); // Use -1 to indicate "all" loading state
        try {
            const deletePromises = visibleProjects.map(project =>
                fetch(`/api/pending-project?id=${project.id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                    },
                })
            );

            const results = await Promise.all(deletePromises);
            const allSuccessful = results.every(res => res.ok);

            if (allSuccessful) {
                // Hide all projects
                const allIds = new Set(visibleProjects.map(p => p.id));
                setHiddenProjects(prev => new Set([...prev, ...allIds]));
                alert('✅ Tous les projets ont été rejetés');
            } else {
                alert('⚠️ Certains projets n\'ont pas pu être rejetés');
            }
        } catch (error) {
            console.error('[ApproveProjects] Error rejecting all:', error);
            alert('❌ Erreur de connexion');
        } finally {
            setLoading(null);
        }
    };

    const handleApproveAll = async () => {
        if (visibleProjects.length === 0) return;
        
        if (!confirm(`Êtes-vous sûr de vouloir approuver tous les ${visibleProjects.length} projet(s) en attente ?`)) return;

        setLoading(-1); // Use -1 to indicate "all" loading state
        try {
            const approvePromises = visibleProjects.map(project =>
                fetch(`/api/pending-project/approve?id=${project.id}`, {
                    method: 'POST',
                    headers: {
                        'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                    },
                })
            );

            const results = await Promise.all(approvePromises);
            const allSuccessful = results.every(res => res.ok);

            if (allSuccessful) {
                // Hide all projects
                const allIds = new Set(visibleProjects.map(p => p.id));
                setHiddenProjects(prev => new Set([...prev, ...allIds]));
                alert('✅ Tous les projets ont été approuvés ! Exécutez "npm run approve" pour appliquer les changements.');
            } else {
                alert('⚠️ Certains projets n\'ont pas pu être approuvés');
            }
        } catch (error) {
            console.error('[ApproveProjects] Error approving all:', error);
            alert('❌ Erreur de connexion');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <AdminNavigation />
            <div className="flex items-center justify-between mb-8">
                <h1 className={`text-3xl font-bold ${CombinedColors.text.primary}`}>
                    Projets en attente d'approbation
                </h1>
                {visibleProjects.length > 0 && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleApproveAll}
                            disabled={loading !== null}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${CombinedColors.button.primary.bg} ${CombinedColors.button.primary.text} ${CombinedColors.button.primary.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <CheckCheck className="h-5 w-5" />
                            Approuver tout ({visibleProjects.length})
                        </button>
                        <button
                            onClick={handleRejectAll}
                            disabled={loading !== null}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${CombinedColors.button.exit.bg} ${CombinedColors.button.exit.text} ${CombinedColors.button.exit.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <X className="h-5 w-5" />
                            Rejeter tout ({visibleProjects.length})
                        </button>
                    </div>
                )}
            </div>

            {visibleProjects.length === 0 ? (
                <div className={`p-8 text-center ${CombinedColors.background.card} rounded-lg`}>
                    <p className={CombinedColors.text.secondary}>
                        Aucun projet en attente
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {visibleProjects.map((project) => (
                        <PendingProjectCard
                            key={project.id}
                            project={project}
                            getProjectName={getProjectName}
                            getStudentNames={getStudentNames}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            loading={loading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

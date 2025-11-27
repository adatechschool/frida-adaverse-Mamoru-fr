'use client';

import { useAddProject } from '@/context/AddProjectContext';
import { useAdaProjects } from '@/context/AdaProjectsContext';
import { useStudents } from '@/context/StudentsContext';
import { CombinedColors } from '@/content/Colors';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function ApproveProjectsPage() {
    const { pendingProjects, fetchPendingProjects } = useAddProject();
    const { listAdaProjects } = useAdaProjects();
    const { listStudents } = useStudents();
    const [loading, setLoading] = useState<number | null>(null);

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
                alert('✅ Projet approuvé ! Exécutez "npm run approve" pour appliquer les changements.');
                await fetchPendingProjects();
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
                alert('✅ Projet rejeté');
                await fetchPendingProjects();
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className={`text-3xl font-bold mb-8 ${CombinedColors.text.primary}`}>
                Projets en attente d'approbation
            </h1>

            {pendingProjects.length === 0 ? (
                <div className={`p-8 text-center ${CombinedColors.background.card} rounded-lg`}>
                    <p className={CombinedColors.text.secondary}>
                        Aucun projet en attente
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingProjects.map((project) => (
                        <div
                            key={project.id}
                            className={`p-6 rounded-lg border ${CombinedColors.background.card} ${CombinedColors.border.default}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className={`text-2xl font-bold mb-2 ${CombinedColors.text.primary}`}>
                                        {project.title}
                                    </h2>
                                    <div className={`space-y-2 ${CombinedColors.text.secondary}`}>
                                        <p><strong>URL Name:</strong> {project.URLName}</p>
                                        <p><strong>Ada Project:</strong> {getProjectName(project.adaProjectID)}</p>
                                        <p><strong>GitHub:</strong> <a href={project.githubRepoURL} target="_blank" rel="noopener noreferrer" className="underline">{project.githubRepoURL}</a></p>
                                        {project.demoURL && (
                                            <p><strong>Demo:</strong> <a href={project.demoURL} target="_blank" rel="noopener noreferrer" className="underline">{project.demoURL}</a></p>
                                        )}
                                        <p><strong>Students:</strong> {getStudentNames(project.studentIds)}</p>
                                        <p><strong>Submitted:</strong> {new Date(project.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 ml-6">
                                    <button
                                        onClick={() => handleApprove(project.id)}
                                        disabled={loading === project.id}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${CombinedColors.button.primary.bg} ${CombinedColors.button.primary.text} ${CombinedColors.button.primary.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <Check className="h-5 w-5" />
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => handleReject(project.id)}
                                        disabled={loading === project.id}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${CombinedColors.button.exit.bg} ${CombinedColors.button.exit.text} ${CombinedColors.button.exit.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <X className="h-5 w-5" />
                                        Rejeter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

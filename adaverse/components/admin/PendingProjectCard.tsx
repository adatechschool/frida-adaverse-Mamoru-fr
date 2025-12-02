'use client';

import { CombinedColors } from '@/content/Colors';
import { Check, X } from 'lucide-react';

interface PendingProjectCardProps {
    project: {
        id: number;
        title: string;
        URLName: string;
        adaProjectID: number | null;
        githubRepoURL: string;
        demoURL: string | null;
        studentIds: string;
        createdAt: Date;
    };
    getProjectName: (projectId: number | null) => string;
    getStudentNames: (studentIds: string) => string;
    onApprove: (projectId: number) => Promise<void>;
    onReject: (projectId: number) => Promise<void>;
    loading: number | null;
}

export function PendingProjectCard({
    project,
    getProjectName,
    getStudentNames,
    onApprove,
    onReject,
    loading,
}: PendingProjectCardProps) {
    return (
        <div
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
                        onClick={() => onApprove(project.id)}
                        disabled={loading === project.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${CombinedColors.button.primary.bg} ${CombinedColors.button.primary.text} ${CombinedColors.button.primary.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <Check className="h-5 w-5" />
                        Approuver
                    </button>
                    <button
                        onClick={() => onReject(project.id)}
                        disabled={loading === project.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${CombinedColors.button.exit.bg} ${CombinedColors.button.exit.text} ${CombinedColors.button.exit.hover} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <X className="h-5 w-5" />
                        Rejeter
                    </button>
                </div>
            </div>
        </div>
    );
}

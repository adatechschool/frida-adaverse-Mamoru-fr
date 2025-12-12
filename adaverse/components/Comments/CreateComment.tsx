'use client';

import React, {useState} from 'react';

type CreateCommentProps = {
    projectId: number,
    refreshComments: () => void,
}

export function CreateComment({projectId, refreshComments}: CreateCommentProps) {
    const [content, setContent] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() !== '' && !isSubmitting) {
            setIsSubmitting(true);
            try {
                const apiKey = process.env.NEXT_PUBLIC_API_KEY;
                const response = await fetch(`/api/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey || '',
                    },
                    body: JSON.stringify({projectId, content})
                });
                
                if (response.ok) {
                    setContent('');
                    refreshComments();
                } else {
                    const error = await response.json();
                    console.error('Error creating comment:', error);
                    alert(error.error || 'Failed to post comment');
                }
            } catch (error) {
                console.error('Error creating comment:', error);
                alert('Failed to post comment');
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <div className="mb-6">
            <h4 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">
                Ajouter un commentaire
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez votre commentaire..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors resize-none"
                    required
                    disabled={isSubmitting}
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold px-6 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Publication...' : 'Publier'}
                    </button>
                </div>
            </form>
        </div>
    );
}
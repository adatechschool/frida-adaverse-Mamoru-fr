'use client';

import React, {useState} from 'react';

type ModifyCommentProps = {
    comment: {
        id: number;
        content: string;
        createdAt: string;
    },
    onSave: (content: string) => void;
    onCancel: () => void;
    onDelete: () => void;
}

export function ModifyComment({comment, onSave, onCancel, onDelete}: ModifyCommentProps) {
    const [content, setContent] = useState<string>(comment.content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() !== '') {
            onSave(content);
        }
    }



    return (
        <div style={{marginTop: '1.5rem', padding: '0 2rem 2rem'}}>
            <h4 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937'}}>
                Modify a Comment
            </h4>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment here..."
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        resize: 'none'
                    }}
                    required
                />
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '0.5rem', height: '100%'}}>
                    <button
                        type="button"
                        onClick={onDelete}
                        style={{
                            backgroundColor: '#dc2626',
                            height: '100%',
                            fontWeight: '600',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '0.375rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    >
                        🗑️
                    </button>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                backgroundColor: '#6b7280',
                                height: '100%',
                                color: 'white',
                                fontWeight: '600',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#2563eb',
                                height: '100%',
                                color: 'white',
                                fontWeight: '600',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                            Update Comment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
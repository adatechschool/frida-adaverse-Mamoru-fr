import {session} from "@/lib/db/schema";
import {useSession} from "@/context/SessionContext";

interface CommentType {
    id: number;
    content: string;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        image: string | null;
    };
}

interface CommentProps {
    comment: CommentType;
    onEdit: () => void;
}

export function CommentFormat({comment, onEdit}: CommentProps) {
    const {session} = useSession();
    const canEdit = session?.user?.id === comment.user?.id;

    const onDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Optionally, you can add a callback to refresh comments after deletion
                window.location.reload();
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    {comment.user && (
                        <div className="flex items-center gap-2 mb-2">
                            {comment.user.image ? (
                                <img
                                    src={comment.user.image}
                                    alt={comment.user.name}
                                    className="w-6 h-6 rounded-full"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-xs font-semibold">
                                    {comment.user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="font-semibold text-sm text-neutral-900 dark:text-white">
                                {comment.user.name}
                            </span>
                        </div>
                    )}
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2">
                        {comment.content}
                    </p>
                    <div className="flex flex-row justify-between items-center">
                        <small className="text-neutral-500 dark:text-neutral-400 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </small>
                        {canEdit && (
                            <button
                                onClick={onEdit}
                                className="ml-4 px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm"
                            >
                                ✏️ Modifier
                            </button>
                        )}
                        {session?.user?.role === 'admin' && !canEdit && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="ml-4 px-3 py-1 rounded-md bg-red-200 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            >
                                🗑️ Supprimer
                            </button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

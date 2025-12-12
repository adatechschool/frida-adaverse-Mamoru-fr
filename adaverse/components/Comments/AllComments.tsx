'use client';

import {useEffect, useState} from "react";
import {CreateComment} from "@/components/Comments/CreateComment";
import {CommentFormat} from "@/components/Comments/CommentFormat";
import {ModifyComment} from "@/components/Comments/ModifyComment";
import {useSession} from "@/context/SessionContext";

interface AllCommentsProps {
  refreshKey?: number;
  projectId: number;
}

type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  projectId: number;
  user?: {
    id: string;
    name: string;
    image: string | null;
  };
}

export const AllComments = ({refreshKey = 0, projectId}: AllCommentsProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const {session} = useSession();

  const refreshComments = () => {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    fetch(`/api/comments/projects/${projectId}`, {
      headers: {
        'x-api-key': apiKey || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        setLoading(false);
      });
  }
  
  useEffect(() => {
    refreshComments();
  }, [refreshKey, projectId]);

  const handleEdit = (commentId: number) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleSaveEdit = (commentId: number, newContent: string) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || '',
      },
      body: JSON.stringify({content: newContent})
    })
    .then(res => {
      if (res.ok) {
        refreshComments();
        setEditingCommentId(null);
      } else {
        res.json().then(error => {
          alert(error.error || 'Failed to update comment');
        });
      }
    })
    .catch(error => {
      console.error('Error updating comment:', error);
      alert('Failed to update comment');
    });
  };

  const handleDeleteComment = (commentId: number) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': apiKey || '',
      },
    })
    .then(res => {
      if (res.ok) {
        refreshComments();
        setEditingCommentId(null);
      } else {
        res.json().then(error => {
          alert(error.error || 'Failed to delete comment');
        });
      }
    })
    .catch(error => {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    });
  };

  return (
    <div className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8">
      <h3 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
        Commentaires ({comments.length})
      </h3>
      
      {session?.user ? (
        <CreateComment projectId={projectId} refreshComments={refreshComments} />
      ) : (
        <p className="mb-6 text-neutral-600 dark:text-neutral-400 italic">
          Connectez-vous pour laisser un commentaire
        </p>
      )}
      
      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400">Chargement des commentaires...</p>
      ) : comments.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 italic">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id}>
              {editingCommentId === comment.id ? (
                <ModifyComment 
                  comment={comment}
                  onSave={(newContent) => handleSaveEdit(comment.id, newContent)}
                  onCancel={handleCancelEdit}
                  onDelete={() => handleDeleteComment(comment.id)}
                />
              ) : (
                <CommentFormat 
                  comment={comment}
                  onEdit={() => handleEdit(comment.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
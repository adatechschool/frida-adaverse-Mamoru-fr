'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/interactComponents/Loading';
import { Users, Shield, Ban, CheckCircle, Mail, Calendar } from 'lucide-react';
import { AdminNavigation } from '@/components/admin/AdminNavigation';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    banned: boolean;
    createdAt: string;
};

export default function ManageUsersPage() {
    const { session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingUserId, setProcessingUserId] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is admin
        if (session && session.user?.role !== 'admin') {
            router.push('/');
            return;
        }

        if (session?.user?.role === 'admin') {
            fetchUsers();
        }
    }, [session, router]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;
            const response = await fetch('/api/admin/users', {
                headers: {
                    'x-api-key': apiKey || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanToggle = async (userId: string, currentBannedStatus: boolean) => {
        setProcessingUserId(userId);
        try {
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;
            const response = await fetch(`/api/admin/users/${userId}/ban`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey || '',
                },
                body: JSON.stringify({ banned: !currentBannedStatus }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update the user in the list
                setUsers(users.map(u => 
                    u.id === userId ? { ...u, banned: !currentBannedStatus } : u
                ));
                alert(data.message);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user status');
        } finally {
            setProcessingUserId(null);
        }
    };

    if (!session) {
        return <Loading />;
    }

    if (session.user?.role !== 'admin') {
        return null;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen px-8 py-8 lg:px-16 lg:py-12">
            <div className="mx-auto max-w-6xl">
                <AdminNavigation />
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <Users className="h-8 w-8 text-neutral-900 dark:text-white" />
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        Gestion des utilisateurs
                    </h1>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                            <h3 className="font-semibold text-neutral-600 dark:text-neutral-400">Total</h3>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">{users.length}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <h3 className="font-semibold text-neutral-600 dark:text-neutral-400">Actifs</h3>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                            {users.filter(u => !u.banned).length}
                        </p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <h3 className="font-semibold text-neutral-600 dark:text-neutral-400">Bannis</h3>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                            {users.filter(u => u.banned).length}
                        </p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                                <tr>
                                    <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                                        Utilisateur
                                    </th>
                                    <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                                        Rôle
                                    </th>
                                    <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                                        Date d'inscription
                                    </th>
                                    <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                                        Statut
                                    </th>
                                    <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-neutral-900 dark:text-white truncate">
                                                    {user.name}
                                                </span>
                                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <Mail className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium whitespace-nowrap">
                                                    <Shield className="h-3 w-3" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 text-sm font-medium whitespace-nowrap">
                                                    <Users className="h-3 w-3" />
                                                    Utilisateur
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <Calendar className="h-3 w-3 shrink-0" />
                                                <span className="whitespace-nowrap">
                                                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.banned ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium whitespace-nowrap">
                                                    <Ban className="h-3 w-3" />
                                                    Banni
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium whitespace-nowrap">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Actif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 gap-2 flex flex-col">
                                            {user.role !== 'admin' && user.id !== session?.user?.id && (
                                                <button
                                                    onClick={() => handleBanToggle(user.id, user.banned)}
                                                    disabled={processingUserId === user.id}
                                                    className={`px-4 py-2 rounded-lg font-extrabold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                                                        user.banned
                                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                                    }`}
                                                >
                                                    {processingUserId === user.id
                                                        ? 'Traitement...'
                                                        : user.banned
                                                        ? 'Débannir'
                                                        : 'Bannir'}
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <span className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                                                    Impossible de bannir un admin
                                                </span>
                                            )}
                                            {user.id === session?.user?.id && (
                                                <span className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                                                    C'est vous
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

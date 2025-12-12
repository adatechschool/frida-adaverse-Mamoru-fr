'use client';
import {useState} from "react";
import {signin, signup} from "@/scripts/actions/signActions"
import { CombinedColors } from '@/content/Colors';

export default function ConnectionsPage() {
    const [view, setView] = useState<"signin" | "signup">("signin");

    const toggleView = () => {
        setView(view === 'signin' ? 'signup' : 'signin');
    };

    return (
        <main className="flex items-center justify-center min-h-[90vh] px-4 py-16">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 w-full max-w-md transition-colors">
                <h1 className="text-2xl font-semibold text-center mb-6 text-neutral-900 dark:text-white tracking-tight">
                    {view === 'signin' ? 'Connexion' : 'Inscription'}
                </h1>

                {/* Formulaire de connexion */}
                {view === 'signin' && (
                    <form action={signin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors"
                                placeholder="Votre email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Mot de passe *</label>
                            <input
                                type="password"
                                name="password"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors"
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium ${CombinedColors.button.primary.bg} ${CombinedColors.button.primary.text} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${CombinedColors.button.primary.hover}`}
                        >
                            Se connecter
                        </button>
                    </form>
                )}

                {/* Formulaire d'inscription */}
                {view === 'signup' && (
                    <form action={signup} className="space-y-4">
                        <div>
                            <label className="block text-base font-medium text-neutral-700 dark:text-neutral-300">Nom *</label>
                            <input
                                type="text"
                                name="name"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors"
                                placeholder="Votre nom"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors"
                                placeholder="Votre email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Mot de passe *</label>
                            <input
                                type="password"
                                name="password"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors"
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Confirmer le mot de passe *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 dark:focus:ring-neutral-400 focus:border-transparent transition-colors"
                                placeholder="Votre mot de passe"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-offset-neutral-900 transition-colors"
                        >
                            S'inscrire
                        </button>
                    </form>
                )}

                {/* Bouton pour basculer entre les formulaires */}
                <div className="mt-6 text-center">
                    <button
                        onClick={toggleView}
                        className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                    >
                        {view === 'signin'
                            ? "Pas encore de compte ? S'inscrire"
                            : 'Déjà un compte ? Se connecter'}
                    </button>
                </div>
            </div>
        </main>
    )
}
'use client';

import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import {CombinedColors} from '@/content/Colors';
import {useAddProject} from '@/context/AddProjectContext';
import {DropdownAdaPromotions} from '../DropdownAdaPromotions';
import {MultiStudentTagSelect} from '../MultiStudentTagSelect';

export default function AddProjectModal() {
    const {isModalOpen, toggleModal} = useAddProject();
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        adaProjectID: '',
        githubRepoURL: '',
        demoURL: '',
        publishedAt: '',
        studentIds: '', // comma-separated string
    });

    // Helper for multi-select
    const handleStudentIdsChange = (selectedIds: string[]) => {
        setFormData({
            ...formData,
            studentIds: selectedIds.join(', '),
        });
    };

    useEffect(() => {
        if (!isModalOpen) return;
        // Save current scroll position
        const scrollY = window.scrollY;
        // Prevent body scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        // Cleanup: restore scroll when popup closes
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        // Build the image URL
        const imageUrl = formData.githubRepoURL + '/blob/main/thumbnail.png?raw=true';
        let imageExists = false;
        try {
            const res = await fetch(imageUrl, { method: 'HEAD' });
            imageExists = res.ok;
        } catch (err) {
            imageExists = false;
        }
        if (imageExists) {
            formData.image = imageUrl;
        } else {
            formData.image = '';
            console.log('[Add Project] No image found at', imageUrl, ', using empty string');
        }

        try {
            const res = await fetch('/api/pending-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('✅ Projet ajouté à la liste d\'attente pour approbation !');
                toggleModal();
                setFormData({
                    title: '',
                    image: '',
                    adaProjectID: '',
                    githubRepoURL: '',
                    demoURL: '',
                    publishedAt: '',
                    studentIds: '',
                });
            } else {
                alert('❌ Erreur lors de l\'ajout du projet');
            }
        } catch (error) {
            console.error('[AddProjectModal] Error:', error);
            alert('❌ Erreur de connexion');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={toggleModal}
            />

            {/* Modal */}
            <div className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg ${CombinedColors.background.main} border ${CombinedColors.border.default} shadow-2xl`}>
                {/* Header */}
                <div className={`sticky top-0 ${CombinedColors.background.main} border-b ${CombinedColors.border.default} px-6 py-4 flex items-center justify-between`}>
                    <h2 className="text-2xl font-bold">Ajouter un nouveau projet</h2>
                    <button
                        onClick={toggleModal}
                        className={`rounded-md p-2 transition-colors ${CombinedColors.button.secondary.bg} ${CombinedColors.button.secondary.hover}`}
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            Titre du projet *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="Mon Super Projet"
                        />
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label htmlFor="githubRepoURL" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            URL GitHub *
                        </label>
                        <input
                            type="url"
                            id="githubRepoURL"
                            name="githubRepoURL"
                            required
                            value={formData.githubRepoURL}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    {/* Demo URL */}
                    <div>
                        <label htmlFor="demoURL" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            URL de la démo
                        </label>
                        <input
                            type="url"
                            id="demoURL"
                            name="demoURL"
                            value={formData.demoURL}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="https://mon-projet.vercel.app"
                        />
                    </div>

                    {/* Ada Project */}
                    <div>
                        <label htmlFor="adaProjectID" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            Projet Ada
                        </label>
                        <DropdownAdaPromotions
                            onChange={handleChange}
                            value={formData.adaProjectID}
                        />
                    </div>

                    {/* Students */}
                    <div>
                        <label htmlFor="studentIds" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            Étudiants (sélection multiple possible)
                        </label>
                        <MultiStudentTagSelect
                            value={formData.studentIds ? formData.studentIds.split(/, ?/) : []}
                            onChange={handleStudentIdsChange}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={toggleModal}
                            className={`flex-1 rounded-md ${CombinedColors.button.secondary.bg} ${CombinedColors.button.secondary.text} px-6 py-3 font-semibold transition-colors ${CombinedColors.button.secondary.hover}`}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 rounded-md ${CombinedColors.button.primary.bg} ${CombinedColors.button.primary.text} px-6 py-3 font-semibold transition-colors ${CombinedColors.button.primary.hover}`}
                        >
                            Ajouter le projet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

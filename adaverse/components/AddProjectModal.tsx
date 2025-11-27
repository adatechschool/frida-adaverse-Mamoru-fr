'use client';

import {useState} from 'react';
import {X} from 'lucide-react';
import {CombinedColors} from '@/content/Colors';
import {useAddProject} from '@/context/AddProjectContext';

export default function AddProjectModal() {
    const {isModalOpen, toggleModal} = useAddProject();
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        URLName: '',
        adaProjectID: '',
        githubRepoURL: '',
        demoURL: '',
        publishedAt: '',
        studentIds: '',
    });

    if (!isModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
                    URLName: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

                    {/* URL Name */}
                    <div>
                        <label htmlFor="URLName" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            Nom d'URL (slug) *
                        </label>
                        <input
                            type="text"
                            id="URLName"
                            name="URLName"
                            required
                            value={formData.URLName}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="mon-super-projet"
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
                            URL de la démo (optionnel)
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

                    {/* Image URL */}
                    <div>
                        <label htmlFor="image" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            URL de l'image (optionnel)
                        </label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Ada Project ID */}
                    <div>
                        <label htmlFor="adaProjectID" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            ID du projet Ada *
                        </label>
                        <input
                            type="number"
                            id="adaProjectID"
                            name="adaProjectID"
                            required
                            value={formData.adaProjectID}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="1"
                        />
                    </div>

                    {/* Student IDs */}
                    <div>
                        <label htmlFor="studentIds" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            IDs des étudiants (séparés par des virgules)
                        </label>
                        <input
                            type="text"
                            id="studentIds"
                            name="studentIds"
                            value={formData.studentIds}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="1, 2, 3"
                        />
                    </div>

                    {/* Published Date */}
                    <div>
                        <label htmlFor="publishedAt" className={`mb-2 block text-sm font-semibold ${CombinedColors.text.secondary}`}>
                            Date de publication (optionnel)
                        </label>
                        <input
                            type="date"
                            id="publishedAt"
                            name="publishedAt"
                            value={formData.publishedAt}
                            onChange={handleChange}
                            className={`w-full rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
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

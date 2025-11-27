export function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 text-xl text-neutral-900 dark:text-white">Chargement des projets...</div>
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
            </div>
        </div>
    );
}
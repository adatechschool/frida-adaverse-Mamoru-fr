type Props = {
    message : string | null
}

export function ErrorMessage({message} : Props) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 p-6 text-center">
                <h2 className="mb-2 text-xl font-bold text-red-700 dark:text-red-500">Erreur de chargement des données</h2>
                <p className="text-red-600 dark:text-red-300">{message}</p>
            </div>
        </div>
    )
}
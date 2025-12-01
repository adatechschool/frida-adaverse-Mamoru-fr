/**
 * Generate a URL-friendly slug from a project title
 * Converts to lowercase, removes accents, replaces spaces with hyphens, removes special chars
 */
export function generateURLName(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD') // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

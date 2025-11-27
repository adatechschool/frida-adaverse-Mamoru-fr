/**
 * Normalize a date string to a consistent format (YYYY-MM-DD)
 * Accepts French format (DD/MM/YYYY) and ISO format (YYYY-MM-DD)
 * Examples:
 *   - "15/01/2024" (DD/MM/YYYY) → "2024-01-15"
 *   - "2024-01-15" (ISO) → "2024-01-15"
 */
export function normalizeDate(dateInput: string | Date): string {
    try {
        // If already a Date object, format it
        if (dateInput instanceof Date) {
            return dateInput.toISOString().split('T')[0];
        }

        // Handle DD/MM/YYYY (French format)
        const frenchPattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
        const match = dateInput.match(frenchPattern);
        
        if (match) {
            const [ , day, month, year] = match;
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);
            
            // Validate day and month
            if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
                throw new Error('Invalid month or day');
            }
            
            // Format as YYYY-MM-DD
            const monthStr = monthNum.toString().padStart(2, '0');
            const dayStr = dayNum.toString().padStart(2, '0');
            return `${year}-${monthStr}-${dayStr}`;
        }

        // Try parsing as ISO format or other standard formats
        const date = new Date(dateInput);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }

        // Return in YYYY-MM-DD format
        return date.toISOString().split('T')[0];
    } catch (error) {
        console.error(`[normalizeDate] Failed to normalize date: "${dateInput}"`, error);
        // Return the original input if normalization fails
        return dateInput.toString();
    }
}

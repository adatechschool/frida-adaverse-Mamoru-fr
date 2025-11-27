'use client';
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="rounded-md p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 text-neutral-800" />
            ) : (
                <Sun className="h-5 w-5 text-neutral-200" />
            )}
        </button>
    );
}

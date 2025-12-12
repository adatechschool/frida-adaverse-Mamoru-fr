'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, CheckSquare } from 'lucide-react';

export function AdminNavigation() {
    const pathname = usePathname();

    const navItems = [
        {
            href: '/admin/manage-users',
            label: 'Gestion des utilisateurs',
            icon: Users,
        },
        {
            href: '/admin/approve-projects',
            label: 'Approuver les projets',
            icon: CheckSquare,
        },
    ];

    return (
        <nav className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex gap-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${
                                isActive
                                    ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

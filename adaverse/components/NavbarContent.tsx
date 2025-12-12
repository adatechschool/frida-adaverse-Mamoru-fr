'use client';

import {usePathname} from "next/navigation";
import Link from "next/link";
import {Shield, Menu, X} from 'lucide-react';
import {useState} from 'react';
import ThemeToggle from "@/components/ThemeToggle";
import TitleButton from "@/components/TitleButton";
import AddProjectButton from "@/components/AddProject/AddProjectButton";
import {PromotionFilterDropdown} from "@/components/PromotionFilterDropdown";
import {SignInHeaderButton} from "./signButton/SignInHeaderButton";
import {SignOutHeaderButton} from "./signButton/SignOutHeaderButton";
import {usePromotionFilter} from "@/context/PromotionFilterContext";
import {useSession} from "@/context/SessionContext";

export default function NavbarContent() {
    const {selectedPromotion, setSelectedPromotion} = usePromotionFilter();
    const {session} = useSession();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Only show promotion filter on homepage
    const showPromotionFilter = pathname === '/';

    return (
        <div className="relative">
            <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 gap-2 lg:gap-4">
                {/* Left section - Logo and Search */}
                <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                    <TitleButton />
                    <Link
                        href="/search"
                        className="px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-semibold transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Rechercher
                    </Link>
                </div>

                {/* Hamburger menu button - Mobile only */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                {/* Desktop navigation - Hidden on mobile */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Auth button */}
                    {session ?
                        <SignOutHeaderButton />
                        :
                        <SignInHeaderButton />
                    }

                    {/* Promotion filter (homepage only) */}
                    {showPromotionFilter && (
                        <PromotionFilterDropdown
                            value={selectedPromotion}
                            onChange={setSelectedPromotion}
                        />
                    )}

                    {/* Add project button */}
                    <AddProjectButton />

                    {/* Admin button (admin only) */}
                    {session?.user?.role === 'admin' && (
                        <Link
                            href="/admin/manage-users"
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Shield className="h-4 w-4" />
                            Admin
                        </Link>
                    )}

                    {/* Theme toggle */}
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile menu - Shown when hamburger is clicked */}
            {mobileMenuOpen && (
                <div className="xl:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-lg z-50">
                    <div className="flex flex-col items-end gap-2 p-4">
                        {/* Auth button */}
                        <div onClick={() => setMobileMenuOpen(false)}>
                            {session ?
                                <SignOutHeaderButton />
                                :
                                <SignInHeaderButton />
                            }
                        </div>

                        {/* Promotion filter (homepage only) */}
                        {showPromotionFilter && (
                            <div>
                                <PromotionFilterDropdown
                                    value={selectedPromotion}
                                    onChange={(value) => {
                                        setSelectedPromotion(value);
                                        setMobileMenuOpen(false);
                                    }}
                                />
                            </div>
                        )}

                        {/* Add project button */}
                        <div onClick={() => setMobileMenuOpen(false)}>
                            <AddProjectButton />
                        </div>

                        {/* Admin button (admin only) */}
                        {session?.user?.role === 'admin' && (
                            <Link
                                href="/admin/manage-users"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Shield className="h-4 w-4" />
                                Admin
                            </Link>
                        )}

                        {/* Theme toggle */}
                        <div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/src/components/theme-toggle';
import { Button } from '@/src/components/ui/button';
import { LogOut, Menu, X } from 'lucide-react';
import { authService } from '@/src/services/auth.service';
import { useState } from 'react';
import Image from 'next/image';
import { NotificationBell } from '@/src/components/notifications/NotificationBell';

export function AppHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/patients', label: 'Patients' },
        { href: '/schedule', label: 'Schedule' },
        { href: '/earnings', label: 'Earnings' },
        { href: '/profile', label: 'Profile' },
    ];

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
                        <Image src="/favicon.png" alt="Logo" width={32} height={32} />
                        <span className="font-semibold text-lg hidden sm:inline">
                            Docsimus <span className="text-primary">Doctors</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <NotificationBell />
                        <ThemeToggle />

                        {/* Desktop Logout */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden lg:inline">Logout</span>
                        </Button>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4">
                        <nav className="flex flex-col space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMobileMenu}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}

                            {/* Mobile Logout */}
                            <button
                                onClick={() => {
                                    closeMobileMenu();
                                    handleLogout();
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

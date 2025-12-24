'use client';

import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileSearch, Users, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui";
import { authService } from "@/src/services/auth.service";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Applications", href: "/admin/applications", icon: FileSearch },
    { label: "Reviewers", href: "/admin/reviewers", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ name: string | null; email: string; initials: string } | null>(null);

    useEffect(() => {
        const user = authService.getUser();
        if (user) {
            const initials = user.name
                ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                : user.email.slice(0, 2).toUpperCase();

            setCurrentUser({
                name: user.name,
                email: user.email,
                initials
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-secondary/50">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* Main Header Row */}
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/admin" className="flex items-center gap-3">
                            <Image
                                src="/favicon.png"
                                alt="Docsimus logo"
                                width={36}
                                height={36}
                                className="h-9 w-9 object-contain"
                                priority
                            />
                            <div className="hidden sm:block">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Docsimus Doctors</p>
                                <p className="text-base font-semibold text-foreground">Admin Portal</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                // For Dashboard (/admin), only exact match; for others, also match child routes
                                const isActive = item.href === '/admin'
                                    ? pathname === '/admin'
                                    : pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Side - Admin Avatar & Mobile Menu */}
                        <div className="flex items-center gap-3">
                            {/* Admin Badge - Always visible */}
                            {currentUser && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">{currentUser.initials}</span>
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-sm font-medium">{currentUser.name || currentUser.email}</p>
                                        <p className="text-xs text-muted-foreground">Admin</p>
                                    </div>
                                </div>
                            )}

                            {/* Desktop Logout Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    authService.logout();
                                    router.push('/login');
                                }}
                                className="hidden md:flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>

                            {/* Mobile Menu Toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-border py-4 animate-in slide-in-from-top-2">
                            <nav className="flex flex-col space-y-1">
                                {navItems.map((item) => {
                                    const isActive = item.href === '/admin'
                                        ? pathname === '/admin'
                                        : pathname === item.href || pathname.startsWith(item.href + '/');
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                                <div className="pt-2 mt-2 border-t border-border">
                                    <button
                                        onClick={() => {
                                            authService.logout();
                                            router.push('/login');
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
                {children}
            </main>
        </div>
    );
}

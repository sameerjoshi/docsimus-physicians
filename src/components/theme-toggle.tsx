'use client';

import { Button } from '@/src/components/ui/button';
import { useTheme } from '@/src/components/providers/theme';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showLabel?: boolean;
    className?: string;
}

export function ThemeToggle({
    variant = 'ghost',
    size = 'icon',
    showLabel = false,
    className
}: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    const themes = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
    ] as const;

    const currentThemeIndex = themes.findIndex(t => t.value === theme);
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];

    const CurrentIcon = themes.find(t => t.value === theme)?.icon || Sun;

    return (
        <Button
            variant={variant}
            size={size}
            onClick={() => setTheme(nextTheme.value)}
            className={className}
            title={`Switch to ${nextTheme.label} theme`}
        >
            <CurrentIcon className="h-4 w-4" />
            {showLabel && (
                <span className="ml-2 capitalize">{theme}</span>
            )}
        </Button>
    );
}

export function ThemeSelector({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    const themes = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
    ] as const;

    return (
        <div className={className}>
            <div className="text-sm font-medium mb-2">Theme</div>
            <div className="flex gap-1">
                {themes.map(({ value, icon: Icon, label }) => (
                    <Button
                        key={value}
                        variant={theme === value ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTheme(value)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

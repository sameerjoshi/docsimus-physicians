'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';

interface AvailabilityToggleProps {
    onToggle?: (available: boolean) => void;
}

export function AvailabilityToggle({ onToggle }: AvailabilityToggleProps) {
    const [isAvailable, setIsAvailable] = useState(false);

    const handleToggle = () => {
        const newState = !isAvailable;
        setIsAvailable(newState);

        // Here you would make API call to update availability status
        console.log('Availability status:', newState ? 'Available' : 'Offline');

        // Optional callback
        if (onToggle) {
            onToggle(newState);
        }
    };

    return (
        <Card className="p-4 sm:p-6">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Availability</h3>
                </div>

                {/* Large Toggle Switch */}
                <div className="space-y-3">
                    <button
                        onClick={handleToggle}
                        className={`relative w-full p-4 rounded-lg border-2 transition-all duration-300 ${isAvailable
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-border bg-muted/30'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Status Dot */}
                                <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                    }`} />

                                <span className={`text-sm font-medium ${isAvailable ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                                    }`}>
                                    {isAvailable ? "I'm Available Now" : "Currently Offline"}
                                </span>
                            </div>

                            {/* Toggle Switch */}
                            <div className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isAvailable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}>
                                <div
                                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isAvailable ? 'translate-x-7' : 'translate-x-0'
                                        }`}
                                />
                            </div>
                        </div>
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                        {isAvailable
                            ? 'You will receive instant consultation requests'
                            : 'Toggle to start accepting instant consultations'}
                    </p>
                </div>

                {/* Status Info */}
                {isAvailable && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-700 dark:text-green-400 text-center">
                            ✓ You're now visible to patients seeking instant consultations
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}

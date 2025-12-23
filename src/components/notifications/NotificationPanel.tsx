'use client';

import { NotificationItem } from './NotificationItem';
import { X, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    patientName?: string;
    patientAvatar?: string | null;
    reason?: string;
    symptoms?: string;
    expiresAt?: Date;
}

interface NotificationPanelProps {
    notifications: Notification[];
    isConnected: boolean;
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onMarkAsRead: (id: string) => void;
    onDismiss: (id: string) => void;
    onClose: () => void;
}

export function NotificationPanel({
    notifications,
    isConnected,
    onAccept,
    onDecline,
    onMarkAsRead,
    onDismiss,
    onClose,
}: NotificationPanelProps) {
    return (
        <div className="fixed inset-x-4 sm:absolute sm:inset-x-auto sm:right-0 mt-2 sm:w-96 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[70vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    <div
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${isConnected
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                    >
                        {isConnected ? (
                            <>
                                <Wifi className="h-3 w-3" />
                                <span>Live</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="h-3 w-3" />
                                <span>Offline</span>
                            </>
                        )}
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <p className="text-sm">No new notifications</p>
                        <p className="text-xs mt-1">
                            {isConnected
                                ? 'Waiting for consultation requests...'
                                : 'Reconnecting to server...'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onAccept={() => onAccept(notification.id)}
                                onDecline={() => onDecline(notification.id)}
                                onMarkAsRead={() => onMarkAsRead(notification.id)}
                                onDismiss={() => onDismiss(notification.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

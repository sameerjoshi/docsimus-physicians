'use client';

import { NotificationItem } from './NotificationItem';
import { X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    patientName?: string;
    patientAge?: number;
}

interface NotificationPanelProps {
    notifications: Notification[];
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onMarkAsRead: (id: string) => void;
    onClose: () => void;
}

export function NotificationPanel({
    notifications,
    onAccept,
    onDecline,
    onMarkAsRead,
    onClose,
}: NotificationPanelProps) {
    return (
        <div className="fixed inset-x-4 sm:absolute sm:inset-x-auto sm:right-0 mt-2 sm:w-96 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[70vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <p className="text-sm">No new notifications</p>
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

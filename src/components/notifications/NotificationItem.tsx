'use client';

import { Button } from '@/src/components/ui/button';
import { Check, X, User } from 'lucide-react';

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

interface NotificationItemProps {
    notification: Notification;
    onAccept: () => void;
    onDecline: () => void;
    onMarkAsRead: () => void;
}

export function NotificationItem({
    notification,
    onAccept,
    onDecline,
    onMarkAsRead,
}: NotificationItemProps) {
    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const isConsultationRequest = notification.type === 'consultation_request';

    return (
        <div
            className={`p-4 hover:bg-accent/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                    </p>

                    {notification.patientName && (
                        <p className="text-xs text-muted-foreground mb-2">
                            {notification.patientName} • {notification.patientAge} years
                        </p>
                    )}

                    <p className="text-xs text-muted-foreground mb-3">
                        {formatTimestamp(notification.timestamp)}
                    </p>

                    {/* Action Buttons for Consultation Requests */}
                    {isConsultationRequest && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={onAccept}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onDecline}
                                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

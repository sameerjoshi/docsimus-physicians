'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { NotificationPanel } from './NotificationPanel';
import { useConsultations } from '../providers/consultation';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        pendingRequests,
        unreadCount,
        isConnected,
        acceptRequest,
        rejectRequest,
        markAsRead,
        clearNotification,
    } = useConsultations();

    const handleAccept = async (notificationId: string) => {
        const notification = pendingRequests.find((n) => n.id === notificationId);
        if (notification) {
            try {
                await acceptRequest(notification.requestId);
            } catch {
                // Error handled in context
            }
        }
    };

    const handleDecline = async (notificationId: string) => {
        const notification = pendingRequests.find((n) => n.id === notificationId);
        if (notification) {
            try {
                await rejectRequest(notification.requestId);
            } catch {
                // Error handled in context
            }
        }
    };

    const handleMarkAsRead = (notificationId: string) => {
        markAsRead(notificationId);
    };

    const handleDismiss = (notificationId: string) => {
        clearNotification(notificationId);
    };

    // Transform to notification panel format
    const notifications = pendingRequests.map((request) => ({
        id: request.id,
        type: request.type,
        title: request.title,
        message: request.message,
        timestamp: request.timestamp,
        read: request.read,
        patientName: request.patient.name,
        patientAvatar: request.patient.avatar,
        reason: request.reason,
        symptoms: request.symptoms,
        expiresAt: request.expiresAt,
    }));

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                {/* Connection indicator */}
                <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${isConnected ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    title={isConnected ? 'Connected' : 'Disconnected'}
                />
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <NotificationPanel
                        notifications={notifications}
                        isConnected={isConnected}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onMarkAsRead={handleMarkAsRead}
                        onDismiss={handleDismiss}
                        onClose={() => setIsOpen(false)}
                    />
                </>
            )}
        </div>
    );
}

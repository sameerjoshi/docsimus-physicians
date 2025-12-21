'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { NotificationPanel } from './NotificationPanel';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: '1',
            type: 'consultation_request',
            title: 'New Consultation Request',
            message: 'Rajesh Kumar is requesting an instant consultation',
            timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
            read: false,
            patientName: 'Rajesh Kumar',
            patientAge: 45,
        },
        {
            id: '2',
            type: 'consultation_request',
            title: 'New Consultation Request',
            message: 'Priya Sharma is requesting an instant consultation',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            read: false,
            patientName: 'Priya Sharma',
            patientAge: 32,
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleAccept = (notificationId: string) => {
        // Here you would make API call to accept the consultation
        console.log('Accepting consultation:', notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const handleDecline = (notificationId: string) => {
        // Here you would make API call to decline the consultation
        console.log('Declining consultation:', notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
    };

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
                        {unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <NotificationPanel
                        notifications={notifications}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onMarkAsRead={handleMarkAsRead}
                        onClose={() => setIsOpen(false)}
                    />
                </>
            )}
        </div>
    );
}

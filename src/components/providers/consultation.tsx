'use client';

import React, { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { useConsultationSocket } from '../../hooks/useConsultationSocket';
import {
    ConsultationRequestEvent,
    ConsultationNotification,
    Consultation,
    ConsultationAcceptedEvent,
    ConsultationRejectedEvent,
    ConsultationRequestCancelledEvent,
    ConsultationEndedEvent,
} from '../../types/consultations';
import { consultationsService } from '../../services/consultations.service';
import { toast } from 'sonner';

// ==========================================
// CONTEXT TYPES
// ==========================================

interface ConsultationContextValue {
    // Connection state
    isConnected: boolean;

    // Pending requests (notifications)
    pendingRequests: ConsultationNotification[];
    unreadCount: number;

    // Active consultation
    activeConsultation: Consultation | null;

    // Actions
    acceptRequest: (requestId: string) => Promise<void>;
    rejectRequest: (requestId: string) => Promise<void>;
    markAsRead: (notificationId: string) => void;
    clearNotification: (notificationId: string) => void;
    clearAllNotifications: () => void;

    // Consultation room actions
    joinConsultation: (consultationId: string) => Promise<void>;
    leaveConsultation: (consultationId: string) => Promise<void>;
    endConsultation: (consultationId: string) => Promise<void>;

    // Connection control
    connect: () => void;
    disconnect: () => void;
}

// ==========================================
// CONTEXT & PROVIDER
// ==========================================

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

interface ConsultationProviderProps {
    children: React.ReactNode;
}

export function ConsultationProvider({ children }: ConsultationProviderProps) {
    const [pendingRequests, setPendingRequests] = useState<ConsultationNotification[]>([]);
    const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

    // Calculate unread count
    const unreadCount = useMemo(
        () => pendingRequests.filter((r) => !r.read).length,
        [pendingRequests]
    );

    // Handle incoming consultation request
    const handleConsultationRequest = useCallback((data: ConsultationRequestEvent) => {
        const notification: ConsultationNotification = {
            id: `notification-${data.requestId}`,
            type: 'consultation_request',
            title: 'New Consultation Request',
            message: `${data.patient.name} is requesting an instant consultation`,
            timestamp: new Date(),
            read: false,
            requestId: data.requestId,
            patient: data.patient,
            reason: data.reason,
            symptoms: data.symptoms,
            hasChatContext: data.hasChatContext,
            expiresAt: new Date(data.expiresAt),
            expiresInSeconds: data.expiresInSeconds,
        };

        setPendingRequests((prev) => {
            // Avoid duplicates
            if (prev.some((r) => r.requestId === data.requestId)) {
                return prev;
            }
            return [notification, ...prev];
        });

        // Play notification sound (if available)
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });
        } catch { }

        // Show toast
        toast.info('New Consultation Request', {
            description: `${data.patient.name} is requesting a consultation`,
            duration: 10000,
        });
    }, []);

    // Handle consultation accepted (when doctor accepts)
    const handleConsultationAccepted = useCallback((data: ConsultationAcceptedEvent) => {
        // Remove the request from pending
        setPendingRequests((prev) =>
            prev.filter((r) => r.requestId !== data.requestId)
        );

        toast.success('Consultation Started', {
            description: data.message,
        });
    }, []);

    // Handle consultation rejected
    const handleConsultationRejected = useCallback((data: ConsultationRejectedEvent) => {
        // Remove the request from pending
        setPendingRequests((prev) =>
            prev.filter((r) => r.requestId !== data.requestId)
        );

        if (data.expired) {
            toast.warning('Request Expired', {
                description: 'The consultation request has expired',
            });
        }
    }, []);

    // Handle request cancelled by patient
    const handleRequestCancelled = useCallback((data: ConsultationRequestCancelledEvent) => {
        setPendingRequests((prev) =>
            prev.filter((r) => r.requestId !== data.requestId)
        );

        toast.info('Request Cancelled', {
            description: 'The patient cancelled the consultation request',
        });
    }, []);

    // Handle consultation ended
    const handleConsultationEnded = useCallback((data: ConsultationEndedEvent) => {
        setActiveConsultation(null);
        toast.info('Consultation Ended', {
            description: `Consultation ended at ${new Date(data.timestamp).toLocaleTimeString()}`,
        });
    }, []);

    // Handle connection
    const handleConnect = useCallback(() => {
        console.log('[ConsultationProvider] WebSocket connected');
    }, []);

    // Handle disconnection
    const handleDisconnect = useCallback(() => {
        console.log('[ConsultationProvider] WebSocket disconnected');
    }, []);

    // Use the consultation socket hook
    const {
        isConnected,
        respondToRequest,
        joinConsultation: socketJoinConsultation,
        leaveConsultation: socketLeaveConsultation,
        endConsultation: socketEndConsultation,
        connect,
        disconnect,
    } = useConsultationSocket({
        onConsultationRequest: handleConsultationRequest,
        onConsultationAccepted: handleConsultationAccepted,
        onConsultationRejected: handleConsultationRejected,
        onRequestCancelled: handleRequestCancelled,
        onConsultationEnded: handleConsultationEnded,
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
    });

    // Accept a consultation request
    const acceptRequest = useCallback(
        async (requestId: string) => {
            try {
                const result = await respondToRequest(requestId, true);

                if (result.success && result.appointmentId) {
                    // Remove from pending
                    setPendingRequests((prev) =>
                        prev.filter((r) => r.requestId !== requestId)
                    );

                    toast.success('Consultation Accepted', {
                        description: 'You can now start the consultation',
                    });
                } else {
                    throw new Error(result.error || 'Failed to accept request');
                }
            } catch (error) {
                console.error('Failed to accept request:', error);
                toast.error('Failed to Accept', {
                    description: error instanceof Error ? error.message : 'Please try again',
                });
                throw error;
            }
        },
        [respondToRequest]
    );

    // Reject a consultation request
    const rejectRequest = useCallback(
        async (requestId: string) => {
            try {
                const result = await respondToRequest(requestId, false);

                if (result.success) {
                    // Remove from pending
                    setPendingRequests((prev) =>
                        prev.filter((r) => r.requestId !== requestId)
                    );

                    toast.info('Request Declined');
                } else {
                    throw new Error(result.error || 'Failed to decline request');
                }
            } catch (error) {
                console.error('Failed to reject request:', error);
                toast.error('Failed to Decline', {
                    description: error instanceof Error ? error.message : 'Please try again',
                });
                throw error;
            }
        },
        [respondToRequest]
    );

    // Mark notification as read
    const markAsRead = useCallback((notificationId: string) => {
        setPendingRequests((prev) =>
            prev.map((r) =>
                r.id === notificationId ? { ...r, read: true } : r
            )
        );
    }, []);

    // Clear a single notification
    const clearNotification = useCallback((notificationId: string) => {
        setPendingRequests((prev) =>
            prev.filter((r) => r.id !== notificationId)
        );
    }, []);

    // Clear all notifications
    const clearAllNotifications = useCallback(() => {
        setPendingRequests([]);
    }, []);

    // Join consultation room
    const joinConsultation = useCallback(
        async (consultationId: string) => {
            try {
                const result = await socketJoinConsultation(consultationId);

                if (result.success && result.consultation) {
                    setActiveConsultation(result.consultation);
                } else {
                    throw new Error(result.error || 'Failed to join consultation');
                }
            } catch (error) {
                console.error('Failed to join consultation:', error);
                toast.error('Failed to Join', {
                    description: error instanceof Error ? error.message : 'Please try again',
                });
                throw error;
            }
        },
        [socketJoinConsultation]
    );

    // Leave consultation room
    const leaveConsultation = useCallback(
        async (consultationId: string) => {
            try {
                await socketLeaveConsultation(consultationId);
                setActiveConsultation(null);
            } catch (error) {
                console.error('Failed to leave consultation:', error);
            }
        },
        [socketLeaveConsultation]
    );

    // End consultation
    const endConsultation = useCallback(
        async (consultationId: string) => {
            try {
                // Call REST API to end consultation
                await consultationsService.endConsultation(consultationId);

                // Also notify via WebSocket
                await socketEndConsultation(consultationId);

                setActiveConsultation(null);
                toast.success('Consultation Ended');
            } catch (error) {
                console.error('Failed to end consultation:', error);
                toast.error('Failed to End Consultation', {
                    description: error instanceof Error ? error.message : 'Please try again',
                });
                throw error;
            }
        },
        [socketEndConsultation]
    );

    // Auto-expire requests
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setPendingRequests((prev) =>
                prev.filter((r) => r.expiresAt > now)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const value: ConsultationContextValue = {
        isConnected,
        pendingRequests,
        unreadCount,
        activeConsultation,
        acceptRequest,
        rejectRequest,
        markAsRead,
        clearNotification,
        clearAllNotifications,
        joinConsultation,
        leaveConsultation,
        endConsultation,
        connect,
        disconnect,
    };

    return (
        <ConsultationContext.Provider value={value}>
            {children}
        </ConsultationContext.Provider>
    );
}

// ==========================================
// HOOK
// ==========================================

export function useConsultations() {
    const context = useContext(ConsultationContext);
    if (!context) {
        throw new Error('useConsultations must be used within a ConsultationProvider');
    }
    return context;
}

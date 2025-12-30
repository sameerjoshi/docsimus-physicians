'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '../lib/api-config';
import {
    ConsultationRequestEvent,
    ConsultationRequestCancelledEvent,
    ParticipantJoinedEvent,
    ParticipantLeftEvent,
    ConsultationEndedEvent,
    ConsultationStatusEvent,
    TypingIndicatorEvent,
    ConsultationResponsePayload,
} from '../types/consultations';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// ==========================================
// HOOK TYPES
// ==========================================

interface UseConsultationSocketOptions {
    onConsultationRequest?: (data: ConsultationRequestEvent) => void;
    onRequestCancelled?: (data: ConsultationRequestCancelledEvent) => void;
    onParticipantJoined?: (data: ParticipantJoinedEvent) => void;
    onParticipantLeft?: (data: ParticipantLeftEvent) => void;
    onConsultationEnded?: (data: ConsultationEndedEvent) => void;
    onConsultationStatus?: (data: ConsultationStatusEvent) => void;
    onConsultationNotesUpdated?: (data: any) => void;
    onTypingIndicator?: (data: TypingIndicatorEvent) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
}

interface UseConsultationSocketReturn {
    isConnected: boolean;
    socket: Socket | null;
    acceptRequest: (requestId: string) => Promise<{ success: boolean }>;
    rejectRequest: (requestId: string) => Promise<{ success: boolean }>;
    joinConsultation: (consultationId: string) => Promise<{ success: boolean; consultation?: any; error?: string }>;
    leaveConsultation: (consultationId: string) => Promise<{ success: boolean; error?: string }>;
    endConsultation: (consultationId: string) => Promise<{ success: boolean; error?: string }>;
    sendTypingIndicator: (consultationId: string, isTyping: boolean) => void;
    notifyNotesUpdated: (consultationId: string, notes: any) => void;
    connect: () => void;
    disconnect: () => void;
}

// ==========================================
// CONSULTATION SOCKET HOOK
// ==========================================

export function useConsultationSocket(options: UseConsultationSocketOptions = {}): UseConsultationSocketReturn {
    const router = useRouter();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const optionsRef = useRef(options);

    // Keep options ref up to date
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    // Get auth token
    const getToken = useCallback(() => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    }, []);

    // Connect to WebSocket
    const connect = useCallback(() => {
        const token = getToken();
        if (!token) {
            console.warn('[ConsultationSocket] No auth token available');
            return;
        }

        // Don't reconnect if already connected
        if (socketRef.current?.connected) {
            return;
        }

        // Disconnect existing socket if any
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const socket = io(`${API_CONFIG.wsURL}/consultations`, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        // Connection events
        socket.on('connect', () => {
            console.log('[ConsultationSocket] Connected');
            setIsConnected(true);
            optionsRef.current.onConnect?.();
        });

        socket.on('disconnect', (reason) => {
            console.log('[ConsultationSocket] Disconnected:', reason);
            setIsConnected(false);
            optionsRef.current.onDisconnect?.();
        });

        socket.on('connect_error', (error) => {
            console.error('[ConsultationSocket] Connection error:', error);
            optionsRef.current.onError?.(error);
        });

        // Consultation events
        socket.on('consultation-request', (data: ConsultationRequestEvent) => {
            console.log('[ConsultationSocket] Received consultation request:', data);
            optionsRef.current.onConsultationRequest?.(data);
        });

        socket.on('consultation-request-cancelled', (data: ConsultationRequestCancelledEvent) => {
            console.log('[ConsultationSocket] Request cancelled:', data);
            optionsRef.current.onRequestCancelled?.(data);
        });

        socket.on('participant-joined', (data: ParticipantJoinedEvent) => {
            console.log('[ConsultationSocket] Participant joined:', data);
            optionsRef.current.onParticipantJoined?.(data);
        });

        socket.on('participant-left', (data: ParticipantLeftEvent) => {
            console.log('[ConsultationSocket] Participant left:', data);
            optionsRef.current.onParticipantLeft?.(data);
        });

        socket.on('consultation-ended', (data: ConsultationEndedEvent) => {
            console.log('[ConsultationSocket] Consultation ended:', data);
            optionsRef.current.onConsultationEnded?.(data);
        });

        socket.on('consultation-status', (data: ConsultationStatusEvent) => {
            console.log('[ConsultationSocket] Status update:', data);
            optionsRef.current.onConsultationStatus?.(data);
        });

        socket.on('typing-indicator', (data: TypingIndicatorEvent) => {
            optionsRef.current.onTypingIndicator?.(data);
        });

        socket.on('consultation-notes-updated', (data: any) => {
            console.log('[ConsultationSocket] Notes updated:', data);
            optionsRef.current.onConsultationNotesUpdated?.(data);
        });

        socketRef.current = socket;
    }, [getToken]);

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, []);

    // Emit with acknowledgement helper
    const emitWithAck = useCallback(
        <T>(event: string, data: any): Promise<T> => {
            return new Promise((resolve, reject) => {
                if (!socketRef.current?.connected) {
                    reject(new Error('Socket not connected'));
                    return;
                }

                socketRef.current.emit(event, data, (response: T) => {
                    resolve(response);
                });
            });
        },
        []
    );

    // Respond to consultation request (accept/reject)
    const respondToRequest = useCallback(
        async (
            requestId: string,
            accept: boolean
        ): Promise<{ success: boolean; appointmentId?: string; error?: string }> => {
            const payload: ConsultationResponsePayload = { requestId, accept };
            return emitWithAck('consultation-response', payload);
        },
        [emitWithAck]
    );

    // Accept a consultation request
    const acceptRequest = useCallback(
        async (requestId: string): Promise<{ success: boolean }> => {
            try {
                const result = await respondToRequest(requestId, true);

                if (result.success && result.appointmentId) {
                    toast.success('Consultation Accepted', {
                        description: 'Redirecting to consultation...',
                    });

                    // Navigate to the join page
                    router.push(`/appointment/${result.appointmentId}/join`);

                    return { success: true };
                } else {
                    throw new Error(result.error || 'Failed to accept request');
                }
            } catch (error) {
                console.error('Failed to accept request:', error);
                toast.error('Failed to Accept', {
                    description: error instanceof Error ? error.message : 'Please try again',
                });
                return { success: false };
            }
        },
        [respondToRequest, router]
    );

    // Reject a consultation request
    const rejectRequest = useCallback(
        async (requestId: string): Promise<{ success: boolean }> => {
            try {
                const result = await respondToRequest(requestId, false);

                if (result.success) {
                    toast.info('Request Declined');
                    return { success: true };
                } else {
                    throw new Error(result.error || 'Failed to decline request');
                }
            } catch (error) {
                console.error('Failed to reject request:', error);
                toast.error(
                    'Failed to Decline',
                    {
                        description: error instanceof Error ? error.message : 'Please try again',
                    },
                );
                return { success: false };
            }
        },
        [respondToRequest]
    );

    // Join a consultation room
    const joinConsultation = useCallback(
        async (
            consultationId: string
        ): Promise<{ success: boolean; consultation?: any; error?: string }> => {
            return emitWithAck('join-consultation', { consultationId });
        },
        [emitWithAck]
    );

    // Leave a consultation room
    const leaveConsultation = useCallback(
        async (consultationId: string): Promise<{ success: boolean; error?: string }> => {
            return emitWithAck('leave-consultation', { consultationId });
        },
        [emitWithAck]
    );

    // End a consultation
    const endConsultation = useCallback(
        async (consultationId: string): Promise<{ success: boolean; error?: string }> => {
            return emitWithAck('end-consultation', { consultationId });
        },
        [emitWithAck]
    );

    // Send typing indicator
    const sendTypingIndicator = useCallback(
        (consultationId: string, isTyping: boolean) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit('typing-indicator', { consultationId, isTyping });
            }
        },
        []
    );

    // Notify that consultation notes were updated
    const notifyNotesUpdated = useCallback(
        (consultationId: string, notes: any) => {
            if (socketRef.current?.connected) {
                socketRef.current.emit('consultation-notes-updated', {
                    consultationId,
                    doctorNotes: notes.doctorNotes,
                    prescription: notes.prescription,
                    followUpDate: notes.followUpDate,
                    updatedAt: new Date().toISOString(),
                });
            }
        },
        []
    );

    // Auto-connect on mount if token exists
    useEffect(() => {
        const token = getToken();
        if (token) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [connect, disconnect, getToken]);

    return {
        isConnected,
        socket: socketRef.current,
        acceptRequest,
        rejectRequest,
        joinConsultation,
        leaveConsultation,
        endConsultation,
        sendTypingIndicator,
        notifyNotesUpdated,
        connect,
        disconnect,
    };
}

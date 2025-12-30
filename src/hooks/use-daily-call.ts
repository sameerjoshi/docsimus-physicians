'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDaily, useLocalSessionId, useParticipantIds, useMeetingState, useScreenShare, useDailyEvent } from '@daily-co/daily-react';
import { toast } from 'sonner';

export interface CallState {
    isConnecting: boolean;
    isConnected: boolean;
    isLeaving: boolean;
    error: string | null;
    callDuration: number;
}

export function useDailyCall() {
    const daily = useDaily();
    const localSessionId = useLocalSessionId();
    const remoteParticipantIds = useParticipantIds({ filter: 'remote' });
    const meetingState = useMeetingState();
    const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();

    const [error, setError] = useState<string | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const callStartTimeRef = useRef<number | null>(null);
    const [meetingEndedByOther, setMeetingEndedByOther] = useState(false);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isConnecting = meetingState === 'joining-meeting';
    const isConnected = meetingState === 'joined-meeting';
    const isReady = meetingState === 'new' || meetingState === 'left-meeting';
    const remoteParticipantId = remoteParticipantIds[0] || null;

    // Handle meeting ended by room owner or other participant
    useDailyEvent('left-meeting', useCallback((event) => {
        // Only set meetingEndedByOther if we didn't initiate the leave
        if (!isLeaving && event) {
            console.log('[DailyCall] Meeting ended, reason:', event);
            setMeetingEndedByOther(true);
        }
    }, [isLeaving]));

    // Handle error events from Daily
    useDailyEvent('error', useCallback((event) => {
        console.error('[DailyCall] Daily error event:', event);
        // Don't show error if meeting just ended normally
        if (event?.error?.type === 'meeting-ended') {
            setMeetingEndedByOther(true);
        } else if (event?.errorMsg) {
            setError(event.errorMsg);
        }
    }, []));

    // Start duration tracking when connected
    useEffect(() => {
        if (isConnected) {
            // Start tracking when we connect
            if (!callStartTimeRef.current) {
                callStartTimeRef.current = Date.now();
            }

            // Start the interval
            durationIntervalRef.current = setInterval(() => {
                if (callStartTimeRef.current) {
                    setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
                }
            }, 1000);

            return () => {
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                }
            };
        } else {
            // Reset when disconnected
            callStartTimeRef.current = null;
            setCallDuration(0);
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }
        }
    }, [isConnected]);

    // Join call
    const joinCall = useCallback(async (roomUrl: string, token?: string) => {
        if (!daily) {
            setError('Daily call object not initialized');
            return;
        }

        if (isConnecting || isConnected) {
            console.warn('[DailyCall] Already connecting or connected');
            return;
        }

        // Wait for call object to be in a ready state
        if (!isReady) {
            console.warn('[DailyCall] Call object not ready, current state:', meetingState);
            return;
        }

        setError(null);

        try {
            await daily.join({ url: roomUrl, token });
            toast.success('Connected to consultation');
        } catch (err) {
            console.error('[DailyCall] Failed to join:', err);
            const message = err instanceof Error ? err.message : 'Failed to join call';
            setError(message);
            toast.error(message);
        }
    }, [daily, isConnecting, isConnected, isReady, meetingState]);

    // Leave call
    const leaveCall = useCallback(async () => {
        if (!daily) return;

        setIsLeaving(true);
        try {
            await daily.leave();
            toast.info('Left consultation');
        } catch (err) {
            console.error('[DailyCall] Error leaving:', err);
        } finally {
            setIsLeaving(false);
            setCallDuration(0);
            callStartTimeRef.current = null;
        }
    }, [daily]);

    // Toggle microphone
    const toggleMic = useCallback(() => {
        if (!daily) return;
        const localParticipant = daily.participants().local;
        daily.setLocalAudio(!localParticipant?.audio);
    }, [daily]);

    // Toggle camera
    const toggleCamera = useCallback(() => {
        if (!daily) return;
        const localParticipant = daily.participants().local;
        daily.setLocalVideo(!localParticipant?.video);
    }, [daily]);

    // Toggle screen share
    const toggleScreenShare = useCallback(async () => {
        try {
            if (isSharingScreen) {
                stopScreenShare();
            } else {
                await startScreenShare();
            }
        } catch (err) {
            console.error('[DailyCall] Screen share error:', err);
            // Don't throw - let the component handle the error
            throw err;
        }
    }, [isSharingScreen, startScreenShare, stopScreenShare]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Reset meeting ended state
    const resetMeetingEnded = useCallback(() => {
        setMeetingEndedByOther(false);
    }, []);

    return {
        // State
        isConnecting,
        isConnected,
        isReady,
        isLeaving,
        error,
        callDuration,
        isSharingScreen,
        meetingEndedByOther,

        // Participant IDs
        localSessionId,
        remoteParticipantId,

        // Actions
        joinCall,
        leaveCall,
        toggleMic,
        toggleCamera,
        toggleScreenShare,
        clearError,
        resetMeetingEnded,
    };
}

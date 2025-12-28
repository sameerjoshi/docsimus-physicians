'use client';

import React, { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { useConsultationSocket } from '../../hooks/use-consultation-socket';
import {
  ConsultationRequestEvent,
  ConsultationNotification,
  Consultation,
  ConsultationRequestCancelledEvent,
} from '../../types/consultations';
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

  // Actions
  acceptRequest: (requestId: string) => Promise<{ appointmentId: string }>;
  rejectRequest: (requestId: string) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
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

  // Handle incoming consultation request (for notifications list only)
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
  }, []);

  // Handle request cancelled by patient
  const handleRequestCancelled = useCallback((data: ConsultationRequestCancelledEvent) => {
    setPendingRequests((prev) =>
      prev.filter((r) => r.requestId !== data.requestId)
    );
  }, []);

  // Use the consultation socket hook
  const { isConnected, respondToRequest } = useConsultationSocket({
    onConsultationRequest: handleConsultationRequest,
    onRequestCancelled: handleRequestCancelled,
  });

  // Accept a consultation request
  const acceptRequest = useCallback(
    async (requestId: string): Promise<{ appointmentId: string }> => {
      try {
        const result = await respondToRequest(requestId, true);

        if (result.success && result.appointmentId) {
          // Remove from pending
          setPendingRequests((prev) =>
            prev.filter((r) => r.requestId !== requestId)
          );

          toast.success('Consultation Accepted', {
            description: 'Redirecting to consultation...',
          });

          return { appointmentId: result.appointmentId };
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
    acceptRequest,
    rejectRequest,
    markAsRead,
    clearNotification,
    clearAllNotifications,
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

export function useConsultationContext() {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultations must be used within a ConsultationProvider');
  }
  return context;
}

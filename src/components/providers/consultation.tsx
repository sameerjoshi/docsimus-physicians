'use client';

import React, { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import { useConsultationSocket } from '../../hooks/use-consultation-socket';
import {
  ConsultationRequestEvent,
  ConsultationNotification,
  Consultation,
  ConsultationRequestCancelledEvent,
} from '../../types/consultations';

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
  acceptRequest: (requestId: string) => Promise<void>;
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
  const { isConnected, acceptRequest, rejectRequest } = useConsultationSocket({
    onConsultationRequest: handleConsultationRequest,
    onRequestCancelled: handleRequestCancelled,
  });

  // Accept a consultation request
  const handleAcceptRequest = useCallback(
    async (requestId: string): Promise<void> => {
      const result = await acceptRequest(requestId);

      if (result.success) {
        // Remove from pending
        setPendingRequests((prev) =>
          prev.filter((r) => r.requestId !== requestId)
        );
      }
    },
    [acceptRequest]
  );

  // Reject a consultation request
  const handleRejectRequest = useCallback(
    async (requestId: string) => {
      const result = await rejectRequest(requestId);

      if (result.success) {
        // Remove from pending
        setPendingRequests((prev) =>
          prev.filter((r) => r.requestId !== requestId)
        );
      }
    },
    [rejectRequest]
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
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
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

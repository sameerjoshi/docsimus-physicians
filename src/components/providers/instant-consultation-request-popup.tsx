'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncomingRequestPopup } from '../consultations/IncomingRequestPopup';
import { useConsultationSocket } from '@/src/hooks/useConsultationSocket';
import { ConsultationRequestEvent, ConsultationRequestCancelledEvent } from '@/src/types/consultations';
import { toast } from 'sonner';

/**
 * Global provider component that renders the IncomingRequestPopup
 * and manages its own state for incoming consultation requests.
 * 
 * This should be placed near the root of the app (e.g., in layout.tsx)
 * to ensure it can show popups triggered from WebSocket events.
 */
export function InstantConsultationRequestPopupProvider() {
  const router = useRouter();
  const [data, setData] = useState<ConsultationRequestEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle incoming consultation request
  const handleConsultationRequest = useCallback((data: ConsultationRequestEvent) => {
    // Show the popup with the new notification
    setData(data);

    // TODO: Play notification sound (if available)
    // try {
    //   const audio = new Audio('/sounds/notification.mp3');
    //   audio.volume = 0.5;
    //   audio.play().catch(() => { });
    // } catch { }
  }, []);

  // Handle request cancelled by patient
  const handleRequestCancelled = useCallback((data: ConsultationRequestCancelledEvent) => {
    // Hide the popup if this request was being shown
    setData((prev) => {
      if (prev?.requestId === data.requestId) {
        return null;
      }
      return prev;
    });

    toast.info('Request Cancelled', {
      description: 'The patient cancelled the consultation request',
    });
  }, []);

  const { respondToRequest } = useConsultationSocket({
    onConsultationRequest: handleConsultationRequest,
    onRequestCancelled: handleRequestCancelled,
  });

  // Accept a consultation request
  const acceptRequest = useCallback(
    async (requestId: string): Promise<void> => {
      setIsLoading(true);
      try {
        const result = await respondToRequest(requestId, true);

        if (result.success && result.appointmentId) {
          // Hide the popup
          setData(null);

          toast.success('Consultation Accepted', {
            description: 'Redirecting to consultation...',
          });

          // Navigate to the join page
          router.push(`/appointment/${result.appointmentId}/join`);
        } else {
          throw new Error(result.error || 'Failed to accept request');
        }
      } catch (error) {
        console.error('Failed to accept request:', error);
        toast.error('Failed to Accept', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [respondToRequest, router]
  );

  // Reject a consultation request
  const rejectRequest = useCallback(
    async (requestId: string) => {
      setIsLoading(true);
      try {
        const result = await respondToRequest(requestId, false);

        if (result.success) {
          // Hide the popup
          setData(null);

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
      } finally {
        setIsLoading(false);
      }
    },
    [respondToRequest]
  );

  // Handle close/dismiss
  const handleClose = useCallback(() => {
    setData(null);
  }, []);

  // Auto-expire the visible notification
  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(data.expiresAt);
      const now = new Date();
      if (expiresAt <= now) {
        setData(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  return (
    <IncomingRequestPopup
      isOpen={!!data}
      onClose={handleClose}
      data={data}
      onAccept={() => acceptRequest(data.requestId)}
      onReject={() => rejectRequest(data.requestId)}
      isLoading={isLoading}
    />
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncomingRequestPopup } from '../consultations/IncomingRequestPopup';
import { useConsultationSocket } from '@/src/hooks/use-consultation-socket';
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

  const { acceptRequest, rejectRequest } = useConsultationSocket({
    onConsultationRequest: handleConsultationRequest,
    onRequestCancelled: handleRequestCancelled,
  });

  // Accept a consultation request
  const handleAcceptRequest = useCallback(
    async (requestId: string): Promise<void> => {
      setIsLoading(true);
      const result = await acceptRequest(requestId);

      if (result.success) {
        // Hide the popup
        setData(null);
      }
      setIsLoading(false);
    },
    [acceptRequest, router]
  );

  // Reject a consultation request
  const handleRejectRequest = useCallback(
    async (requestId: string) => {
      setIsLoading(true);
      const result = await rejectRequest(requestId);

      if (result.success) {
        // Hide the popup
        setData(null);
      }
      setIsLoading(false);
    },
    [rejectRequest]
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
      onAccept={() => handleAcceptRequest(data.requestId)}
      onReject={() => handleRejectRequest(data.requestId)}
      isLoading={isLoading}
    />
  );
}

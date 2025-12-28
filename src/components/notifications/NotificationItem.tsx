'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Check, X, User, Clock, FileText, Stethoscope } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  patientName?: string;
  patientAvatar?: string | null;
  reason?: string;
  symptoms?: string;
  expiresAt?: Date;
}

interface NotificationItemProps {
  notification: Notification;
  onAccept: () => void;
  onDecline: () => void;
  onMarkAsRead: () => void;
  onDismiss: () => void;
}

export function NotificationItem({
  notification,
  onAccept,
  onDecline,
  onMarkAsRead,
  onDismiss,
}: NotificationItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Calculate remaining time for expiration
  useEffect(() => {
    if (!notification.expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const expiresAt = new Date(notification.expiresAt!);
      const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [notification.expiresAt]);

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

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await onDecline();
    } finally {
      setIsLoading(false);
    }
  };

  const isConsultationRequest = notification.type === 'consultation_request';
  const isExpired = timeRemaining !== null && timeRemaining <= 0;
  const isUrgent = timeRemaining !== null && timeRemaining <= 15;

  return (
    <div
      className={`p-4 hover:bg-accent/50 transition-colors relative ${!notification.read ? 'bg-primary/5' : ''
        } ${isUrgent && !isExpired ? 'border-l-4 border-l-orange-500' : ''}`}
      onClick={() => !notification.read && onMarkAsRead()}
    >
      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {notification.patientAvatar ? (
            <img
              src={notification.patientAvatar}
              alt={notification.patientName || 'Patient'}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
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
            <p className="text-xs font-medium text-foreground mb-1">
              {notification.patientName}
            </p>
          )}

          {/* Reason / Symptoms */}
          {(notification.reason || notification.symptoms) && (
            <div className="text-xs text-muted-foreground space-y-1 mb-2 bg-accent/50 rounded-md p-2">
              {notification.reason && (
                <div className="flex items-start gap-1.5">
                  <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{notification.reason}</span>
                </div>
              )}
              {notification.symptoms && (
                <div className="flex items-start gap-1.5">
                  <Stethoscope className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{notification.symptoms}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span>{formatTimestamp(notification.timestamp)}</span>
            {timeRemaining !== null && (
              <span
                className={`flex items-center gap-1 ${isExpired
                  ? 'text-red-500'
                  : isUrgent
                    ? 'text-orange-500 font-medium'
                    : 'text-muted-foreground'
                  }`}
              >
                <Clock className="h-3 w-3" />
                {formatTimeRemaining(timeRemaining)}
              </span>
            )}
          </div>

          {/* Action Buttons for Consultation Requests */}
          {isConsultationRequest && !isExpired && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                {isLoading ? 'Accepting...' : 'Accept'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecline}
                disabled={isLoading}
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </div>
          )}

          {isConsultationRequest && isExpired && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md p-2 text-center">
              This request has expired
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

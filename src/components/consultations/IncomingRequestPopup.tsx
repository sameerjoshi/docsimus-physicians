'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useConsultations as useConsultationContext } from '@/src/components/providers/consultation';
import { ConsultationNotification } from '@/src/types/consultations';
import {
    Phone,
    X,
    User,
    Clock,
    FileText,
    Stethoscope,
    Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function IncomingRequestPopup() {
    const { pendingRequests, acceptRequest, rejectRequest } = useConsultationContext();
    const [visibleRequest, setVisibleRequest] = useState<ConsultationNotification | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(60);

    // Show the most recent unread request
    useEffect(() => {
        const unreadRequest = pendingRequests.find((r) => !r.read);
        if (unreadRequest && (!visibleRequest || visibleRequest.requestId !== unreadRequest.requestId)) {
            setVisibleRequest(unreadRequest);
        }
    }, [pendingRequests, visibleRequest]);

    // Timer countdown
    useEffect(() => {
        if (!visibleRequest) return;

        const updateTimer = () => {
            const now = new Date();
            const expiresAt = new Date(visibleRequest.expiresAt);
            const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
            setTimeRemaining(remaining);

            if (remaining <= 0) {
                setVisibleRequest(null);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [visibleRequest]);

    const handleAccept = async () => {
        if (!visibleRequest) return;
        setIsLoading(true);
        try {
            await acceptRequest(visibleRequest.requestId);
            setVisibleRequest(null);
        } catch {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!visibleRequest) return;
        setIsLoading(true);
        try {
            await rejectRequest(visibleRequest.requestId);
            setVisibleRequest(null);
        } catch {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismiss = () => {
        setVisibleRequest(null);
    };

    if (!visibleRequest) return null;

    const isUrgent = timeRemaining <= 15;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.9 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
            >
                <Card className={`p-4 shadow-2xl border-2 ${isUrgent ? 'border-orange-500 animate-pulse' : 'border-primary'}`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    {visibleRequest.patient.avatar ? (
                                        <img
                                            src={visibleRequest.patient.avatar}
                                            alt={visibleRequest.patient.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <User className="h-6 w-6 text-primary" />
                                    )}
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-green-500 animate-pulse" />
                                    Incoming Consultation
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {visibleRequest.patient.name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-accent rounded-full transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Reason / Symptoms */}
                    {(visibleRequest.reason || visibleRequest.symptoms) && (
                        <div className="bg-accent/50 rounded-lg p-3 mb-4 space-y-2">
                            {visibleRequest.reason && (
                                <div className="flex items-start gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="line-clamp-2">{visibleRequest.reason}</span>
                                </div>
                            )}
                            {visibleRequest.symptoms && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="line-clamp-2">{visibleRequest.symptoms}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className={`h-4 w-4 ${isUrgent ? 'text-orange-500' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${isUrgent ? 'text-orange-500' : 'text-muted-foreground'}`}>
                            Expires in {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                        {/* Progress bar */}
                        <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-orange-500' : 'bg-primary'}`}
                                style={{ width: `${(timeRemaining / 60) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            size="lg"
                            onClick={handleAccept}
                            disabled={isLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Check className="h-5 w-5 mr-2" />
                            {isLoading ? 'Accepting...' : 'Accept'}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleReject}
                            disabled={isLoading}
                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <X className="h-5 w-5 mr-2" />
                            Decline
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}

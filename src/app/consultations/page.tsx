'use client';

import { useState } from 'react';
import { useConsultations } from '@/src/hooks/useConsultations';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { LoadingSpinner } from '@/src/components/loading-spinner';
import { ConsultationDetailModal } from '@/src/components/consultations';
import { Consultation } from '@/src/types/consultations';
import {
    Calendar,
    Clock,
    User,
    FileText,
    ChevronRight,
    Video,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    SCHEDULED: {
        label: 'Scheduled',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        icon: Calendar,
    },
    IN_PROGRESS: {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: Video,
    },
    COMPLETED: {
        label: 'Completed',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: CheckCircle,
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        icon: XCircle,
    },
    NO_SHOW: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        icon: AlertCircle,
    },
};

export default function ConsultationsPage() {
    const {
        consultations,
        total,
        hasMore,
        isLoading,
        isFetching,
        loadMore,
        updateNotes,
        isUpdatingNotes,
    } = useConsultations();

    const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleUpdateNotes = async (consultationId: string, notes: any) => {
        await updateNotes({ consultationId, notes });
        setSelectedConsultation(null);
    };

    if (isLoading) {
        return (
            <>
                <AppHeader />
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </>
        );
    }

    return (
        <>
            <AppHeader />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-6 max-w-6xl">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Consultations</h1>
                        <p className="text-muted-foreground">
                            View and manage your consultation history
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4">
                            <div className="text-2xl font-bold">{total}</div>
                            <div className="text-sm text-muted-foreground">Total Consultations</div>
                        </Card>
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {consultations.filter((c) => c.status === 'COMPLETED').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Completed</div>
                        </Card>
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-yellow-600">
                                {consultations.filter((c) => c.status === 'IN_PROGRESS').length}
                            </div>
                            <div className="text-sm text-muted-foreground">In Progress</div>
                        </Card>
                        <Card className="p-4">
                            <div className="text-2xl font-bold text-blue-600">
                                {consultations.filter((c) => c.status === 'SCHEDULED').length}
                            </div>
                            <div className="text-sm text-muted-foreground">Scheduled</div>
                        </Card>
                    </div>

                    {/* Consultations List */}
                    {consultations.length === 0 ? (
                        <Card className="p-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Consultations Yet</h3>
                            <p className="text-muted-foreground">
                                Your consultation history will appear here once you complete consultations.
                            </p>
                        </Card>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-3"
                        >
                            {consultations.map((consultation) => {
                                const statusConfig = STATUS_CONFIG[consultation.status] || STATUS_CONFIG.SCHEDULED;
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div key={consultation.id} variants={staggerItem}>
                                        <Card
                                            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => setSelectedConsultation(consultation)}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Patient Avatar */}
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-medium truncate">
                                                            {consultation.patient?.name || 'Patient'}
                                                        </h3>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                                                        >
                                                            <StatusIcon className="h-3 w-3" />
                                                            {statusConfig.label}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(consultation.appointment?.scheduledAt || consultation.createdAt)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4" />
                                                            {formatTime(consultation.appointment?.scheduledAt || consultation.createdAt)}
                                                        </span>
                                                        {consultation.appointment?.type === 'INSTANT' && (
                                                            <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full">
                                                                Instant
                                                            </span>
                                                        )}
                                                    </div>

                                                    {consultation.appointment?.reason && (
                                                        <p className="text-sm text-muted-foreground mt-1 truncate">
                                                            {consultation.appointment.reason}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Arrow */}
                                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Load More */}
                    {hasMore && (
                        <div className="text-center mt-6">
                            <Button
                                variant="outline"
                                onClick={loadMore}
                                disabled={isFetching}
                            >
                                {isFetching ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            {selectedConsultation && (
                <ConsultationDetailModal
                    consultation={selectedConsultation}
                    onClose={() => setSelectedConsultation(null)}
                    onUpdateNotes={handleUpdateNotes}
                    isUpdating={isUpdatingNotes}
                />
            )}
        </>
    );
}

'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Consultation, UpdateConsultationNotesDto } from '@/src/types/consultations';
import {
    X,
    User,
    Calendar,
    Clock,
    FileText,
    Stethoscope,
    Pill,
    CalendarClock,
    Save,
    Video,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

interface ConsultationDetailModalProps {
    consultation: Consultation;
    onClose: () => void;
    onUpdateNotes: (consultationId: string, notes: UpdateConsultationNotesDto) => Promise<void>;
    isUpdating: boolean;
}

export function ConsultationDetailModal({
    consultation,
    onClose,
    onUpdateNotes,
    isUpdating,
}: ConsultationDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState<UpdateConsultationNotesDto>({
        notes: consultation.notes || '',
        diagnosis: consultation.diagnosis || '',
        prescription: consultation.prescription || '',
        followUpDate: consultation.followUpDate || '',
        followUpNotes: consultation.followUpNotes || '',
    });

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSave = async () => {
        await onUpdateNotes(consultation.id, notes);
        setIsEditing(false);
    };

    const isCompleted = consultation.status === 'COMPLETED';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-background z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold">
                                {consultation.patient?.name || 'Patient'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {consultation.patient?.email}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Consultation Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">
                                {formatDateTime(consultation.appointment?.scheduledAt || consultation.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">
                                {consultation.startedAt && consultation.endedAt
                                    ? `${Math.round((new Date(consultation.endedAt).getTime() - new Date(consultation.startedAt).getTime()) / 60000)} min`
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium capitalize">
                                {consultation.appointment?.type?.toLowerCase() || 'Consultation'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            {consultation.status === 'COMPLETED' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium capitalize">
                                {consultation.status.toLowerCase().replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Reason / Symptoms */}
                    {(consultation.appointment?.reason || consultation.appointment?.symptoms) && (
                        <div className="space-y-3">
                            <h3 className="font-medium">Patient's Concern</h3>
                            {consultation.appointment?.reason && (
                                <div className="bg-accent/50 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <p className="text-sm">{consultation.appointment.reason}</p>
                                    </div>
                                </div>
                            )}
                            {consultation.appointment?.symptoms && (
                                <div className="bg-accent/50 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                        <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <p className="text-sm">{consultation.appointment.symptoms}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">Medical Notes</h3>
                            {isCompleted && !isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Notes
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Consultation Notes
                                    </label>
                                    <textarea
                                        value={notes.notes}
                                        onChange={(e) => setNotes({ ...notes, notes: e.target.value })}
                                        className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter consultation notes..."
                                    />
                                </div>

                                {/* Diagnosis */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Diagnosis
                                    </label>
                                    <textarea
                                        value={notes.diagnosis}
                                        onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
                                        className="w-full min-h-[60px] p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter diagnosis..."
                                    />
                                </div>

                                {/* Prescription */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Prescription
                                    </label>
                                    <textarea
                                        value={notes.prescription}
                                        onChange={(e) => setNotes({ ...notes, prescription: e.target.value })}
                                        className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter prescription..."
                                    />
                                </div>

                                {/* Follow-up */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Follow-up Date
                                        </label>
                                        <input
                                            type="date"
                                            value={notes.followUpDate?.split('T')[0] || ''}
                                            onChange={(e) => setNotes({ ...notes, followUpDate: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Follow-up Notes
                                        </label>
                                        <input
                                            type="text"
                                            value={notes.followUpNotes}
                                            onChange={(e) => setNotes({ ...notes, followUpNotes: e.target.value })}
                                            className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Follow-up instructions..."
                                        />
                                    </div>
                                </div>

                                {/* Save/Cancel */}
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setNotes({
                                                notes: consultation.notes || '',
                                                diagnosis: consultation.diagnosis || '',
                                                prescription: consultation.prescription || '',
                                                followUpDate: consultation.followUpDate || '',
                                                followUpNotes: consultation.followUpNotes || '',
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={isUpdating}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {isUpdating ? 'Saving...' : 'Save Notes'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Display Notes */}
                                {consultation.notes && (
                                    <div className="bg-accent/50 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                                                <p className="text-sm">{consultation.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {consultation.diagnosis && (
                                    <div className="bg-accent/50 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Diagnosis</p>
                                                <p className="text-sm">{consultation.diagnosis}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {consultation.prescription && (
                                    <div className="bg-accent/50 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Prescription</p>
                                                <p className="text-sm whitespace-pre-wrap">{consultation.prescription}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {consultation.followUpDate && (
                                    <div className="bg-accent/50 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <CalendarClock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Follow-up</p>
                                                <p className="text-sm">
                                                    {formatDateTime(consultation.followUpDate)}
                                                    {consultation.followUpNotes && ` - ${consultation.followUpNotes}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!consultation.notes && !consultation.diagnosis && !consultation.prescription && (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No notes added yet</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </Card>
        </div>
    );
}

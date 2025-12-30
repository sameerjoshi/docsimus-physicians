// ==========================================
// CONSULTATION TYPE DEFINITIONS
// ==========================================

export type ConsultationStatus =
    | 'SCHEDULED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';

export type InstantRequestStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'EXPIRED'
    | 'CANCELLED';

export interface Patient {
    id: string;
    name: string | null;
    email: string;
    avatar?: string | null;
}

export interface Doctor {
    id: string;
    name: string | null;
    email: string;
    avatar?: string | null;
    specialization?: string;
}

export interface Consultation {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    status: ConsultationStatus;
    startedAt?: string;
    endedAt?: string;
    doctorNotes?: string;
    prescription?: string;
    followUpDate?: string;
    createdAt: string;
    updatedAt: string;
    patient?: Patient;
    doctor?: Doctor;
    appointment?: {
        id: string;
        reason?: string;
        symptoms?: string;
        scheduledAt: string;
        type: 'SCHEDULED' | 'INSTANT';
        contextSummary?: string;
        patient?: Patient;
        doctor?: Doctor;
    };
    // Video room information
    roomUrl?: string;
    dailyRoomName?: string;
    roomExpiresAt?: string;
    token?: string;
    actualDuration?: number;
}

export interface InstantConsultationRequest {
    id: string;
    patientId: string;
    doctorId: string;
    reason?: string;
    symptoms?: string;
    status: InstantRequestStatus;
    chatSessionId?: string;
    createdAt: string;
    expiresAt: string;
    patient?: Patient;
}

// ==========================================
// WEBSOCKET EVENT PAYLOADS
// ==========================================

export interface ConsultationRequestEvent {
    requestId: string;
    patient: {
        id: string;
        name: string;
        avatar?: string | null;
    };
    reason?: string;
    symptoms?: string;
    hasChatContext: boolean;
    expiresAt: string;
    expiresInSeconds: number;
}

export interface ConsultationAcceptedEvent {
    requestId: string;
    appointmentId: string;
    message: string;
}

export interface ConsultationRejectedEvent {
    requestId: string;
    reason: string;
    expired?: boolean;
}

export interface ConsultationRequestCancelledEvent {
    requestId: string;
}

export interface ParticipantJoinedEvent {
    consultationId: string;
    userId: string;
    timestamp: string;
}

export interface ParticipantLeftEvent {
    consultationId: string;
    userId: string;
    timestamp: string;
}

export interface ConsultationEndedEvent {
    consultationId: string;
    endedBy: string;
    timestamp: string;
}

export interface ConsultationNotesUpdatedEvent {
    consultationId: string;
    doctorNotes?: string;
    prescription?: string;
    followUpDate?: string;
    updatedAt: string;
}

export interface ConsultationStatusEvent {
    consultationId: string;
    status: ConsultationStatus;
    timestamp: string;
    [key: string]: any;
}

export interface TypingIndicatorEvent {
    consultationId: string;
    userId: string;
    isTyping: boolean;
}

// ==========================================
// API REQUEST/RESPONSE TYPES
// ==========================================

export interface UpdateConsultationNotesDto {
    doctorNotes?: string;
    prescription?: string;
    followUpDate?: string;
}

export interface ConsultationResponsePayload {
    requestId: string;
    accept: boolean;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface ConsultationNotification {
    id: string;
    type: 'consultation_request';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    requestId: string;
    patient: {
        id: string;
        name: string;
        avatar?: string | null;
    };
    reason?: string;
    symptoms?: string;
    hasChatContext: boolean;
    expiresAt: Date;
    expiresInSeconds: number;
}

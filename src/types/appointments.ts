// ==========================================
// APPOINTMENTS TYPE DEFINITIONS
// ==========================================

export type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';

export type AppointmentType = 'SCHEDULED' | 'INSTANT';

export interface Patient {
    id: string;
    name: string | null;
    email: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    endTime?: string;
    duration: number;
    type: AppointmentType;
    status: AppointmentStatus;
    reason?: string;
    symptoms?: string;
    notes?: string;
    contextSummary?: string;
    meetingLink?: string;
    createdAt: string;
    updatedAt: string;
    patient?: Patient;
}

// ==========================================
// QUERY PARAMETERS
// ==========================================

export interface QueryAppointmentsParams {
    status?: AppointmentStatus;
    type?: AppointmentType;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
}

// ==========================================
// RESPONSE TYPES
// ==========================================

export interface PaginatedAppointmentsResponse {
    appointments: Appointment[];
    total: number;
    limit: number;
    offset: number;
}

export interface WeeklyStats {
    totalAppointments: number;
    completed: number;
    cancelled: number;
    pending: number;
}

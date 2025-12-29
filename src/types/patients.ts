// ==========================================
// PATIENTS TYPE DEFINITIONS
// ==========================================

export interface PatientAppointment {
    id: string;
    scheduledAt: string;
    duration: number;
    type: 'SCHEDULED' | 'INSTANT';
    status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    reason?: string;
    symptoms?: string;
    consultation?: {
        id: string;
        status: string;
        doctorNotes?: string;
        prescription?: string;
        followUpDate?: string;
    };
}

export interface PatientRecord {
    id: string;
    name: string | null;
    email: string;
    appointments?: PatientAppointment[];
    totalAppointments?: number;
    lastAppointment?: {
        scheduledAt: string;
        reason?: string;
    };
}

export interface PatientStats {
    totalPatients: number;
    totalAppointments: number;
    newPatientsThisMonth: number;
}

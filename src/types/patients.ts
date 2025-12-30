// ==========================================
// PATIENTS TYPE DEFINITIONS
// ==========================================

import { AppointmentStatus, AppointmentType } from "./appointments";

export interface PatientAppointment {
    id: string;
    scheduledAt: string;
    duration: number;
    type: AppointmentType;
    status: AppointmentStatus;
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

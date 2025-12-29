import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';
import { PatientRecord, PatientStats, PatientAppointment } from '../types/patients';
import { Appointment } from '../types/appointments';

// ==========================================
// PATIENTS SERVICE
// ==========================================

export class PatientsService {
    /**
     * Get all unique patients from doctor's appointments
     */
    async getPatients(): Promise<PatientRecord[]> {
        // Fetch all appointments for the doctor
        const response = await apiClient.get<{ appointments: Appointment[] }>(
            API_ENDPOINTS.appointments.list
        );
        
        // Group appointments by patient
        const patientMap = new Map<string, PatientRecord>();
        
        response.appointments.forEach((appointment) => {
            if (appointment.patient) {
                const patientId = appointment.patient.id;
                
                if (!patientMap.has(patientId)) {
                    patientMap.set(patientId, {
                        id: patientId,
                        name: appointment.patient.name,
                        email: appointment.patient.email,
                        appointments: [],
                        totalAppointments: 0,
                    });
                }
                
                const patient = patientMap.get(patientId)!;
                patient.totalAppointments = (patient.totalAppointments || 0) + 1;
                
                // Update last appointment if this is more recent
                const appointmentDate = new Date(appointment.scheduledAt);
                if (!patient.lastAppointment || 
                    new Date(patient.lastAppointment.scheduledAt) < appointmentDate) {
                    patient.lastAppointment = {
                        scheduledAt: appointment.scheduledAt,
                        reason: appointment.reason,
                    };
                }
            }
        });
        
        return Array.from(patientMap.values());
    }

    /**
     * Get patient statistics
     */
    async getStats(): Promise<PatientStats> {
        const response = await apiClient.get<{ appointments: Appointment[] }>(
            API_ENDPOINTS.appointments.list
        );
        
        const uniquePatients = new Set<string>();
        let newPatientsThisMonth = 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const firstAppointmentDates = new Map<string, Date>();
        
        response.appointments.forEach((appointment) => {
            if (appointment.patient) {
                const patientId = appointment.patient.id;
                uniquePatients.add(patientId);
                
                const appointmentDate = new Date(appointment.scheduledAt);
                
                // Track first appointment for each patient
                if (!firstAppointmentDates.has(patientId) || 
                    appointmentDate < firstAppointmentDates.get(patientId)!) {
                    firstAppointmentDates.set(patientId, appointmentDate);
                }
            }
        });
        
        // Count new patients this month (first appointment was this month)
        firstAppointmentDates.forEach((firstDate) => {
            if (firstDate.getMonth() === currentMonth && 
                firstDate.getFullYear() === currentYear) {
                newPatientsThisMonth++;
            }
        });
        
        return {
            totalPatients: uniquePatients.size,
            totalAppointments: response.appointments.length,
            newPatientsThisMonth,
        };
    }

    /**
     * Get appointments for a specific patient
     */
    async getPatientAppointments(patientId: string): Promise<PatientAppointment[]> {
        const response = await apiClient.get<{ appointments: Appointment[] }>(
            API_ENDPOINTS.appointments.list
        );
        
        return response.appointments
            .filter(apt => apt.patient?.id === patientId)
            .map(apt => ({
                id: apt.id,
                scheduledAt: apt.scheduledAt,
                duration: apt.duration,
                type: apt.type,
                status: apt.status,
                reason: apt.reason,
                symptoms: apt.symptoms,
                consultation: apt.consultation ? {
                    id: apt.consultation.id,
                    status: apt.consultation.status,
                    doctorNotes: apt.consultation.doctorNotes,
                    prescription: apt.consultation.prescription,
                    followUpDate: apt.consultation.followUpDate,
                } : undefined,
            }))
            .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
    }
}

// Export singleton instance
export const patientsService = new PatientsService();

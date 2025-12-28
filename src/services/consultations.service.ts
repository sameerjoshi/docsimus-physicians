import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';
import { Consultation, InstantConsultationRequest, UpdateConsultationNotesDto } from '../types/consultations';

// ==========================================
// CONSULTATIONS SERVICE
// ==========================================

export class ConsultationsService {
    /**
     * Get pending instant consultation requests
     */
    async getPendingRequests(): Promise<InstantConsultationRequest[]> {
        return apiClient.get<InstantConsultationRequest[]>(API_ENDPOINTS.consultations.pendingRequests);
    }

    /**
     * Create a consultation room for an appointment
     */
    async createConsultation(appointmentId: string): Promise<Consultation> {
        return apiClient.post<Consultation>(API_ENDPOINTS.consultations.create, { appointmentId });
    }

    /**
     * Get a single consultation by ID
     */
    async getConsultation(consultationId: string): Promise<Consultation> {
        return apiClient.get<Consultation>(
            API_ENDPOINTS.consultations.getById(consultationId)
        );
    }

    /**
     * Update consultation notes (diagnosis, prescription, follow-up)
     */
    async updateNotes(
        consultationId: string,
        notes: UpdateConsultationNotesDto
    ): Promise<Consultation> {
        return apiClient.patch<Consultation>(
            API_ENDPOINTS.consultations.updateNotes(consultationId),
            notes
        );
    }
}

// Export singleton instance
export const consultationsService = new ConsultationsService();

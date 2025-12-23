import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';
import {
    Consultation,
    ConsultationHistoryResponse,
    UpdateConsultationNotesDto,
} from '../types/consultations';

// ==========================================
// CONSULTATIONS SERVICE
// ==========================================

export class ConsultationsService {
    /**
     * Get consultation history for the doctor
     */
    async getMyConsultations(
        limit: number = 20,
        offset: number = 0
    ): Promise<ConsultationHistoryResponse> {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return apiClient.get<ConsultationHistoryResponse>(
            `${API_ENDPOINTS.doctorConsultations.list}?${params}`
        );
    }

    /**
     * Get a single consultation by ID
     */
    async getConsultation(consultationId: string): Promise<Consultation> {
        return apiClient.get<Consultation>(
            API_ENDPOINTS.doctorConsultations.getById(consultationId)
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
            API_ENDPOINTS.doctorConsultations.updateNotes(consultationId),
            notes
        );
    }

    /**
     * End a consultation
     */
    async endConsultation(consultationId: string): Promise<Consultation> {
        return apiClient.post<Consultation>(
            API_ENDPOINTS.doctorConsultations.end(consultationId)
        );
    }
}

// Export singleton instance
export const consultationsService = new ConsultationsService();

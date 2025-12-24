import { apiClient } from '../lib/api-client';

// Types
export interface ReviewerApplication {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    registrationNumber: string;
    council: string;
    specialization: string;
    experience: string;
    status: 'PENDING';
    submittedAt: string;
    assignedAt: string;
    // Address fields
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        isVerified: boolean;
    };
    documents: ReviewerDocument[];
}

export interface ReviewerDocument {
    id: string;
    type: string;
    fileName: string;
    originalName: string;
    url?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    createdAt: string;
}

export interface ApproveApplicationData {
    // No additional data needed
}

export interface RejectApplicationData {
    rejectionReason: string;
}

export interface UpdateDocumentStatusData {
    status: 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
}

export class ReviewerService {
    private baseUrl = '/reviewer/applications';

    /**
     * Get applications assigned to current reviewer
     */
    async getAssignedApplications(): Promise<ReviewerApplication[]> {
        return apiClient.get<ReviewerApplication[]>(this.baseUrl);
    }

    /**
     * Get detailed application info
     */
    async getApplicationDetails(doctorId: string): Promise<ReviewerApplication> {
        return apiClient.get<ReviewerApplication>(`${this.baseUrl}/${doctorId}`);
    }

    /**
     * Approve application
     */
    async approveApplication(doctorId: string): Promise<any> {
        return apiClient.post<any>(`${this.baseUrl}/${doctorId}/approve`, {});
    }

    /**
     * Reject application with reason
     */
    async rejectApplication(
        doctorId: string,
        data: RejectApplicationData
    ): Promise<any> {
        return apiClient.post<any>(`${this.baseUrl}/${doctorId}/reject`, data);
    }

    /**
     * Update document verification status
     */
    async updateDocumentStatus(
        doctorId: string,
        documentId: string,
        data: UpdateDocumentStatusData
    ): Promise<ReviewerDocument> {
        return apiClient.patch<ReviewerDocument>(
            `${this.baseUrl}/${doctorId}/documents/${documentId}`,
            data
        );
    }
}

export const reviewerService = new ReviewerService();

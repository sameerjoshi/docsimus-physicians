import { apiClient } from '../lib/api-client';

// Types
export interface AdminDoctorApplication {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    registrationNumber: string;
    council: string;
    specialization: string;
    experience: string;
    status: 'DRAFT' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    submittedAt?: string;
    verifiedAt?: string;
    assignedAt?: string;
    reviewedAt?: string;
    reviewerId?: string;
    rejectionReason?: string;
    reviewer?: {
        id: string;
        name: string;
        email: string;
    };
    user?: {
        id: string;
        email: string;
        name: string;
    };
    documents?: any[];
}

export interface Reviewer {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
    _count?: {
        reviewingApplications: number;
    };
}

export interface AssignReviewerData {
    reviewerId: string;
}

export interface UpdateApplicationStatusData {
    status: 'VERIFIED' | 'REJECTED';
    rejectionReason?: string;
}

export class AdminService {
    private baseUrl = '/admin/doctors';

    /**
     * Get all pending doctor applications
     */
    async getPendingApplications(): Promise<AdminDoctorApplication[]> {
        return apiClient.get<AdminDoctorApplication[]>(`${this.baseUrl}/pending`);
    }

    /**
     * Get all doctor applications with optional filters
     */
    async getAllApplications(filters?: {
        status?: string;
        reviewerId?: string;
    }): Promise<AdminDoctorApplication[]> {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.reviewerId) params.append('reviewerId', filters.reviewerId);

        const query = params.toString();
        return apiClient.get<AdminDoctorApplication[]>(
            `${this.baseUrl}${query ? `?${query}` : ''}`
        );
    }

    /**
     * Get all reviewers
     */
    async getReviewers(): Promise<Reviewer[]> {
        return apiClient.get<Reviewer[]>(`${this.baseUrl}/reviewers`);
    }

    /**
     * Get detailed application info
     */
    async getApplicationDetails(doctorId: string): Promise<AdminDoctorApplication> {
        return apiClient.get<AdminDoctorApplication>(`${this.baseUrl}/${doctorId}`);
    }

    /**
     * Assign reviewer to application
     */
    async assignReviewer(
        doctorId: string,
        data: AssignReviewerData
    ): Promise<AdminDoctorApplication> {
        return apiClient.post<AdminDoctorApplication>(
            `${this.baseUrl}/${doctorId}/assign`,
            data
        );
    }

    /**
     * Update application status (admin override)
     */
    async updateApplicationStatus(
        doctorId: string,
        data: UpdateApplicationStatusData
    ): Promise<AdminDoctorApplication> {
        return apiClient.patch<AdminDoctorApplication>(
            `${this.baseUrl}/${doctorId}/status`,
            data
        );
    }
}

export const adminService = new AdminService();

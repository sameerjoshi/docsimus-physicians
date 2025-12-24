import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';
import { DoctorOnboardingState } from '../types/onboarding';

export interface DoctorProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    registrationNumber: string;
    council: string;
    specialization: string;
    experience: string;
    bio?: string;
    consultationFee?: number;
    languages?: string[];
    availableNow: boolean;
    weeklyAvailability?: Record<string, string>;
    status: string;
    rejectionReason?: string; // Added for rejected applications
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
    verifiedAt?: string;
    documents?: any[];
    user?: {
        email: string;
        name: string | null;
    };
}

export interface UpdateDoctorProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dob?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    registrationNumber?: string;
    council?: string;
    specialization?: string;
    experience?: string;
    bio?: string;
    consultationFee?: number;
    languages?: string[];
    availableNow?: boolean;
    weeklyAvailability?: Record<string, string>;
}

export interface ApplicationStatus {
    status: string;
    submittedAt?: string;
    verifiedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorDocument {
    id: string;
    type: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
    status: string;
    createdAt: string;
}

export class DoctorService {
    async getProfile(): Promise<DoctorProfile> {
        return apiClient.get<DoctorProfile>(API_ENDPOINTS.doctors.profile);
    }

    async updateProfile(data: UpdateDoctorProfileData): Promise<DoctorProfile> {
        return apiClient.patch<DoctorProfile>(API_ENDPOINTS.doctors.profile, data);
    }

    async submitApplication(): Promise<DoctorProfile> {
        return apiClient.post<DoctorProfile>(
            API_ENDPOINTS.doctors.submitApplication
        );
    }

    async getApplicationStatus(): Promise<ApplicationStatus> {
        return apiClient.get<ApplicationStatus>(
            API_ENDPOINTS.doctors.applicationStatus
        );
    }

    // Helper to convert frontend state to backend update format
    convertStateToUpdateData(
        state: Partial<DoctorOnboardingState>
    ): UpdateDoctorProfileData {
        const updateData: UpdateDoctorProfileData = {};

        // Personal info
        if (state.profile) {
            if (state.profile.firstName !== undefined) updateData.firstName = state.profile.firstName;
            if (state.profile.lastName !== undefined) updateData.lastName = state.profile.lastName;
            if (state.profile.phone !== undefined) updateData.phone = state.profile.phone;
            if (state.profile.dob !== undefined) updateData.dob = state.profile.dob;
            if (state.profile.addressLine1 !== undefined) updateData.addressLine1 = state.profile.addressLine1;
            if (state.profile.addressLine2 !== undefined) updateData.addressLine2 = state.profile.addressLine2;
            if (state.profile.city !== undefined) updateData.city = state.profile.city;
            if (state.profile.state !== undefined) updateData.state = state.profile.state;
            if (state.profile.postalCode !== undefined) updateData.postalCode = state.profile.postalCode;
        }

        // Professional info
        if (state.professional) {
            if (state.professional.registrationNumber)
                updateData.registrationNumber = state.professional.registrationNumber;
            if (state.professional.council) updateData.council = state.professional.council;
            if (state.professional.specialization)
                updateData.specialization = state.professional.specialization;
            if (state.professional.experience)
                updateData.experience = state.professional.experience;
        }

        // Availability
        if (state.availability) {
            if (typeof state.availability.availableNow !== 'undefined')
                updateData.availableNow = state.availability.availableNow;
            if (state.availability.weeklyAvailability)
                updateData.weeklyAvailability = state.availability.weeklyAvailability;
            if (state.availability.fee)
                updateData.consultationFee = parseInt(state.availability.fee) * 100; // Convert to paise
            if (state.availability.languages)
                updateData.languages = state.availability.languages;
            if (state.availability.bio) updateData.bio = state.availability.bio;
        }

        return updateData;
    }

    // Upload document
    async uploadDocument(file: File, type: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${API_ENDPOINTS.doctors.uploadDocument}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || 'Upload failed');
        }

        return await response.json();
    }

    // Get all documents
    async getDocuments(): Promise<DoctorDocument[]> {
        return apiClient.get<DoctorDocument[]>(API_ENDPOINTS.doctors.getDocuments);
    }

    // Delete document
    async deleteDocument(id: string) {
        return apiClient.delete(API_ENDPOINTS.doctors.deleteDocument(id));
    }
}

export const doctorService = new DoctorService();

'use client';

import { useCallback, useState } from 'react';
import { profileService } from '../services/profile.service';
import {
    ApplicationStatus,
    DoctorDocument,
    DoctorProfile,
    UpdateDoctorProfileData,
} from '../types/profile';
import { DoctorOnboardingState } from '../types/onboarding';
import { toast } from 'sonner';

// ==========================================
// PROFILE HOOK TYPES
// ==========================================

interface UseProfileState {
    profile: DoctorProfile | null;
    documents: DoctorDocument[];
    applicationStatus: ApplicationStatus | null;
    availability: boolean;
    isLoading: boolean;
    isUpdating: boolean;
    isUploading: boolean;
    error: string | null;
}

interface UseProfileActions {
    fetchProfile: () => Promise<DoctorProfile | null>;
    updateProfile: (data: UpdateDoctorProfileData) => Promise<boolean>;
    updateProfileFromState: (state: Partial<DoctorOnboardingState>) => Promise<boolean>;
    fetchAvailability: () => Promise<void>;
    toggleAvailability: (available: boolean) => Promise<boolean>;
    submitApplication: () => Promise<boolean>;
    fetchApplicationStatus: () => Promise<void>;
    uploadDocument: (file: File, type: string) => Promise<DoctorDocument | null>;
    fetchDocuments: () => Promise<void>;
    deleteDocument: (id: string) => Promise<boolean>;
    clearError: () => void;
    clearProfile: () => void;
}

// ==========================================
// PROFILE HOOK
// ==========================================

export function useProfile(): UseProfileState & UseProfileActions {
    const [state, setState] = useState<UseProfileState>({
        profile: null,
        documents: [],
        applicationStatus: null,
        availability: false,
        isLoading: false,
        isUpdating: false,
        isUploading: false,
        error: null,
    });

    // ==========================================
    // PROFILE ACTIONS
    // ==========================================

    const fetchProfile = useCallback(async (): Promise<DoctorProfile | null> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const profile = await profileService.getProfile();
            setState(prev => ({
                ...prev,
                profile,
                availability: profile.availableNow,
                isLoading: false,
            }));
            return profile;
        } catch (err: any) {
            const message = err.message || 'Failed to fetch profile';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
            return null;
        }
    }, []);

    const updateProfile = useCallback(async (data: UpdateDoctorProfileData): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isUpdating: true, error: null }));
            const updatedProfile = await profileService.updateProfile(data);
            setState(prev => ({
                ...prev,
                profile: updatedProfile,
                isUpdating: false,
            }));
            toast.success('Profile updated successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to update profile';
            setState(prev => ({ ...prev, error: message, isUpdating: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    const updateProfileFromState = useCallback(async (
        onboardingState: Partial<DoctorOnboardingState>
    ): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isUpdating: true, error: null }));
            const updateData = profileService.convertStateToUpdateData(onboardingState);
            const updatedProfile = await profileService.updateProfile(updateData);
            setState(prev => ({
                ...prev,
                profile: updatedProfile,
                isUpdating: false,
            }));
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to update profile';
            setState(prev => ({ ...prev, error: message, isUpdating: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    // ==========================================
    // AVAILABILITY ACTIONS
    // ==========================================

    const fetchAvailability = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const availability = await profileService.getAvailability();
            setState(prev => ({
                ...prev,
                availability,
                isLoading: false,
            }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch availability';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const toggleAvailability = useCallback(async (available: boolean): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isUpdating: true, error: null }));
            const result = await profileService.toggleAvailability(available);
            setState(prev => ({
                ...prev,
                availability: result.availableNow,
                profile: prev.profile ? { ...prev.profile, availableNow: result.availableNow } : null,
                isUpdating: false,
            }));
            toast.success(available ? 'You are now available' : 'You are now unavailable');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to toggle availability';
            setState(prev => ({ ...prev, error: message, isUpdating: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    // ==========================================
    // APPLICATION ACTIONS
    // ==========================================

    const submitApplication = useCallback(async (): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isUpdating: true, error: null }));
            const updatedProfile = await profileService.submitApplication();
            setState(prev => ({
                ...prev,
                profile: updatedProfile,
                isUpdating: false,
            }));
            toast.success('Application submitted successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to submit application';
            setState(prev => ({ ...prev, error: message, isUpdating: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    const fetchApplicationStatus = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const applicationStatus = await profileService.getApplicationStatus();
            setState(prev => ({
                ...prev,
                applicationStatus,
                isLoading: false,
            }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch application status';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    // ==========================================
    // DOCUMENT ACTIONS
    // ==========================================

    const uploadDocument = useCallback(async (
        file: File,
        type: string
    ): Promise<DoctorDocument | null> => {
        try {
            setState(prev => ({ ...prev, isUploading: true, error: null }));
            const document = await profileService.uploadDocument(file, type);
            setState(prev => ({
                ...prev,
                documents: [...prev.documents, document],
                isUploading: false,
            }));
            toast.success('Document uploaded successfully');
            return document;
        } catch (err: any) {
            const message = err.message || 'Failed to upload document';
            setState(prev => ({ ...prev, error: message, isUploading: false }));
            toast.error(message);
            return null;
        }
    }, [toast]);

    const fetchDocuments = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const documents = await profileService.getDocuments();
            setState(prev => ({
                ...prev,
                documents,
                isLoading: false,
            }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch documents';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isUpdating: true, error: null }));
            await profileService.deleteDocument(id);
            setState(prev => ({
                ...prev,
                documents: prev.documents.filter(doc => doc.id !== id),
                isUpdating: false,
            }));
            toast.success('Document deleted successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to delete document';
            setState(prev => ({ ...prev, error: message, isUpdating: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    // ==========================================
    // UTILITY ACTIONS
    // ==========================================

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const clearProfile = useCallback(() => {
        setState({
            profile: null,
            documents: [],
            applicationStatus: null,
            availability: false,
            isLoading: false,
            isUpdating: false,
            isUploading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        fetchProfile,
        updateProfile,
        updateProfileFromState,
        fetchAvailability,
        toggleAvailability,
        submitApplication,
        fetchApplicationStatus,
        uploadDocument,
        fetchDocuments,
        deleteDocument,
        clearError,
        clearProfile,
    };
}

'use client';

import { useCallback, useState } from 'react';
import { consultationsService } from '../services/consultations.service';
import {
    Consultation,
    InstantConsultationRequest,
    UpdateConsultationNotesDto,
} from '../types/consultations';
import { useToast } from './use-toast';

// ==========================================
// CONSULTATIONS HOOK TYPES
// ==========================================

interface UseConsultationsState {
    pendingRequests: InstantConsultationRequest[];
    consultation: Consultation | null;
    isLoading: boolean;
    error: string | null;
}

interface UseConsultationsActions {
    fetchPendingRequests: () => Promise<void>;
    createConsultation: (appointmentId: string) => Promise<boolean>;
    fetchConsultation: (consultationId: string) => Promise<void>;
    updateNotes: (consultationId: string, notes: UpdateConsultationNotesDto) => Promise<boolean>;
    clearConsultation: () => void;
    clearError: () => void;
}

// ==========================================
// CONSULTATIONS HOOK
// ==========================================

export function useConsultations(): UseConsultationsState & UseConsultationsActions {
    const toast = useToast();

    const [state, setState] = useState<UseConsultationsState>({
        pendingRequests: [],
        consultation: null,
        isLoading: false,
        error: null,
    });

    const fetchPendingRequests = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const request = await consultationsService.getPendingRequests();
            setState(prev => ({
                ...prev,
                pendingRequests: request,
                isLoading: false,
            }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch pending requests';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const createConsultation = useCallback(async (appointmentId: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const newConsultation = await consultationsService.createConsultation(appointmentId);
            setState(prev => ({
                ...prev,
                consultation: newConsultation,
                isLoading: false,
            }));
            toast.success('Consultation created successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to create consultation';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    const fetchConsultation = useCallback(async (consultationId: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const consultation = await consultationsService.getConsultation(consultationId);
            setState(prev => ({
                ...prev,
                consultation,
                isLoading: false,
            }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch consultation';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const updateNotes = useCallback(async (
        consultationId: string,
        notes: UpdateConsultationNotesDto
    ): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedConsultation = await consultationsService.updateNotes(consultationId, notes);
            setState(prev => ({
                ...prev,
                consultation: prev.consultation?.id === consultationId
                    ? updatedConsultation
                    : prev.consultation,
                isLoading: false,
            }));
            toast.success('Notes updated successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to update notes';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
            toast.error(message);
            return false;
        }
    }, [toast]);

    const clearConsultation = useCallback(() => {
        setState(prev => ({
            ...prev,
            consultation: null,
            pendingRequests: [],
        }));
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        // State
        ...state,

        // Actions
        fetchPendingRequests,
        createConsultation,
        fetchConsultation,
        updateNotes,
        clearConsultation,
        clearError,
    };
}

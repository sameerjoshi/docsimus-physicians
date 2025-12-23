'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationsService } from '../services/consultations.service';
import {
    Consultation,
    ConsultationHistoryResponse,
    UpdateConsultationNotesDto,
} from '../types/consultations';
import { toast } from 'sonner';

// Query keys
const CONSULTATION_KEYS = {
    all: ['consultations'] as const,
    history: (limit: number, offset: number) =>
        [...CONSULTATION_KEYS.all, 'history', { limit, offset }] as const,
    detail: (id: string) => [...CONSULTATION_KEYS.all, 'detail', id] as const,
};

// ==========================================
// CONSULTATIONS HOOK
// ==========================================

export function useConsultationHistory(limit: number = 20, offset: number = 0) {
    return useQuery({
        queryKey: CONSULTATION_KEYS.history(limit, offset),
        queryFn: () => consultationsService.getMyConsultations(limit, offset),
        staleTime: 30 * 1000, // 30 seconds
    });
}

export function useConsultationDetail(consultationId: string | null) {
    return useQuery({
        queryKey: CONSULTATION_KEYS.detail(consultationId || ''),
        queryFn: () => consultationsService.getConsultation(consultationId!),
        enabled: !!consultationId,
        staleTime: 10 * 1000, // 10 seconds
    });
}

export function useUpdateConsultationNotes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            consultationId,
            notes,
        }: {
            consultationId: string;
            notes: UpdateConsultationNotesDto;
        }) => consultationsService.updateNotes(consultationId, notes),
        onSuccess: (data, variables) => {
            // Update the cache
            queryClient.setQueryData(
                CONSULTATION_KEYS.detail(variables.consultationId),
                data
            );
            // Invalidate history to refresh
            queryClient.invalidateQueries({ queryKey: CONSULTATION_KEYS.all });
            toast.success('Notes updated successfully');
        },
        onError: (error: any) => {
            toast.error('Failed to update notes', {
                description: error.message || 'Please try again',
            });
        },
    });
}

export function useEndConsultation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (consultationId: string) =>
            consultationsService.endConsultation(consultationId),
        onSuccess: (data, consultationId) => {
            // Update the cache
            queryClient.setQueryData(
                CONSULTATION_KEYS.detail(consultationId),
                data
            );
            // Invalidate history to refresh
            queryClient.invalidateQueries({ queryKey: CONSULTATION_KEYS.all });
            toast.success('Consultation ended');
        },
        onError: (error: any) => {
            toast.error('Failed to end consultation', {
                description: error.message || 'Please try again',
            });
        },
    });
}

// ==========================================
// COMBINED HOOK WITH PAGINATION
// ==========================================

export function useConsultations() {
    const [pagination, setPagination] = useState({ limit: 20, offset: 0 });

    const {
        data,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useConsultationHistory(pagination.limit, pagination.offset);

    const updateNotesMutation = useUpdateConsultationNotes();
    const endConsultationMutation = useEndConsultation();

    const loadMore = useCallback(() => {
        if (data?.hasMore) {
            setPagination((prev) => ({
                ...prev,
                offset: prev.offset + prev.limit,
            }));
        }
    }, [data?.hasMore]);

    const resetPagination = useCallback(() => {
        setPagination({ limit: 20, offset: 0 });
    }, []);

    return {
        consultations: data?.consultations || [],
        total: data?.total || 0,
        hasMore: data?.hasMore || false,
        isLoading,
        isFetching,
        error,
        refetch,
        loadMore,
        resetPagination,
        updateNotes: updateNotesMutation.mutateAsync,
        endConsultation: endConsultationMutation.mutateAsync,
        isUpdatingNotes: updateNotesMutation.isPending,
        isEndingConsultation: endConsultationMutation.isPending,
    };
}

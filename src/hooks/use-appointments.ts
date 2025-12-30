import { useState, useCallback } from 'react';
import { appointmentsService } from '../services/appointments.service';
import { Appointment, QueryAppointmentsParams } from '../types/appointments';
import { toast } from 'sonner';

interface UseAppointmentsState {
    appointments: Appointment[];
    todayAppointments: Appointment[];
    upcomingAppointmentsCount: number,
    isLoading: boolean;
    error: string | null;
}

interface UseAppointmentsActions {
    // Appointments
    fetchUpcomingAppointmentsCount: () => Promise<void>;
    fetchAppointments: (params?: QueryAppointmentsParams) => Promise<void>;
    fetchTodayAppointments: () => Promise<void>;
}

export function useAppointments(): UseAppointmentsState & UseAppointmentsActions {
    const [state, setState] = useState<UseAppointmentsState>({
        appointments: [],
        todayAppointments: [],
        upcomingAppointmentsCount: 0,
        isLoading: false,
        error: null,
    });

    // ==========================================
    // APPOINTMENT ACTIONS
    // ==========================================

    const fetchUpcomingAppointmentsCount = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const count = await appointmentsService.getUpcomingAppointmentsCount();
            setState(prev => ({ ...prev, upcomingAppointmentsCount: count, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch today\'s appointments';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const fetchAppointments = useCallback(async (params?: QueryAppointmentsParams) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await appointmentsService.getAppointments(params);
            setState(prev => ({ ...prev, appointments: response.appointments, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch appointments';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
            toast.error(message);
        }
    }, [toast]);

    const fetchTodayAppointments = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const appointments = await appointmentsService.getTodayAppointments();
            setState(prev => ({ ...prev, todayAppointments: appointments, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch today\'s appointments';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    return {
        // State
        ...state,

        // Appointment actions
        fetchUpcomingAppointmentsCount,
        fetchAppointments,
        fetchTodayAppointments,
    };
}

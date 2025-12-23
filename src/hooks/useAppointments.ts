import { useState, useCallback } from 'react';
import {
    appointmentsService,
    Appointment,
    TimeSlot,
    WeeklySchedule,
    InstantConsultationRequest,
    QueryAppointmentsParams,
    CreateTimeSlotPayload,
    CreateBulkTimeSlotsPayload,
    UpdateTimeSlotPayload,
    AppointmentStatus,
} from '../services/appointments.service';
import { useToast } from './use-toast';

interface UseAppointmentsState {
    appointments: Appointment[];
    todayAppointments: Appointment[];
    weeklySchedule: WeeklySchedule | null;
    timeSlots: TimeSlot[];
    pendingRequests: InstantConsultationRequest[];
    isAvailableNow: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UseAppointmentsActions {
    // Appointments
    fetchAppointments: (params?: QueryAppointmentsParams) => Promise<void>;
    fetchTodayAppointments: () => Promise<void>;
    fetchWeekAppointments: (weekStartDate: Date) => Promise<void>;
    confirmAppointment: (id: string) => Promise<boolean>;
    completeAppointment: (id: string) => Promise<boolean>;

    // Time Slots
    fetchWeeklySchedule: () => Promise<void>;
    fetchTimeSlots: (dayOfWeek?: number) => Promise<void>;
    createTimeSlot: (payload: CreateTimeSlotPayload) => Promise<boolean>;
    createBulkTimeSlots: (payload: CreateBulkTimeSlotsPayload) => Promise<boolean>;
    updateTimeSlot: (slotId: string, payload: UpdateTimeSlotPayload) => Promise<boolean>;
    deleteTimeSlot: (slotId: string) => Promise<boolean>;

    // Availability
    fetchAvailability: () => Promise<void>;
    toggleAvailability: (available: boolean) => Promise<boolean>;

    // Instant Consultations
    fetchPendingRequests: () => Promise<void>;
    acceptRequest: (requestId: string) => Promise<boolean>;
    rejectRequest: (requestId: string, reason?: string) => Promise<boolean>;

    // Utility
    refreshAll: () => Promise<void>;
}

export function useAppointments(): UseAppointmentsState & UseAppointmentsActions {
    const toast = useToast();

    const [state, setState] = useState<UseAppointmentsState>({
        appointments: [],
        todayAppointments: [],
        weeklySchedule: null,
        timeSlots: [],
        pendingRequests: [],
        isAvailableNow: false,
        isLoading: false,
        error: null,
    });

    // ==========================================
    // APPOINTMENT ACTIONS
    // ==========================================

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

    const fetchWeekAppointments = useCallback(async (weekStartDate: Date) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const appointments = await appointmentsService.getWeekAppointments(weekStartDate);
            setState(prev => ({ ...prev, appointments: appointments, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch week appointments';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const confirmAppointment = useCallback(async (id: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            await appointmentsService.confirmAppointment(id);

            // Update local state
            setState(prev => ({
                ...prev,
                isLoading: false,
                appointments: prev.appointments.map(apt =>
                    apt.id === id ? { ...apt, status: 'CONFIRMED' as AppointmentStatus } : apt
                ),
                todayAppointments: prev.todayAppointments.map(apt =>
                    apt.id === id ? { ...apt, status: 'CONFIRMED' as AppointmentStatus } : apt
                ),
            }));

            toast.success('Appointment confirmed successfully');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to confirm appointment');
            return false;
        }
    }, [toast]);

    const completeAppointment = useCallback(async (id: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            await appointmentsService.completeAppointment(id);

            // Update local state
            setState(prev => ({
                ...prev,
                isLoading: false,
                appointments: prev.appointments.map(apt =>
                    apt.id === id ? { ...apt, status: 'COMPLETED' as AppointmentStatus } : apt
                ),
                todayAppointments: prev.todayAppointments.map(apt =>
                    apt.id === id ? { ...apt, status: 'COMPLETED' as AppointmentStatus } : apt
                ),
            }));

            toast.success('Appointment marked as complete');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to complete appointment');
            return false;
        }
    }, [toast]);

    // ==========================================
    // TIME SLOT ACTIONS
    // ==========================================

    const fetchAvailability = useCallback(async () => {
        try {
            const availability = await appointmentsService.getAvailability();
            setState(prev => ({ ...prev, isAvailableNow: availability }));
        } catch (err: any) {
            // Silently fail - availability is not critical
            console.error('Failed to fetch availability:', err.message);
        }
    }, []);

    const fetchWeeklySchedule = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const schedule = await appointmentsService.getWeeklySchedule();
            setState(prev => ({
                ...prev,
                weeklySchedule: schedule,
                isLoading: false,
            }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch weekly schedule';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const fetchTimeSlots = useCallback(async (dayOfWeek?: number) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const slots = await appointmentsService.getTimeSlots(
                dayOfWeek !== undefined ? { dayOfWeek } : undefined
            );
            setState(prev => ({ ...prev, timeSlots: slots, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch time slots';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const createTimeSlot = useCallback(async (payload: CreateTimeSlotPayload): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const newSlot = await appointmentsService.createTimeSlot(payload);

            setState(prev => ({
                ...prev,
                isLoading: false,
                timeSlots: [...prev.timeSlots, newSlot],
            }));

            toast.success('Time slot created successfully');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to create time slot');
            return false;
        }
    }, [toast]);

    const createBulkTimeSlots = useCallback(async (payload: CreateBulkTimeSlotsPayload): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const newSlots = await appointmentsService.createBulkTimeSlots(payload);

            setState(prev => ({
                ...prev,
                isLoading: false,
                timeSlots: [...prev.timeSlots, ...newSlots],
            }));

            toast.success(`${newSlots.length} time slots created`);
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to create time slots');
            return false;
        }
    }, [toast]);

    const updateTimeSlot = useCallback(async (slotId: string, payload: UpdateTimeSlotPayload): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const updatedSlot = await appointmentsService.updateTimeSlot(slotId, payload);

            setState(prev => ({
                ...prev,
                isLoading: false,
                timeSlots: prev.timeSlots.map(slot =>
                    slot.id === slotId ? updatedSlot : slot
                ),
            }));

            toast.success('Time slot updated');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to update time slot');
            return false;
        }
    }, [toast]);

    const deleteTimeSlot = useCallback(async (slotId: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            await appointmentsService.deleteTimeSlot(slotId);

            setState(prev => ({
                ...prev,
                isLoading: false,
                timeSlots: prev.timeSlots.filter(slot => slot.id !== slotId),
            }));

            toast.success('Time slot deleted');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to delete time slot');
            return false;
        }
    }, [toast]);

    const toggleAvailability = useCallback(async (available: boolean): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const result = await appointmentsService.toggleAvailability(available);
            setState(prev => ({ ...prev, isAvailableNow: result.availableNow, isLoading: false }));

            toast.success(available ? 'You are now available for instant consultations' : 'You are now offline');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to update availability');
            return false;
        }
    }, [toast]);

    // ==========================================
    // INSTANT CONSULTATION ACTIONS
    // ==========================================

    const fetchPendingRequests = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const requests = await appointmentsService.getPendingInstantRequests();
            setState(prev => ({ ...prev, pendingRequests: requests, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch pending requests';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const acceptRequest = useCallback(async (requestId: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const appointment = await appointmentsService.acceptInstantRequest(requestId);

            // Remove from pending and add to appointments
            setState(prev => ({
                ...prev,
                isLoading: false,
                pendingRequests: prev.pendingRequests.filter(req => req.id !== requestId),
                todayAppointments: [...prev.todayAppointments, appointment],
            }));

            toast.success('Consultation request accepted');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to accept request');
            return false;
        }
    }, [toast]);

    const rejectRequest = useCallback(async (requestId: string, reason?: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            await appointmentsService.rejectInstantRequest(requestId,
                reason ? { rejectionReason: reason } : undefined
            );

            setState(prev => ({
                ...prev,
                isLoading: false,
                pendingRequests: prev.pendingRequests.filter(req => req.id !== requestId),
            }));

            toast.success('Consultation request declined');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to reject request');
            return false;
        }
    }, [toast]);

    // ==========================================
    // UTILITY ACTIONS
    // ==========================================

    const refreshAll = useCallback(async () => {
        await Promise.all([
            fetchTodayAppointments(),
            fetchWeeklySchedule(),
            fetchPendingRequests(),
        ]);
    }, [fetchTodayAppointments, fetchWeeklySchedule, fetchPendingRequests]);

    return {
        // State
        ...state,

        // Appointment actions
        fetchAppointments,
        fetchTodayAppointments,
        fetchWeekAppointments,
        confirmAppointment,
        completeAppointment,

        // Time slot actions
        fetchWeeklySchedule,
        fetchTimeSlots,
        createTimeSlot,
        createBulkTimeSlots,
        updateTimeSlot,
        deleteTimeSlot,

        // Availability
        fetchAvailability,
        toggleAvailability,

        // Instant consultation actions
        fetchPendingRequests,
        acceptRequest,
        rejectRequest,

        // Utility
        refreshAll,
    };
}

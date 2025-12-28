import { useCallback, useState } from "react";
import {
    WeeklySchedule,
    TimeSlot,
    CreateBulkTimeSlotsPayload,
    CreateTimeSlotPayload,
    UpdateTimeSlotPayload
} from "../types/time-slots";
import { timeSlotsService } from "../services/time-slots.service";
import { toast } from "sonner";

interface UseTimeSlotsState {
    weeklySchedule: WeeklySchedule | null;
    timeSlots: TimeSlot[];
}

interface UseTimeSlotsAction {
    fetchWeeklySchedule: () => Promise<void>;
    fetchTimeSlots: (dayOfWeek?: number) => Promise<void>;
    createTimeSlot: (payload: CreateTimeSlotPayload) => Promise<boolean>;
    createBulkTimeSlots: (payload: CreateBulkTimeSlotsPayload) => Promise<boolean>;
    updateTimeSlot: (slotId: string, payload: UpdateTimeSlotPayload) => Promise<boolean>;
    deleteTimeSlot: (slotId: string) => Promise<boolean>;
}

export function useTimeSlots(): UseTimeSlotsState & UseTimeSlotsAction {
    const [state, setState] = useState<UseTimeSlotsState>({
        weeklySchedule: [],
        timeSlots: [],
    });

    const fetchWeeklySchedule = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const schedule = await timeSlotsService.getWeeklySchedule();
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
            const slots = await timeSlotsService.getTimeSlots(
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
            const newSlot = await timeSlotsService.createTimeSlot(payload);

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
            const newSlots = await timeSlotsService.createBulkTimeSlots(payload);

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
            const updatedSlot = await timeSlotsService.updateTimeSlot(slotId, payload);

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
            await timeSlotsService.deleteTimeSlot(slotId);

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

    return {
        // State
        ...state,

        // Time slot actions
        fetchWeeklySchedule,
        fetchTimeSlots,
        createTimeSlot,
        createBulkTimeSlots,
        updateTimeSlot,
        deleteTimeSlot,
    };
}

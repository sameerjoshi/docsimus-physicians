import { useCallback, useState } from "react";
import {
    Availability,
    CreateBulkAvailabilitiesPayload,
    CreateAvailabilityPayload,
    UpdateAvailabilityPayload
} from "../types/availabilities";
import { availabilitiesService } from "../services/availabilities.service";
import { toast } from "sonner";

interface UseAvailabilitiesState {
    availabilities: Availability[];
    isLoading: boolean;
    error: string | null;
}

interface UseAvailabilitiesAction {
    fetchAvailabilities: (dayOfWeek?: number) => Promise<void>;
    createAvailability: (payload: CreateAvailabilityPayload) => Promise<boolean>;
    createBulkAvailabilities: (payload: CreateBulkAvailabilitiesPayload) => Promise<boolean>;
    updateAvailability: (availabilityId: string, payload: UpdateAvailabilityPayload) => Promise<boolean>;
    deleteAvailability: (availabilityId: string) => Promise<boolean>;
}

export function useAvailabilities(): UseAvailabilitiesState & UseAvailabilitiesAction {
    const [state, setState] = useState<UseAvailabilitiesState>({ availabilities: [], isLoading: false, error: null });

    const fetchAvailabilities = useCallback(async (dayOfWeek?: number) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const availabilities = await availabilitiesService.getAvailabilities(
                dayOfWeek !== undefined ? { dayOfWeek } : undefined
            );
            setState(prev => ({ ...prev, availabilities, isLoading: false }));
        } catch (err: any) {
            const message = err.message || 'Failed to fetch availabilities';
            setState(prev => ({ ...prev, error: message, isLoading: false }));
        }
    }, []);

    const createAvailability = useCallback(async (payload: CreateAvailabilityPayload): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const newAvailability = await availabilitiesService.createAvailability(payload);

            setState(prev => ({
                ...prev,
                isLoading: false,
                availabilities: [...prev.availabilities, newAvailability],
            }));

            toast.success('Availability created successfully');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to create availability');
            return false;
        }
    }, []);

    const createBulkAvailabilities = useCallback(async (payload: CreateBulkAvailabilitiesPayload): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const result = await availabilitiesService.createBulkAvailabilities(payload);

            // Refresh availabilities after bulk create
            await fetchAvailabilities();

            toast.success(`Availabilities created successfully`);
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to create availabilities');
            return false;
        }
    }, [fetchAvailabilities]);

    const updateAvailability = useCallback(async (availabilityId: string, payload: UpdateAvailabilityPayload): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const updatedAvailability = await availabilitiesService.updateAvailability(availabilityId, payload);

            setState(prev => ({
                ...prev,
                isLoading: false,
                availabilities: prev.availabilities.map(availability =>
                    availability.id === availabilityId ? updatedAvailability : availability
                ),
            }));

            toast.success('Availability updated');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to update availability');
            return false;
        }
    }, []);

    const deleteAvailability = useCallback(async (availabilityId: string): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            await availabilitiesService.deleteAvailability(availabilityId);

            setState(prev => ({
                ...prev,
                isLoading: false,
                availabilities: prev.availabilities.filter(availability => availability.id !== availabilityId),
            }));

            toast.success('Availability deleted');
            return true;
        } catch (err: any) {
            setState(prev => ({ ...prev, isLoading: false }));
            toast.error(err.message || 'Failed to delete availability');
            return false;
        }
    }, []);

    return {
        // State
        ...state,

        // Availability actions
        fetchAvailabilities,
        createAvailability,
        createBulkAvailabilities,
        updateAvailability,
        deleteAvailability,
    };
}

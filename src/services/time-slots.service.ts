import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import {
    WeeklySchedule,
    QueryTimeSlotsParams,
    TimeSlot,
    CreateTimeSlotPayload,
    CreateBulkTimeSlotsPayload,
    UpdateTimeSlotPayload
} from "../types/time-slots";

export class TimeSlotsService {
    /**
     * Get weekly schedule with all time slots
     */
    async getWeeklySchedule(): Promise<WeeklySchedule> {
        return apiClient.get<WeeklySchedule>(API_ENDPOINTS.timeSlots.weeklySchedule);
    }

    /**
     * Get time slots with optional filters
     */
    async getTimeSlots(params?: QueryTimeSlotsParams): Promise<TimeSlot[]> {
        const queryString = params ? this.buildQueryString(params) : '';
        const endpoint = queryString
            ? `${API_ENDPOINTS.timeSlots.slots}?${queryString}`
            : API_ENDPOINTS.timeSlots.slots;
        return apiClient.get<TimeSlot[]>(endpoint);
    }

    /**
     * Create a single time slot
     */
    async createTimeSlot(payload: CreateTimeSlotPayload): Promise<TimeSlot> {
        return apiClient.post<TimeSlot>(API_ENDPOINTS.timeSlots.slots, payload);
    }

    /**
     * Create multiple time slots at once
     */
    async createBulkTimeSlots(payload: CreateBulkTimeSlotsPayload): Promise<TimeSlot[]> {
        return apiClient.post<TimeSlot[]>(API_ENDPOINTS.timeSlots.slotsBulk, payload);
    }

    /**
     * Update an existing time slot
     */
    async updateTimeSlot(slotId: string, payload: UpdateTimeSlotPayload): Promise<TimeSlot> {
        return apiClient.patch<TimeSlot>(API_ENDPOINTS.timeSlots.slotById(slotId), payload);
    }

    /**
     * Delete a time slot
     */
    async deleteTimeSlot(slotId: string): Promise<void> {
        return apiClient.delete(API_ENDPOINTS.timeSlots.slotById(slotId));
    }

    /**
     * Build query string from params object
     */
    private buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });

        return searchParams.toString();
    }
}

export const timeSlotsService: TimeSlotsService = new TimeSlotsService();

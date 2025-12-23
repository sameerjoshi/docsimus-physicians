import { apiClient } from '../lib/api-client';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW';

export type AppointmentType = 'SCHEDULED' | 'INSTANT';

export interface Patient {
    id: string;
    name: string | null;
    email: string;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    endTime?: string;
    duration: number;
    type: AppointmentType;
    status: AppointmentStatus;
    reason?: string;
    symptoms?: string;
    notes?: string;
    meetingLink?: string;
    createdAt: string;
    updatedAt: string;
    patient?: Patient;
}

export interface TimeSlot {
    id: string;
    doctorId: string;
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    isRecurring: boolean;
    specificDate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface WeeklySchedule {
    [key: number]: TimeSlot[]; // dayOfWeek -> slots
}

export interface InstantConsultationRequest {
    id: string;
    patientId: string;
    doctorId: string;
    reason?: string;
    symptoms?: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    createdAt: string;
    expiresAt: string;
    patient?: Patient;
}

// ==========================================
// QUERY PARAMETERS
// ==========================================

export interface QueryAppointmentsParams {
    status?: AppointmentStatus;
    type?: AppointmentType;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
}

export interface QueryTimeSlotsParams {
    dayOfWeek?: number;
    date?: string;
    availableOnly?: boolean;
}

// ==========================================
// REQUEST PAYLOADS
// ==========================================

export interface CreateTimeSlotPayload {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isRecurring?: boolean;
    specificDate?: string;
}

export interface CreateBulkTimeSlotsPayload {
    slots: CreateTimeSlotPayload[];
}

export interface UpdateTimeSlotPayload {
    startTime?: string;
    endTime?: string;
    isActive?: boolean;
}

export interface RejectInstantRequestPayload {
    rejectionReason?: string;
}

// ==========================================
// RESPONSE TYPES
// ==========================================

export interface PaginatedAppointmentsResponse {
    appointments: Appointment[];
    total: number;
    limit: number;
    offset: number;
}

export interface WeeklyStats {
    totalAppointments: number;
    completed: number;
    cancelled: number;
    pending: number;
}

// ==========================================
// APPOINTMENTS ENDPOINTS
// ==========================================

const APPOINTMENTS_BASE = '/doctor/appointments';

export const APPOINTMENTS_ENDPOINTS = {
    // Appointments
    list: APPOINTMENTS_BASE,
    getById: (id: string) => `${APPOINTMENTS_BASE}/${id}`,
    confirm: (id: string) => `${APPOINTMENTS_BASE}/${id}/confirm`,
    complete: (id: string) => `${APPOINTMENTS_BASE}/${id}/complete`,

    // Schedule
    weeklySchedule: `${APPOINTMENTS_BASE}/schedule/weekly`,

    // Availability
    availability: `${APPOINTMENTS_BASE}/availability`,
    toggleAvailability: `${APPOINTMENTS_BASE}/availability/toggle`,
    // Time Slots
    slots: `${APPOINTMENTS_BASE}/slots`,
    slotsBulk: `${APPOINTMENTS_BASE}/slots/bulk`,
    slotById: (slotId: string) => `${APPOINTMENTS_BASE}/slots/${slotId}`,

    // Instant Consultations
    pendingRequests: `${APPOINTMENTS_BASE}/instant-requests/pending`,
    acceptRequest: (id: string) => `${APPOINTMENTS_BASE}/instant-requests/${id}/accept`,
    rejectRequest: (id: string) => `${APPOINTMENTS_BASE}/instant-requests/${id}/reject`,
};

// ==========================================
// APPOINTMENTS SERVICE
// ==========================================

export class AppointmentsService {
    // ==========================================
    // APPOINTMENT MANAGEMENT
    // ==========================================

    /**
     * Get doctor's appointments with optional filters
     */
    async getAppointments(params?: QueryAppointmentsParams): Promise<PaginatedAppointmentsResponse> {
        const queryString = params ? this.buildQueryString(params) : '';
        const endpoint = queryString
            ? `${APPOINTMENTS_ENDPOINTS.list}?${queryString}`
            : APPOINTMENTS_ENDPOINTS.list;
        return apiClient.get<PaginatedAppointmentsResponse>(endpoint);
    }

    /**
     * Get single appointment by ID
     */
    async getAppointmentById(id: string): Promise<Appointment> {
        return apiClient.get<Appointment>(APPOINTMENTS_ENDPOINTS.getById(id));
    }

    /**
     * Confirm a pending appointment
     */
    async confirmAppointment(id: string): Promise<Appointment> {
        return apiClient.post<Appointment>(APPOINTMENTS_ENDPOINTS.confirm(id));
    }

    /**
     * Mark an appointment as complete
     */
    async completeAppointment(id: string): Promise<Appointment> {
        return apiClient.post<Appointment>(APPOINTMENTS_ENDPOINTS.complete(id));
    }

    // ==========================================
    // TIME SLOT MANAGEMENT
    // ==========================================

    /**
     * Get current availability status
     */
    async getAvailability(): Promise<boolean> {
        return apiClient.get<boolean>(APPOINTMENTS_ENDPOINTS.availability);
    }

    /**
     * Get weekly schedule with all time slots
     */
    async getWeeklySchedule(): Promise<WeeklySchedule> {
        return apiClient.get<WeeklySchedule>(APPOINTMENTS_ENDPOINTS.weeklySchedule);
    }

    /**
     * Get time slots with optional filters
     */
    async getTimeSlots(params?: QueryTimeSlotsParams): Promise<TimeSlot[]> {
        const queryString = params ? this.buildQueryString(params) : '';
        const endpoint = queryString
            ? `${APPOINTMENTS_ENDPOINTS.slots}?${queryString}`
            : APPOINTMENTS_ENDPOINTS.slots;
        return apiClient.get<TimeSlot[]>(endpoint);
    }

    /**
     * Create a single time slot
     */
    async createTimeSlot(payload: CreateTimeSlotPayload): Promise<TimeSlot> {
        return apiClient.post<TimeSlot>(APPOINTMENTS_ENDPOINTS.slots, payload);
    }

    /**
     * Create multiple time slots at once
     */
    async createBulkTimeSlots(payload: CreateBulkTimeSlotsPayload): Promise<TimeSlot[]> {
        return apiClient.post<TimeSlot[]>(APPOINTMENTS_ENDPOINTS.slotsBulk, payload);
    }

    /**
     * Update an existing time slot
     */
    async updateTimeSlot(slotId: string, payload: UpdateTimeSlotPayload): Promise<TimeSlot> {
        return apiClient.patch<TimeSlot>(APPOINTMENTS_ENDPOINTS.slotById(slotId), payload);
    }

    /**
     * Delete a time slot
     */
    async deleteTimeSlot(slotId: string): Promise<void> {
        return apiClient.delete(APPOINTMENTS_ENDPOINTS.slotById(slotId));
    }

    /**
     * Toggle "available now" status for instant consultations
     */
    async toggleAvailability(available: boolean): Promise<{ id: string; availableNow: boolean }> {
        return apiClient.post<{ id: string; availableNow: boolean }>(APPOINTMENTS_ENDPOINTS.toggleAvailability, { available });
    }

    // ==========================================
    // INSTANT CONSULTATION REQUESTS
    // ==========================================

    /**
     * Get pending instant consultation requests
     */
    async getPendingInstantRequests(): Promise<InstantConsultationRequest[]> {
        return apiClient.get<InstantConsultationRequest[]>(APPOINTMENTS_ENDPOINTS.pendingRequests);
    }

    /**
     * Accept an instant consultation request
     */
    async acceptInstantRequest(requestId: string): Promise<Appointment> {
        return apiClient.post<Appointment>(APPOINTMENTS_ENDPOINTS.acceptRequest(requestId));
    }

    /**
     * Reject an instant consultation request
     */
    async rejectInstantRequest(requestId: string, payload?: RejectInstantRequestPayload): Promise<void> {
        return apiClient.post(APPOINTMENTS_ENDPOINTS.rejectRequest(requestId), payload);
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    /**
     * Get today's appointments
     */
    async getTodayAppointments(): Promise<Appointment[]> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const response = await this.getAppointments({
            fromDate: startOfDay,
            toDate: endOfDay,
            limit: 50,
        });

        return response.appointments;
    }

    /**
     * Get upcoming appointments for the next N days
     */
    async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);

        const response = await this.getAppointments({
            fromDate: today.toISOString(),
            toDate: futureDate.toISOString(),
            status: 'CONFIRMED',
            limit: 100,
        });

        return response.appointments;
    }

    /**
     * Get appointments for a specific week
     */
    async getWeekAppointments(weekStartDate: Date): Promise<Appointment[]> {
        const weekStart = new Date(weekStartDate);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        weekEnd.setHours(23, 59, 59, 999);

        const response = await this.getAppointments({
            fromDate: weekStart.toISOString(),
            toDate: weekEnd.toISOString(),
            limit: 100,
        });

        return response.appointments;
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

// Export singleton instance
export const appointmentsService = new AppointmentsService();

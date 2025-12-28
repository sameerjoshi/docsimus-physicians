import { apiClient } from '../lib/api-client';
import { API_ENDPOINTS } from '../lib/api-config';
import {
    Appointment,
    PaginatedAppointmentsResponse,
    QueryAppointmentsParams,
} from '../types/appointments';

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
            ? `${API_ENDPOINTS.appointments.list}?${queryString}`
            : API_ENDPOINTS.appointments.list;
        return apiClient.get<PaginatedAppointmentsResponse>(endpoint);
    }

    /**
     * Get single appointment by ID
     */
    async getAppointmentById(id: string): Promise<Appointment> {
        return apiClient.get<Appointment>(API_ENDPOINTS.appointments.getById(id));
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

    async getUpcomingAppointmentsCount(): Promise<number> {
        return await apiClient.get(API_ENDPOINTS.appointments.upcomingCount);
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

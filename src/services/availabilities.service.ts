import { apiClient } from "../lib/api-client";
import { API_ENDPOINTS } from "../lib/api-config";
import {
    QueryAvailabilitiesParams,
    Availability,
    CreateAvailabilityPayload,
    CreateBulkAvailabilitiesPayload,
    UpdateAvailabilityPayload
} from "../types/availabilities";

export class AvailabilitiesService {
    /**
     * Get availabilities with optional filters
     */
    async getAvailabilities(params?: QueryAvailabilitiesParams): Promise<Availability[]> {
        const queryString = params ? this.buildQueryString(params) : '';
        const endpoint = queryString
            ? `${API_ENDPOINTS.availabilities.list}?${queryString}`
            : API_ENDPOINTS.availabilities.list;
        return apiClient.get<Availability[]>(endpoint);
    }

    /**
     * Create a single availability
     */
    async createAvailability(payload: CreateAvailabilityPayload): Promise<Availability> {
        return apiClient.post<Availability>(API_ENDPOINTS.availabilities.list, payload);
    }

    /**
     * Create multiple availabilities at once
     */
    async createBulkAvailabilities(payload: CreateBulkAvailabilitiesPayload): Promise<Availability[]> {
        return apiClient.post<Availability[]>(API_ENDPOINTS.availabilities.bulk, payload);
    }

    /**
     * Update an existing availability
     */
    async updateAvailability(availabilityId: string, payload: UpdateAvailabilityPayload): Promise<Availability> {
        return apiClient.patch<Availability>(API_ENDPOINTS.availabilities.byId(availabilityId), payload);
    }

    /**
     * Delete an availability
     */
    async deleteAvailability(availabilityId: string): Promise<void> {
        return apiClient.delete(API_ENDPOINTS.availabilities.byId(availabilityId));
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

export const availabilitiesService = new AvailabilitiesService();

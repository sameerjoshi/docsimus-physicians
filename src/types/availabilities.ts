// ==========================================
// AVAILABILITY TYPE DEFINITIONS
// ==========================================

// Doctor availability window (defines when doctor is available)
export interface Availability {
    id: string;
    doctorId: string;
    slot_duration: number; // Duration of each slot in minutes
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    startTime: string; // HH:mm format (24-hour)
    endTime: string; // HH:mm format (24-hour)
    isRecurring: boolean;
    specificDate?: string;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// QUERY PARAMETERS
// ==========================================

export interface QueryAvailabilitiesParams {
    dayOfWeek?: number;
    date?: string;
}

// ==========================================
// REQUEST PAYLOADS
// ==========================================

export interface CreateAvailabilityPayload {
    slot_duration?: number; // Duration in minutes, defaults to 15
    dayOfWeek: number;
    startTime: string; // HH:mm format (24-hour)
    endTime: string; // HH:mm format (24-hour)
    isRecurring?: boolean;
    specificDate?: string; // For non-recurring availability
}

export interface CreateBulkAvailabilitiesPayload {
    availabilities: CreateAvailabilityPayload[];
}

export interface UpdateAvailabilityPayload {
    startTime?: string;
    endTime?: string;
}

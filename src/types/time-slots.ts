// ==========================================
// TIME SLOTS TYPE DEFINITIONS
// ==========================================

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

// ==========================================
// QUERY PARAMETERS
// ==========================================

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

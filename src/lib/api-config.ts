// API Configuration
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    appURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    wsURL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
    timeout: 30000,
};

export const API_ENDPOINTS = {
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        verifyEmail: '/auth/verify-email',
        resendVerification: '/auth/resend-verification',
    },
    doctors: {
        profile: '/doctors/profile',
        availability: '/doctors/availability',
        toggleAvailability: '/doctors/availability/toggle',
        submitApplication: '/doctors/submit-application',
        applicationStatus: '/doctors/application-status',
        uploadDocument: '/doctors/documents/upload',
        getDocuments: '/doctors/documents',
        deleteDocument: (id: string) => `/doctors/documents/${id}`,
    },
    appointments: {
        // Appointments
        list: '/appointments',
        getById: (id: string) => `/appointments/${id}`,
        cancel: (id: string) => `/appointments/${id}`,
        upcomingCount: '/appointments/upcoming-count',
    },
    timeSlots: {
        // Schedule
        weeklySchedule: '/doctor/slots/schedule/weekly',

        // Time Slots
        slots: '/doctor/slots',
        slotsBulk: '/doctor/slots/bulk',
        slotById: (slotId: string) => `/doctor/slots/${slotId}`,
    },
    consultations: {
        // Instant Consultations
        pendingRequests: '/consultations/instant-requests/pending',

        // Consultations
        create: '/consultations',
        getById: (id: string) => `/consultations/${id}`,
        updateNotes: (id: string) => `/consultations/${id}/notes`,
    },
};

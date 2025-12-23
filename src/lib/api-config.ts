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
        submitApplication: '/doctors/submit-application',
        applicationStatus: '/doctors/application-status',
        uploadDocument: '/doctors/documents/upload',
        getDocuments: '/doctors/documents',
        deleteDocument: (id: string) => `/doctors/documents/${id}`,
    },
    doctorAppointments: {
        // Appointments
        list: '/doctor/appointments',
        getById: (id: string) => `/doctor/appointments/${id}`,
        confirm: (id: string) => `/doctor/appointments/${id}/confirm`,
        complete: (id: string) => `/doctor/appointments/${id}/complete`,

        // Schedule
        weeklySchedule: '/doctor/appointments/schedule/weekly',

        // Time Slots
        slots: '/doctor/appointments/slots',
        slotsBulk: '/doctor/appointments/slots/bulk',
        slotById: (slotId: string) => `/doctor/appointments/slots/${slotId}`,

        // Availability
        toggleAvailability: '/doctor/appointments/availability/toggle',

        // Instant Consultations
        pendingRequests: '/doctor/appointments/instant-requests/pending',
        acceptRequest: (id: string) => `/doctor/appointments/instant-requests/${id}/accept`,
        rejectRequest: (id: string) => `/doctor/appointments/instant-requests/${id}/reject`,
    },
    doctorConsultations: {
        // Consultation history
        list: '/doctor/consultations',
        getById: (id: string) => `/doctor/consultations/${id}`,
        updateNotes: (id: string) => `/doctor/consultations/${id}/notes`,
        end: (id: string) => `/doctor/consultations/${id}/end`,
    },
};

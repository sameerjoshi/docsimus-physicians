// API Configuration
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    appURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
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
};

export interface DoctorProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    dob: string;
    gender?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    registrationNumber: string;
    licenseNumber?: string;
    council: string;
    specialization: string;
    experience: string;
    bio?: string;
    consultationFee?: number;
    languages?: string[];
    availableNow: boolean;
    weeklyAvailability?: Record<string, string>;
    status: string;
    rejectionReason?: string; // Added for rejected applications
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
    verifiedAt?: string;
    documents?: any[];
    user?: {
        email: string;
        name: string | null;
    };
}

export interface UpdateDoctorProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dob?: string;
    gender?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    registrationNumber?: string;
    licenseNumber?: string;
    council?: string;
    specialization?: string;
    experience?: string;
    bio?: string;
    consultationFee?: number;
    languages?: string[];
    availableNow?: boolean;
    weeklyAvailability?: Record<string, string>;
}

export interface ApplicationStatus {
    status: string;
    submittedAt?: string;
    verifiedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorDocument {
    id: string;
    type: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
    status: string;
    createdAt: string;
}

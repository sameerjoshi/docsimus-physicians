"use client";

import { useCallback, useEffect, useState } from "react";
import {
    DEFAULT_ONBOARDING_STATE,
    DoctorOnboardingState,
    DocumentType,
} from "@/src/types/onboarding";
import { authService } from "@/src/services/auth.service";
import { doctorService } from "@/src/services/profile.service";
import { ApiError } from "@/src/lib/api-client";
import { DoctorProfile } from "../types/profile";

const STORAGE_KEY = "doctor-onboarding-state";

const cloneState = (state: DoctorOnboardingState): DoctorOnboardingState =>
    JSON.parse(JSON.stringify(state));

// Convert backend profile to frontend state
const convertBackendToState = async (profile: DoctorProfile): Promise<DoctorOnboardingState> => {
    // Fetch documents
    let documentsState: DoctorOnboardingState['documents'] = {
        medicalDegree: { status: "pending" },
        registrationCertificate: { status: "pending" },
        governmentId: { status: "pending" },
        profilePhoto: { status: "pending" },
        introVideo: { status: "pending" },
    };

    try {
        const documents = await doctorService.getDocuments();
        // Mark uploaded documents
        (documents as any[]).forEach((doc: any) => {
            if (doc.type && documentsState[doc.type as keyof typeof documentsState]) {
                (documentsState as any)[doc.type] = {
                    status: "uploaded",
                    fileName: doc.originalName,
                };
            }
        });
    } catch (err) {
        console.error("Failed to fetch documents:", err);
    }

    return {
        auth: { email: profile.user?.email || "" },
        profile: {
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            phone: profile.phone || "",
            email: profile.user?.email || "",
            dob: profile.dob ? profile.dob.split('T')[0] : "",
        },
        address: {
            addressLine1: profile.addressLine1 || "",
            addressLine2: profile.addressLine2 || "",
            city: profile.city || "",
            state: profile.state || "",
            postalCode: profile.postalCode || "",
        },
        professional: {
            registrationNumber: profile.registrationNumber || "",
            council: profile.council || "",
            specialization: profile.specialization || "",
            experience: profile.experience || "",
        },
        documents: documentsState,
        availability: {
            availableNow: profile.availableNow || false,
            weeklyAvailability: profile.weeklyAvailability || {},
            fee: profile.consultationFee ? (profile.consultationFee / 100).toString() : "1200",
            languages: profile.languages || ["English", "Hindi"],
            bio: profile.bio || "",
        },
        status: profile.status as any || "draft",
    };
};

export function useOnboarding() {
    const [state, setState] = useState<DoctorOnboardingState>(
        cloneState(DEFAULT_ONBOARDING_STATE)
    );
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load initial state
    useEffect(() => {
        const init = async () => {
            const isAuth = authService.isAuthenticated();
            setIsAuthenticated(isAuth);

            if (isAuth) {
                try {
                    // Fetch doctor profile from backend
                    const profile = await doctorService.getProfile();
                    const convertedState = await convertBackendToState(profile);
                    setState(convertedState);
                } catch (err) {
                    console.error("Failed to load doctor profile:", err);
                    // Fall back to localStorage
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        try {
                            setState(JSON.parse(stored));
                        } catch (e) {
                            console.error("Failed to parse stored state");
                        }
                    }
                }
            }
        };

        init();
    }, []);

    // Save to localStorage as backup
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const registerUser = useCallback(
        async (email: string, password: string, firstName?: string, lastName?: string): Promise<boolean> => {
            setLoading(true);
            setError(null);
            try {
                await authService.register({
                    email,
                    password,
                    name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
                    role: "DOCTOR",
                });

                // Update local state
                setState((prev) => ({
                    ...prev,
                    auth: { email },
                    profile: {
                        ...prev.profile,
                        email,
                        firstName: firstName || "",
                        lastName: lastName || "",
                    },
                }));

                setIsAuthenticated(true);
                setLoading(false);
                return true;
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Registration failed");
                setLoading(false);
                return false;
            }
        },
        []
    );

    const loginUser = useCallback(
        async (email: string, password: string): Promise<boolean> => {
            setLoading(true);
            setError(null);
            try {
                await authService.login({ email, password });

                // Fetch doctor profile
                const profile = await doctorService.getProfile();
                const convertedState = await convertBackendToState(profile);
                setState(convertedState);

                setIsAuthenticated(true);
                setLoading(false);
                return true;
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Login failed");
                setLoading(false);
                return false;
            }
        },
        []
    );

    const logout = useCallback(() => {
        authService.logout();
        setState(cloneState(DEFAULT_ONBOARDING_STATE));
        setIsAuthenticated(false);
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const updateProfile = useCallback(
        async (profile: Partial<DoctorOnboardingState["profile"]>) => {
            setState((prev) => ({ ...prev, profile: { ...prev.profile, ...profile } }));

            // Sync with backend
            if (isAuthenticated) {
                try {
                    const updateData = doctorService.convertStateToUpdateData({ profile } as Partial<DoctorOnboardingState>);
                    await doctorService.updateProfile(updateData);
                } catch (err) {
                    console.error("Failed to sync profile:", err);
                    setError("Failed to save profile changes");
                }
            }
        },
        [isAuthenticated]
    );

    const updateAddress = useCallback(
        async (address: Partial<DoctorOnboardingState["address"]>) => {
            setState((prev) => ({ ...prev, address: { ...prev.address, ...address } }));

            // Sync with backend
            if (isAuthenticated) {
                try {
                    const updateData = doctorService.convertStateToUpdateData({ address: address } as Partial<DoctorOnboardingState>);
                    await doctorService.updateProfile(updateData);
                } catch (err) {
                    console.error("Failed to sync profile:", err);
                    setError("Failed to save profile changes");
                }
            }
        },
        [isAuthenticated]
    );

    const updateProfessional = useCallback(
        async (professional: Partial<DoctorOnboardingState["professional"]>) => {
            setState((prev) => ({
                ...prev,
                professional: { ...prev.professional, ...professional },
            }));

            // Sync with backend
            if (isAuthenticated) {
                try {
                    const updateData = doctorService.convertStateToUpdateData({ professional } as Partial<DoctorOnboardingState>);
                    await doctorService.updateProfile(updateData);
                } catch (err) {
                    console.error("Failed to sync professional info:", err);
                    setError("Failed to save professional details");
                }
            }
        },
        [isAuthenticated]
    );

    const updateDocument = useCallback(
        (key: DocumentType, payload: { fileName?: string; previewUrl?: string; status?: string }) => {
            setState((prev) => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    [key]: { ...prev.documents[key], ...payload, status: payload.status || "uploaded" },
                },
            }));
            // Document upload will be handled separately with file upload endpoint
        },
        []
    );

    const updateAvailability = useCallback(
        async (availability: Partial<DoctorOnboardingState["availability"]>) => {
            setState((prev) => ({
                ...prev,
                availability: {
                    ...prev.availability,
                    ...availability,
                },
            }));

            // Sync with backend
            if (isAuthenticated) {
                try {
                    const updateData = doctorService.convertStateToUpdateData({ availability } as Partial<DoctorOnboardingState>);
                    await doctorService.updateProfile(updateData);
                } catch (err) {
                    console.error("Failed to sync availability:", err);
                    setError("Failed to save availability");
                }
            }
        },
        [isAuthenticated]
    );

    const setStatus = useCallback((status: DoctorOnboardingState["status"]) => {
        setState((prev) => ({ ...prev, status }));
    }, []);

    const submitApplication = useCallback(async (): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await doctorService.submitApplication();
            setState((prev) => ({ ...prev, status: "pending" }));
            setLoading(false);
            return true;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to submit application");
            setLoading(false);
            return false;
        }
    }, []);

    const reset = useCallback(() => {
        setState(cloneState(DEFAULT_ONBOARDING_STATE));
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
        }
        setIsAuthenticated(false);
        authService.logout();
    }, []);

    return {
        state,
        isAuthenticated,
        loading,
        error,
        registerUser,
        loginUser,
        logout,
        updateProfile,
        updateAddress,
        updateProfessional,
        updateDocument,
        updateAvailability,
        setStatus,
        submitApplication,
        reset,
        clearError: () => setError(null),
    };
}

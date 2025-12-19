"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_ONBOARDING_STATE,
  DoctorOnboardingState,
  DocumentType,
} from "../types/doctor";

const STORAGE_KEY = "doctor-onboarding-state";
const AUTH_KEY = "doctor-auth";
const CREDENTIALS_KEY = "doctor-credentials";

const cloneState = (state: DoctorOnboardingState): DoctorOnboardingState =>
  JSON.parse(JSON.stringify(state));

const readFromStorage = (): DoctorOnboardingState => {
  if (typeof window === "undefined") return cloneState(DEFAULT_ONBOARDING_STATE);
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return cloneState(DEFAULT_ONBOARDING_STATE);
  try {
    const parsed = JSON.parse(stored) as DoctorOnboardingState;
    return { ...cloneState(DEFAULT_ONBOARDING_STATE), ...parsed };
  } catch (error) {
    console.warn("Failed to parse onboarding state", error);
    return cloneState(DEFAULT_ONBOARDING_STATE);
  }
};

const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  const auth = window.localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth).isAuthenticated : false;
};

const saveCredentials = (email: string, password: string): void => {
  if (typeof window === "undefined") return;
  const credentials = { email, password: btoa(password) }; // Simple encoding, not secure for production
  window.localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
};

const verifyCredentials = (email: string, password: string): boolean => {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(CREDENTIALS_KEY);
  if (!stored) return false;
  try {
    const credentials = JSON.parse(stored);
    return credentials.email === email && credentials.password === btoa(password);
  } catch {
    return false;
  }
};

export function useDoctorOnboarding() {
  const [state, setState] = useState<DoctorOnboardingState>(
    cloneState(DEFAULT_ONBOARDING_STATE)
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setState(readFromStorage());
    setIsAuthenticated(isUserLoggedIn());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateAuth = useCallback((email: string, password?: string, firstName?: string, lastName?: string) => {
    setState((prev) => ({
      ...prev,
      auth: { email },
      profile: { 
        ...prev.profile, 
        email,
        firstName: firstName || prev.profile.firstName,
        lastName: lastName || prev.profile.lastName,
      },
    }));
    if (password) {
      saveCredentials(email, password);
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: true }));
      }
    }
  }, []);

  const loginUser = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate async login - in production, validate against backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if credentials match what was stored during signup
        if (verifyCredentials(email, password)) {
          setState(prev => ({
            ...prev,
            auth: { email },
            profile: { ...prev.profile, email },
          }));
          setIsAuthenticated(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: true }));
          }
          resolve(true);
        } else {
          // For demo purposes: if no credentials stored yet, accept any login
          // In production, this should call a real backend API
          console.warn("No stored credentials found. Accepting login for demo.");
          setState(prev => ({
            ...prev,
            auth: { email },
            profile: { ...prev.profile, email },
          }));
          setIsAuthenticated(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated: true }));
          }
          resolve(true);
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_KEY);
    }
  }, []);

  const updateProfile = useCallback(
    (profile: Partial<DoctorOnboardingState["profile"]>) => {
      setState((prev) => ({ ...prev, profile: { ...prev.profile, ...profile } }));
    },
    []
  );

  const updateProfessional = useCallback(
    (professional: Partial<DoctorOnboardingState["professional"]>) => {
      setState((prev) => ({
        ...prev,
        professional: { ...prev.professional, ...professional },
      }));
    },
    []
  );

  const updateDocument = useCallback(
    (key: DocumentType, payload: { fileName?: string; previewUrl?: string }) => {
      setState((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: { ...prev.documents[key], ...payload, status: "uploaded" },
        },
      }));
    },
    []
  );

  const updateAvailability = useCallback(
    (availability: Partial<DoctorOnboardingState["availability"]>) => {
      setState((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          ...availability,
        },
      }));
    },
    []
  );

  const setStatus = useCallback((status: DoctorOnboardingState["status"]) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const reset = useCallback(() => {
    setState(cloneState(DEFAULT_ONBOARDING_STATE));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(AUTH_KEY);
      window.localStorage.removeItem(CREDENTIALS_KEY);
    }
    setIsAuthenticated(false);
  }, []);

  return {
    state,
    isAuthenticated,
    updateAuth,
    loginUser,
    logout,
    updateProfile,
    updateProfessional,
    updateDocument,
    updateAvailability,
    setStatus,
    reset,
  };
}

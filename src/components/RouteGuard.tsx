"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { useProfile } from "../hooks/use-profile";

/**
 * Defines the level of protection required.
 * Each level encapsulates those above it.
 */
export enum GuardLevel {
    PUBLIC,
    AUTHENTICATED,
    EMAIL_VERIFIED,
    ONBOARDED,
}

export enum Role {
    USER = "USER",
    DOCTOR = "DOCTOR",
    REVIEWER = "REVIEWER",
    ADMIN = "ADMIN",
}

interface RouteGuardProps {
    children: React.ReactNode;
    level?: GuardLevel;
    role?: Role;
}

/**
 * Guard that authorises access based on provided level and role.
 */
export function RouteGuard({
    children,
    level = GuardLevel.ONBOARDED,
    role = Role.DOCTOR,
}: RouteGuardProps) {
    const [isChecking, setIsChecking] = useState(true);
    const [hasFetchedStatus, setHasFetchedStatus] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
    const { applicationStatus, fetchApplicationStatus, isLoading: isProfileLoading } = useProfile();

    // Fetch application status once when needed
    useEffect(() => {
        if (
            !isAuthLoading &&
            isAuthenticated &&
            user?.role === Role.DOCTOR &&
            level === GuardLevel.ONBOARDED &&
            !hasFetchedStatus
        ) {
            fetchApplicationStatus();
            setHasFetchedStatus(true);
        }
    }, [isAuthLoading, isAuthenticated, user?.role, level, hasFetchedStatus, fetchApplicationStatus]);

    // Main access check effect
    useEffect(() => {
        if (level === GuardLevel.PUBLIC) {
            setIsChecking(false);
            return;
        }

        // Wait for auth to finish loading
        if (isAuthLoading) {
            return;
        }

        // Check authentication
        if (!isAuthenticated) {
            console.log("Not authenticated, redirecting to login");
            router.push("/login");
            return;
        }

        // Check user
        if (!user) {
            console.log("No user data, redirecting to login");
            router.push("/login");
            return;
        }

        if (level === GuardLevel.AUTHENTICATED) {
            setIsChecking(false);
            return;
        }

        // Check email verification
        if (!user.isVerified) {
            console.log("Email not verified, redirecting");
            router.push("/verify-email");
            return;
        }

        if (level === GuardLevel.EMAIL_VERIFIED) {
            setIsChecking(false);
            return;
        }

        // Check role
        if (user.role !== role) {
            console.log(`Role mismatch: expected ${role}, got ${user.role}`);
            router.push("/login?error=unauthorized");
            return;
        }

        // Check onboarding status if user is a Doctor
        if (role === Role.DOCTOR && level === GuardLevel.ONBOARDED) {
            // Wait for application status to be fetched
            if (isProfileLoading || !hasFetchedStatus) {
                return;
            }

            if (applicationStatus?.status === "DRAFT") {
                // DRAFT: Should be on registration page
                if (pathname !== "/registration" && pathname !== "/registration/review") {
                    router.push("/registration");
                    return;
                }
            } else if (applicationStatus?.status === "PENDING") {
                // PENDING: Should be on application-status page
                if (pathname !== "/application-status") {
                    router.push("/application-status");
                    return;
                }
            } else if (applicationStatus?.status === "REJECTED") {
                // REJECTED: Can resubmit, redirect to registration
                if (pathname !== "/registration") {
                    router.push("/registration?status=rejected");
                    return;
                }
            } else if (applicationStatus?.status === "VERIFIED") {
                // VERIFIED: Redirect away from onboarding pages
                if (pathname === "/registration" || pathname === "/application-status") {
                    router.push("/dashboard");
                    return;
                }
            }
        }

        setIsChecking(false);
    }, [isAuthLoading, isAuthenticated, user, level, role, pathname, router, applicationStatus, isProfileLoading, hasFetchedStatus]);

    // Reset when pathname changes
    useEffect(() => {
        setIsChecking(true);
        setHasFetchedStatus(false);
    }, [pathname]);

    if (isChecking) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return <>{children}</>;
}

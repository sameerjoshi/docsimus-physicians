"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";

interface RouteGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireVerified?: boolean;
    requireOnboarding?: boolean;
    requireRole?: 'DOCTOR' | 'ADMIN' | 'USER';
}

export function RouteGuard({
    children,
    requireAuth = false,
    requireVerified = false,
    requireOnboarding = false,
    requireRole,
}: RouteGuardProps) {
    const router = useRouter();

    useEffect(() => {
        const checkAccess = async () => {
            // Check authentication
            const isAuthenticated = authService.isAuthenticated();

            if (requireAuth && !isAuthenticated) {
                router.push("/login");
                return;
            }

            if (!isAuthenticated) return;

            // Get user data
            const user = authService.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            // Check email verification
            if (requireVerified && !user.isVerified) {
                router.push("/verify-email");
                return;
            }

            // Check user role
            if (requireRole && user.role !== requireRole) {
                // Redirect to unauthorized page or login
                router.push("/login?error=unauthorized");
                return;
            }

            // Check onboarding completion (if doctor role)
            if (requireOnboarding && user.role === "DOCTOR") {
                try {
                    const response = await fetch("http://localhost:3001/doctors/profile", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    });

                    // Handle email not verified error from backend
                    if (response.status === 400) {
                        const errorData = await response.json();
                        if (errorData.message?.includes("verify your email")) {
                            router.push("/verify-email");
                            return;
                        }
                    }

                    if (response.ok) {
                        const profile = await response.json();

                        // If status is DRAFT, redirect to onboarding
                        if (profile.status === "DRAFT") {
                            router.push("/onboarding");
                            return;
                        }
                    }
                } catch (error) {
                    console.error("Failed to check onboarding status:", error);
                    // Don't block access on network errors, user will see error on page
                }
            }
        };

        checkAccess();
    }, [requireAuth, requireVerified, requireOnboarding, requireRole, router]);

    return <>{children}</>;
}

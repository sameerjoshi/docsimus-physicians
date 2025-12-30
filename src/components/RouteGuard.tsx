"use client";

import { useEffect, useState } from "react";
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
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            // Wait for client-side hydration
            await new Promise(resolve => setTimeout(resolve, 0));

            // Check authentication (this now also validates token expiration)
            const isAuthenticated = authService.isAuthenticated();

            console.log("RouteGuard check:", { isAuthenticated, requireAuth, requireRole });

            if (requireAuth && !isAuthenticated) {
                console.log("Not authenticated or token expired, redirecting to login");
                router.push("/login");
                return;
            }

            if (!isAuthenticated) {
                setIsChecking(false);
                return;
            }

            // Get user data
            const user = authService.getUser();
            console.log("User data:", user);

            if (!user) {
                console.log("No user data, redirecting to login");
                router.push("/login");
                return;
            }

            // Check email verification
            if (requireVerified && !user.isVerified) {
                console.log("Email not verified, redirecting");
                router.push("/verify-email");
                return;
            }

            // Check user role
            if (requireRole && user.role !== requireRole) {
                console.log(`Role mismatch: expected ${requireRole}, got ${user.role}`);
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

                        // Status-based routing
                        const currentPath = window.location.pathname;

                        if (profile.status === "DRAFT") {
                            // DRAFT: Should be on registration page
                            if (currentPath !== "/registration") {
                                router.push("/registration");
                                return;
                            }
                        } else if (profile.status === "PENDING") {
                            // PENDING: Should be on application-status page
                            if (currentPath !== "/application-status") {
                                router.push("/application-status");
                                return;
                            }
                        } else if (profile.status === "REJECTED") {
                            // REJECTED: Can resubmit, redirect to registration
                            if (currentPath !== "/registration") {
                                router.push("/registration?status=rejected");
                                return;
                            }
                        } else if (profile.status === "VERIFIED") {
                            // VERIFIED: Redirect to dashboard
                            if (currentPath === "/registration" || currentPath === "/application-status") {
                                router.push("/dashboard");
                                return;
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to check onboarding status:", error);
                    // Don't block access on network errors, user will see error on page
                }
            }

            setIsChecking(false);
        };

        checkAccess();
    }, [requireAuth, requireVerified, requireOnboarding, requireRole, router]);

    if (isChecking && requireAuth) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return <>{children}</>;
}

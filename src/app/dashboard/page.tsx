"use client";

import { useOnboarding } from "@/src/hooks/useOnboarding";
import { DoctorDashboard } from "@/src/components/dashboard/DoctorDashboard";

export default function DashboardPage() {
  const { isAuthenticated } = useOnboarding();

  if (!isAuthenticated) {
    return null;
  }

  // TODO: In production, implement role-based rendering
  // Check user role from state or backend and render AdminDashboard if needed
  return <DoctorDashboard />;
}

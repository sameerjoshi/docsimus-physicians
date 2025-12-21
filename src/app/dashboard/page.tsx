"use client";

import { DoctorDashboard } from "@/src/components/dashboard/DoctorDashboard";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true} requireVerified={true} requireOnboarding={true}>
      <DoctorDashboard />
    </RouteGuard>
  );
}

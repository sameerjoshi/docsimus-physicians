"use client";

import { DoctorDashboard } from "@/src/components/dashboard/DoctorDashboard";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function SchedulePage() {
  return (
    <RouteGuard requireAuth={true} requireVerified={true} requireRole="DOCTOR">
      <DoctorDashboard />
    </RouteGuard>
  );
}

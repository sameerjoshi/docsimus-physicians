"use client";

import { DoctorDashboard } from "@/src/components/dashboard/DoctorDashboard";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function SettingsPage() {
  return (
    <RouteGuard requireAuth={true} requireVerified={true} requireRole="DOCTOR">
      <DoctorDashboard />
    </RouteGuard>
  );
}

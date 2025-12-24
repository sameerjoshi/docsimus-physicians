"use client";

import { RegistrationForm } from "@/src/components/registration/RegistrationForm";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function RegistrationPage() {
  return (
    <RouteGuard requireAuth={true} requireVerified={true} requireRole="DOCTOR" requireOnboarding={true}>
      <div className="min-h-screen bg-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <RegistrationForm />
        </div>
      </div>
    </RouteGuard>
  );
}

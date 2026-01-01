"use client";

import { RegistrationForm } from "@/src/components/registration/RegistrationForm";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function RegistrationPage() {
  return (
    <RouteGuard>
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <RegistrationForm />
        </div>
      </div>
    </RouteGuard>
  );
}

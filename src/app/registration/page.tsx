"use client";

import { RegistrationForm } from "@/src/components/registration/RegistrationForm";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <RegistrationForm />
      </div>
    </div>
  );
}

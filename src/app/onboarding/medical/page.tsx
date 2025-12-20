"use client";

import { MedicalSection } from "@/src/components/onboarding/MedicalSection";

export default function MedicalPage() {
  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <MedicalSection />
      </div>
    </div>
  );
}

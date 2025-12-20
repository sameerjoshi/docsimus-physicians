"use client";

import { AddressSection } from "@/src/components/onboarding/AddressSection";

export default function AddressPage() {
  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <AddressSection />
      </div>
    </div>
  );
}

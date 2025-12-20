"use client";

import { PersonalSection } from "@/src/components/onboarding/PersonalSection";

export default function PersonalPage() {
  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <PersonalSection />
      </div>
    </div>
  );
}

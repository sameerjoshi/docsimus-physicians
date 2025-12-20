"use client";

import { OnboardingHub } from "@/src/components/onboarding/OnboardingHub";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <OnboardingHub />
      </div>
    </div>
  );
}

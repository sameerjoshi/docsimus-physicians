"use client";

import { OnboardingHub } from "@/src/components/onboarding/OnboardingHub";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function OnboardingPage() {
  return (
    <RouteGuard requireAuth={true} requireVerified={true}>
      <div className="min-h-screen bg-secondary/60 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <OnboardingHub />
        </div>
      </div>
    </RouteGuard>
  );
}

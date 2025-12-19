"use client";

import { StepIndicator } from "@/src/components/ui";
import { ONBOARDING_STEPS } from "../types/doctor";

interface ProgressIndicatorProps {
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({ currentStep, className }: ProgressIndicatorProps) {
  return <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} className={className} />;
}

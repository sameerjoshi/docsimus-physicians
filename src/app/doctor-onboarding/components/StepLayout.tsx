"use client";

import { FormEvent, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, StepIndicator } from "@/src/components/ui";
import { ONBOARDING_STEPS } from "../types/doctor";

interface StepLayoutProps {
  title: string;
  description: string;
  currentStep: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  nextLabel?: string;
  backLabel?: string;
}

export function StepLayout({
  title,
  description,
  currentStep,
  children,
  onBack,
  onNext,
  onSubmit,
  nextLabel = "Save & Continue",
  backLabel = "Back",
}: StepLayoutProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(event);
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-secondary/60">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary mb-2">Doctor Onboarding</p>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="bg-secondary/70 border-b border-card-border">
            <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {children}

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="gap-2"
                  disabled={!onBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </Button>
                <Button type="submit" className="gap-2">
                  {nextLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

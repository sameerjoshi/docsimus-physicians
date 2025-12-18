"use client";

import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { title: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li key={step.title} className="relative flex-1">
              <div className="flex flex-col items-center">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute left-0 top-4 -translate-y-1/2 h-0.5 w-full -translate-x-1/2",
                      isCompleted || isCurrent ? "bg-primary" : "bg-border"
                    )}
                    style={{ width: "calc(100% - 2rem)", left: "calc(-50% + 1rem)" }}
                  />
                )}

                {/* Step circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>

                {/* Step title */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

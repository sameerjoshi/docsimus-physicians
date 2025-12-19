"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { StepLayout } from "../../components/StepLayout";
import { useDoctorOnboarding } from "../../hooks/useDoctorOnboarding";

export default function AvailabilityStepPage() {
  const router = useRouter();
  const { state, updateAvailability, setStatus } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, string>>({});
  const [fee, setFee] = useState("");
  const [languages, setLanguages] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setAvailableNow(state.availability.availableNow);
    setWeeklyAvailability(state.availability.weeklyAvailability);
    setFee(state.availability.fee);
    setLanguages(state.availability.languages.join(", "));
    setBio(state.availability.bio);
    setIsHydrated(true);
  }, [state.availability]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const languageList = languages
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean);

    updateAvailability({ availableNow, weeklyAvailability, fee, languages: languageList, bio });
    setStatus("pending");
    router.push("/doctor-onboarding/pending");
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <StepLayout
      title="Availability & preferences"
      description="Set how and when you want to consult with patients."
      currentStep={4}
      onSubmit={handleSubmit}
      onBack={() => router.push("/doctor-onboarding/onboarding/step-3-documents")}
      nextLabel="Submit for review"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-[var(--radius)] border border-card-border bg-secondary/60 p-4">
          <div>
            <p className="text-sm font-medium">Available now</p>
            <p className="text-xs text-muted-foreground">Toggle to appear online for instant consultations.</p>
          </div>
          <button
            type="button"
            onClick={() => setAvailableNow((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${availableNow ? "bg-primary" : "bg-border"}`}
            aria-pressed={availableNow}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${availableNow ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Weekly availability</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(weeklyAvailability).map(([day, value]) => (
              <div key={day} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{day}</label>
                <Input
                  value={value}
                  onChange={(e) => setWeeklyAvailability((prev) => ({ ...prev, [day]: e.target.value }))}
                  placeholder="e.g., 09:00 - 17:00"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Consultation fee (INR)</label>
            <Input
              type="number"
              min={0}
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="1200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Languages spoken</label>
            <Input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="English, Hindi"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Short bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full min-h-[120px] rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Share your experience and areas of interest"
          />
        </div>
      </div>
    </StepLayout>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { StepLayout } from "../../components/StepLayout";
import { useDoctorOnboarding } from "../../hooks/useDoctorOnboarding";

const councils = [
  "Medical Council of India",
  "Delhi Medical Council",
  "Maharashtra Medical Council",
  "Tamil Nadu Medical Council",
  "Karnataka Medical Council",
  "Kerala Medical Council",
];

export default function ProfessionalStepPage() {
  const router = useRouter();
  const { state, updateProfessional } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [form, setForm] = useState({ ...state.professional });

  useEffect(() => {
    setForm({ ...state.professional });
    setIsHydrated(true);
  }, [state.professional]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfessional(form);
    router.push("/doctor-onboarding/onboarding/step-3-documents");
  };

  if (!isHydrated) {
    return null;
  };

  return (
    <StepLayout
      title="Professional details"
      description="Share your credentials so we can verify your practice."
      currentStep={2}
      onSubmit={handleSubmit}
      onBack={() => router.push("/doctor-onboarding/onboarding/step-1-profile")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Registration number</label>
          <Input
            value={form.registrationNumber}
            onChange={(e) => handleChange("registrationNumber", e.target.value)}
            placeholder="e.g., DMC/2015/12345"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State medical council</label>
          <select
            className="h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={form.council}
            onChange={(e) => handleChange("council", e.target.value)}
            required
          >
            <option value="" disabled>
              Select council
            </option>
            {councils.map((council) => (
              <option key={council} value={council}>
                {council}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Specialization</label>
          <Input
            value={form.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
            placeholder="Cardiology, Dermatology, etc."
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Years of experience</label>
          <Input
            type="number"
            min={0}
            value={form.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            placeholder="10"
            required
          />
        </div>
      </div>
    </StepLayout>
  );
}

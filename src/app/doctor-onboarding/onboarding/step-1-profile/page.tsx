"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { StepLayout } from "../../components/StepLayout";
import { useDoctorOnboarding } from "../../hooks/useDoctorOnboarding";
import { Avatar } from "@/src/components/ui";
import { UploadCloud } from "lucide-react";

export default function ProfileStepPage() {
  const router = useRouter();
  const { state, updateProfile } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    // Initialize from state after hydration
    setFirstName(state.profile.firstName);
    setLastName(state.profile.lastName);
    setPhone(state.profile.phone || "+91 ");
    setEmail(state.profile.email);
    setDob(state.profile.dob);
    setPhotoPreview(state.profile.photo || "");
    setIsHydrated(true);
  }, [state.profile]);

  const isValid = useMemo(() => firstName.trim() && lastName.trim() && phone.trim() && dob.trim(), [firstName, lastName, phone, dob]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    updateProfile({ firstName, lastName, phone, dob, photo: photoPreview });
    router.push("/doctor-onboarding/onboarding/step-2-professional");
  };

  const handlePhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  if (!isHydrated) {
    return null;
  };

  return (
    <StepLayout
      title="Personal profile"
      description="Tell us about yourself so we can create your profile."
      currentStep={1}
      onSubmit={handleSubmit}
      onBack={() => router.back()}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">First name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Dr. Aarya"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Sharma"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={email} disabled placeholder="doctor@clinic.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of birth</label>
          <Input
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="DD/MM/YYYY"
            type="text"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile photo</label>
          <div className="flex items-center gap-4 rounded-[var(--radius)] border border-card-border bg-secondary/50 p-4">
            <Avatar src={photoPreview} fallback={`${firstName} ${lastName}`} size="lg" />
            <div className="flex-1">
              <p className="text-sm font-medium">Upload a clear headshot</p>
              <p className="text-xs text-muted-foreground">PNG or JPG, max 5MB</p>
            </div>
            <label className="inline-flex">
              <input type="file" className="sr-only" accept="image/*" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
              <span className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-input px-3 py-2 text-sm cursor-pointer hover:bg-secondary">
                <UploadCloud className="h-4 w-4" /> Upload
              </span>
            </label>
          </div>
        </div>
      </div>
      <input type="hidden" value={isValid ? "valid" : "invalid"} readOnly />
    </StepLayout>
  );
}

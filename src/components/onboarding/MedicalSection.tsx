"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { useOnboardingAPI } from "@/src/hooks/useOnboardingAPI";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";

const councils = [
  "Medical Council of India",
  "Delhi Medical Council",
  "Maharashtra Medical Council",
  "Tamil Nadu Medical Council",
  "Karnataka Medical Council",
  "Kerala Medical Council",
  "Telangana Medical Council",
  "Andhra Pradesh Medical Council",
  "Gujarat Medical Council",
  "Punjab Medical Council",
];

const specializations = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "Ophthalmology",
  "ENT",
  "Dentistry",
  "Ayurveda",
  "Homeopathy",
  "Unani",
  "Siddha",
];

export function MedicalSection() {
  const router = useRouter();
  const { state, updateProfessional } = useOnboardingAPI();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [council, setCouncil] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRegistrationNumber(state.professional.registrationNumber || "");
    setCouncil(state.professional.council || "");
    setSpecialization(state.professional.specialization || "");
    setExperience(state.professional.experience || "");
  }, [state.professional]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    updateProfessional({ registrationNumber, council, specialization, experience });

    setTimeout(() => {
      setIsSaving(false);
      router.push("/onboarding");
    }, 500);
  };

  const isValid = !!(registrationNumber.trim() && council && specialization && experience.trim());

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/onboarding")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Medical Information</h1>
          <p className="text-muted-foreground mt-1">Your qualifications and registration</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>
            Your medical qualifications, specialization, and council registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization *</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select specialization</option>
                  {specializations.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience *</label>
                <Input
                  placeholder="e.g., 10 years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Medical Council *</label>
              <select
                value={council}
                onChange={(e) => setCouncil(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select council</option>
                {councils.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Number *</label>
              <Input
                placeholder="e.g., DMC/2015/12345"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!isValid || isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save & Continue"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/onboarding")}
              >
                Discard
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

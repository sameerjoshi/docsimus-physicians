"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { useDoctorOnboarding } from "../../doctor-onboarding/hooks/useDoctorOnboarding";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";

export default function AvailabilityPage() {
  const router = useRouter();
  const { state, updateAvailability } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, string>>({});
  const [fee, setFee] = useState("");
  const [languages, setLanguages] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setAvailableNow(state.availability.availableNow);
    setWeeklyAvailability(state.availability.weeklyAvailability);
    setFee(state.availability.fee);
    setLanguages(state.availability.languages.join(", "));
    setBio(state.availability.bio);
    setIsHydrated(true);
  }, [state.availability]);

  if (!isHydrated) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const languageList = languages
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean);

    updateAvailability({ availableNow, weeklyAvailability, fee, languages: languageList, bio });

    setTimeout(() => {
      setIsSaving(false);
      router.push("/doctor-onboarding-new");
    }, 500);
  };

  const isValid = !!(fee.trim() && languages.trim());

  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/doctor-onboarding-new")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Availability & Preferences</h1>
              <p className="text-muted-foreground mt-1">Set your consultation schedule and fees</p>
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Settings</CardTitle>
              <CardDescription>
                How and when you want to consult with patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Available Now Toggle */}
                <div className="flex items-center justify-between rounded-[var(--radius)] border border-card-border bg-secondary/60 p-4">
                  <div>
                    <p className="text-sm font-medium">Available Now</p>
                    <p className="text-xs text-muted-foreground">Toggle to appear online for instant consultations</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAvailableNow(!availableNow)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      availableNow ? "bg-primary" : "bg-border"
                    }`}
                    aria-pressed={availableNow}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        availableNow ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Consultation Fee */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Fee (₹) *</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 500"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    required
                  />
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Languages (comma-separated) *</label>
                  <Input
                    placeholder="e.g., English, Hindi, Marathi"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple languages with commas</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Professional Bio (Optional)</label>
                  <textarea
                    placeholder="Brief introduction about yourself and your practice..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-24"
                  />
                </div>

                {/* Weekly Availability */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Weekly Availability</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(weeklyAvailability).map(([day, value]) => (
                      <div key={day} className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">{day}</label>
                        <Input
                          placeholder="e.g., 09:00 - 17:00"
                          value={value}
                          onChange={(e) =>
                            setWeeklyAvailability((prev) => ({
                              ...prev,
                              [day]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
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
                    onClick={() => router.push("/doctor-onboarding-new")}
                  >
                    Discard
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { useOnboardingAPI } from "@/src/hooks/useOnboardingAPI";
import { authService } from "@/src/services/auth.service";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";

export function PersonalSection() {
  const router = useRouter();
  const { state, updateProfile } = useOnboardingAPI();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // Starts blank
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const user = authService.getUser();

    // Pre-fill from state (backend data)
    setFirstName(state.profile.firstName);
    setLastName(state.profile.lastName);
    setPhone(state.profile.phone || "");

    // Only set dob if there's a valid value (not the placeholder date)
    if (state.profile.dob && !state.profile.dob.startsWith('1900')) {
      setDob(state.profile.dob);
    }

    setEmail(state.profile.email || user?.email || "");
  }, [state.profile]);

  // Calculate max date (20 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    updateProfile({ firstName, lastName, phone, dob });

    setTimeout(() => {
      setIsSaving(false);
      router.push("/onboarding");
    }, 500);
  };

  const isValid = !!(firstName.trim() && lastName.trim() && phone.trim() && dob.trim());

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
          <h1 className="text-3xl font-bold">Personal Information</h1>
          <p className="text-muted-foreground mt-1">Tell us about yourself</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>
            Your name, contact information, and date of birth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name *</label>
                <Input
                  placeholder="e.g., Aarya"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name *</label>
                <Input
                  placeholder="e.g., Sharma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone *</label>
                <Input
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth *</label>
                <Input
                  placeholder="mm/dd/yyyy"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={getMaxDate()}
                  required
                />
                <p className="text-xs text-muted-foreground">You must be at least 20 years old</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Cannot be changed - registered with your account</p>
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

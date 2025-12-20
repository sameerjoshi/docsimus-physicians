"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";

export function PersonalSection() {
  const router = useRouter();
  const { state, updateProfile } = useOnboarding();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFirstName(state.profile.firstName);
    setLastName(state.profile.lastName);
    setPhone(state.profile.phone || "");
    setDob(state.profile.dob);
  }, [state.profile]);

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
                  placeholder="DD/MM/YYYY"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder={state.profile.email || "doctor@clinic.com"}
                disabled
                defaultValue={state.profile.email}
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

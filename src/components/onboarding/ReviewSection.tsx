"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Avatar } from "@/src/components/ui";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { DOCUMENT_REQUIREMENTS } from "@/src/types/onboarding";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export function ReviewSection() {
  const router = useRouter();
  const { state, setStatus } = useOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const fullName = `${state.profile.firstName || ""} ${state.profile.lastName || ""}`.trim() || "Doctor";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mark onboarding as submitted
    setStatus("pending");
    
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Personal Profile */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={state.profile.photo} fallback={fullName} size="lg" />
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">{fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{state.profile.email || state.auth.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-semibold">{state.profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-semibold">{state.profile.dob}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Address */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Your clinic location</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Street</p>
              <p className="font-semibold">{state.profile.addressLine1}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Landmark</p>
              <p className="font-semibold">{state.profile.addressLine2 || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">City</p>
              <p className="font-semibold">{state.profile.city}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">State</p>
              <p className="font-semibold">{state.profile.state}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PIN Code</p>
              <p className="font-semibold">{state.profile.postalCode}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medical Information */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>Your credentials and qualifications</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="font-semibold">{state.professional.specialization}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-semibold">{state.professional.experience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medical Council</p>
              <p className="font-semibold">{state.professional.council}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <p className="font-semibold">{state.professional.registrationNumber}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documents */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded verification documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DOCUMENT_REQUIREMENTS.map((doc) => {
              const isUploaded = state.documents[doc.key]?.status === "uploaded";
              return (
                <div
                  key={doc.key}
                  className="flex items-center justify-between rounded-[var(--radius)] border border-card-border bg-secondary/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{doc.label}</p>
                    {isUploaded && state.documents[doc.key]?.fileName && (
                      <p className="text-xs text-primary">📄 {state.documents[doc.key]?.fileName}</p>
                    )}
                  </div>
                  {isUploaded ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-warning" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Availability */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Availability & Preferences</CardTitle>
            <CardDescription>Your consultation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="font-semibold">₹{state.availability.fee}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="font-semibold">{state.availability.languages.join(", ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Now</p>
                <Badge variant={state.availability.availableNow ? "success" : "secondary"}>
                  {state.availability.availableNow ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            {state.availability.bio && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Bio</p>
                <p className="text-sm">{state.availability.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={staggerItem} className="flex gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          variant="gradient"
          className="gap-2"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/onboarding")}
          disabled={isSubmitting}
        >
          Back to Edit
        </Button>
      </motion.div>
    </motion.div>
  );
}

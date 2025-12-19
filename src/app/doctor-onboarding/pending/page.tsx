"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock4, HelpCircle, User, Briefcase, Calendar, FileText, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Avatar } from "@/src/components/ui";
import { useDoctorOnboarding } from "../hooks/useDoctorOnboarding";
import { DOCUMENT_REQUIREMENTS } from "../types/doctor";
import { StatusBadge } from "../components/StatusBadge";

export default function PendingPage() {
  const router = useRouter();
  const { state } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const fullName = `${state.profile.firstName || ""} ${state.profile.lastName || ""}`.trim() || "Doctor";

  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">Application submitted</p>
            <h1 className="text-3xl font-bold mb-2">Your profile is under review</h1>
            <p className="text-muted-foreground max-w-2xl">
              We are verifying your credentials. This usually takes 24-48 hours. You will receive an email at {state.auth.email || "your registered email"} once the review is complete.
            </p>
          </div>
          <StatusBadge status="submitted" />
        </div>

        {/* Personal Profile Section */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Personal Profile</CardTitle>
                <CardDescription>Your submitted personal information</CardDescription>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <Avatar src={state.profile.photo} fallback={fullName} size="lg" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{fullName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{state.profile.email || state.auth.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{state.profile.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-semibold">{state.profile.dob || "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details Section */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Your credentials and qualifications</CardDescription>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-semibold">{state.professional.registrationNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medical Council</p>
                <p className="font-semibold">{state.professional.council || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="font-semibold">{state.professional.specialization || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-semibold">{state.professional.experience || "Not provided"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold">{state.profile.addressLine1}, {state.profile.city}, {state.profile.state} {state.profile.postalCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Section */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Verification Documents</CardTitle>
                <CardDescription>Documents received and waiting for verification</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1"><Clock4 className="h-4 w-4" /> In review</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {DOCUMENT_REQUIREMENTS.map((doc) => {
              const isUploaded = state.documents[doc.key]?.status === "uploaded";
              return (
                <div key={doc.key} className="flex items-center justify-between rounded-[var(--radius)] border border-card-border bg-secondary/60 px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{doc.label}</p>
                    <p className="text-xs text-muted-foreground">{doc.hint}</p>
                    {isUploaded && state.documents[doc.key]?.fileName && (
                      <p className="text-xs text-primary mt-1">📄 {state.documents[doc.key]?.fileName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isUploaded ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Submitted</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-warning">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Availability Section */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Availability & Preferences</CardTitle>
                <CardDescription>Your consultation settings</CardDescription>
              </div>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="font-semibold">₹{state.availability.fee || "0"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="font-semibold">{state.availability.languages.join(", ") || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Now</p>
                <p className="font-semibold">{state.availability.availableNow ? "✓ Yes" : "✗ No"}</p>
              </div>
            </div>
            {state.availability.bio && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Bio</p>
                <p className="text-sm">{state.availability.bio}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Weekly Availability</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(state.availability.weeklyAvailability).map(([day, hours]) => (
                  <div key={day} className="bg-secondary/40 rounded p-3">
                    <p className="text-xs font-medium text-muted-foreground">{day}</p>
                    <p className="text-sm font-semibold">{hours || "Not available"}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-md bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm font-semibold">Need help?</p>
                <p className="text-sm text-muted-foreground">Reach our onboarding team at support@docsimus.com</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/doctor-onboarding/dashboard")}>View dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

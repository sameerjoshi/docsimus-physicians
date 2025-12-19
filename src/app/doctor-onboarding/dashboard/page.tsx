"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Avatar, Button } from "@/src/components/ui";
import { useDoctorOnboarding } from "../hooks/useDoctorOnboarding";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate } from "@/src/lib/utils";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { state, isAuthenticated, logout } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isAuthenticated) {
      router.replace("/doctor-onboarding/auth/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  const fullName = `${state.profile.firstName || "Doctor"} ${state.profile.lastName || ""}`.trim();

  const handleLogout = () => {
    logout();
    router.push("/doctor-onboarding/auth/login");
  };

  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">Dashboard</p>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {fullName || "Doctor"}</h1>
            <p className="text-muted-foreground">Your onboarding is in a read-only state while we review your submission.</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={state.status === "pending" ? "pending" : "uploaded"} />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="flex items-center gap-4">
              <Avatar src={state.profile.photo} fallback={fullName} size="lg" />
              <div>
                <CardTitle className="text-xl">{fullName || "Doctor"}</CardTitle>
                <CardDescription>{state.professional.specialization || "Specialization pending"}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Email" value={state.profile.email || state.auth.email} />
              <InfoRow label="Phone" value={state.profile.phone} />
              <InfoRow label="Registration number" value={state.professional.registrationNumber} />
              <InfoRow label="Medical council" value={state.professional.council} />
              <InfoRow label="Years of experience" value={state.professional.experience || "-"} />
              <InfoRow label="Address" value={[state.profile.addressLine1, state.profile.addressLine2, state.profile.city, state.profile.state, state.profile.postalCode].filter(Boolean).join(", ")} />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Application overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Application</span>
                <Badge variant={state.status === "pending" ? "warning" : "success"}>{state.status === "pending" ? "Under review" : "Submitted"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Documents</span>
                <Badge variant="success">Uploaded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last updated</span>
                <span className="text-sm font-medium">{formatDate(new Date())}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Read-only schedule from your submission.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(state.availability.weeklyAvailability).map(([day, value]) => (
              <div key={day} className="rounded-[var(--radius)] border border-card-border bg-secondary/50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">{day}</span>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
            ))}
            <div className="md:col-span-2 space-y-2">
              <p className="text-sm font-medium">Languages</p>
              <div className="flex flex-wrap gap-2">
                {state.availability.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <p className="text-sm font-medium">Bio</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {state.availability.bio || "You have not added a bio yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

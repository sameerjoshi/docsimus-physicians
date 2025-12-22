"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, MapPin, Phone, User, ArrowRight } from "lucide-react";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { StatusBadge } from "@/src/components/admin/StatusBadge";
import { ComponentReviewCard } from "@/src/components/admin/ComponentReviewCard";
import { Button, Card, CardContent } from "@/src/components/ui";
import { AdminApplication, ApplicationComponent } from "@/src/types/admin";
import { formatDate } from "@/src/lib/utils";

const mockApplications: AdminApplication[] = [
  {
    id: "APP-2045",
    doctorName: "Dr. Amelia Chen",
    email: "amelia.chen@docsimus.com",
    status: "Submitted",
    submittedAt: "2025-01-05",
  },
  {
    id: "APP-2046",
    doctorName: "Dr. Javier Morales",
    email: "j.morales@docsimus.com",
    status: "Under Review",
    submittedAt: "2025-01-06",
  },
];

const initialComponents: ApplicationComponent[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    status: "Pending",
    checklist: [
      "Valid first and last name provided",
      "Date of birth is present and formatted",
      "Email matches contact information",
    ],
    comments: [
      {
        id: "c1",
        author: "Admin Sarah",
        text: "Name matches the uploaded ID.",
        timestamp: "2025-01-06",
      },
    ],
  },
  {
    id: "medical-registration",
    title: "Medical Registration Number",
    status: "Pending",
    checklist: [
      "Registration number is present",
      "Issuing authority is provided",
      "Document matches provided number",
    ],
    comments: [],
  },
  {
    id: "video-verification",
    title: "Video Verification",
    status: "Pending",
    checklist: [
      "Self-introduction video uploaded",
      "Audio and video quality acceptable",
      "Identity matches submitted documents",
    ],
    comments: [
      {
        id: "c2",
        author: "Admin Lee",
        text: "Video present but needs secondary review.",
        timestamp: "2025-01-06",
      },
    ],
  },
];

const documents = [
  { name: "Government ID", status: "Uploaded" as const },
  { name: "Medical License", status: "Uploaded" as const },
  { name: "Proof of Address", status: "Uploaded" as const },
  { name: "Selfie with ID", status: "Not Uploaded" as const },
];

export default function ApplicationDetailPage({ params }: { params: { applicationId: string } }) {
  const application = useMemo(() => {
    return (
      mockApplications.find((item) => item.id === params.applicationId) || {
        id: params.applicationId,
        doctorName: "Unknown Physician",
        email: "pending@docsimus.com",
        status: "Submitted" as const,
        submittedAt: "2025-01-05",
      }
    );
  }, [params.applicationId]);

  const [applicationStatus, setApplicationStatus] = useState(application.status);
  const [components, setComponents] = useState<ApplicationComponent[]>(initialComponents);

  const handleComponentDecision = (componentId: string, status: "Verified" | "Rejected", comment: string) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === componentId
          ? {
              ...component,
              status,
              comments: [
                ...component.comments,
                {
                  id: `${componentId}-${component.comments.length + 1}`,
                  author: "You",
                  text: comment,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : component
      )
    );
  };

  const handleApplicationStatus = (status: AdminApplication["status"]) => {
    setApplicationStatus(status);
  };

  return (
    <div className="space-y-8 pb-24">
      <ApplicationHeader
        title={`Application ${application.id}`}
        description="Review submission details, verify components, and leave audit-ready comments."
        backHref="/admin/applications"
        actions={<StatusBadge status={applicationStatus} />}
      />

      <SectionCard
        title="Application Summary"
        description="High-level details provided by the physician."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-foreground">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">{application.doctorName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>{application.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>+1 (555) 213-8890</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span>Submitted {formatDate(application.submittedAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="h-4 w-4 text-primary" />
              <span>Overall status:</span>
              <StatusBadge status={applicationStatus} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Documents"
        description="Uploaded assets for verification."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((doc) => (
            <Card key={doc.name} className="shadow-sm">
              <CardContent className="flex items-center justify-between gap-3 pt-6">
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">Status: {doc.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.status} />
                  <Button variant="outline" size="sm">Preview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Component Verification"
        description="Verify each component before finalizing the application. Comments are required for audit trail."
      >
        <div className="space-y-6">
          {components.map((component) => (
            <ComponentReviewCard
              key={component.id}
              component={component}
              onDecision={handleComponentDecision}
            />
          ))}
        </div>
      </SectionCard>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Application Actions</p>
            <p className="text-xs text-muted-foreground">Update high-level status without triggering backend calls.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="warning" onClick={() => handleApplicationStatus("Under Review")}>
              Mark Under Review
            </Button>
            <Button variant="success" onClick={() => handleApplicationStatus("Verified")}>
              Verify Application
            </Button>
            <Button variant="destructive" onClick={() => handleApplicationStatus("Rejected")}>
              Reject Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

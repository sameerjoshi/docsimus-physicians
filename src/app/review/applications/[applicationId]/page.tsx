"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import { FileText, MapPin, Phone, User, ArrowRight } from "lucide-react";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { StatusBadge } from "@/src/components/admin/StatusBadge";
import { ComponentReviewCard } from "@/src/components/admin/ComponentReviewCard";
import { Button, Card, CardContent } from "@/src/components/ui";
import { AdminApplication, ApplicationComponent, ComponentStatus } from "@/src/types/admin";
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

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

export default function ApplicationDetailPage({ params }: PageProps) {
  // Unwrap the Promise using React.use() - required in Next.js 15+
  const { applicationId } = use(params);

  const application = useMemo(() => {
    return (
      mockApplications.find((item) => item.id === applicationId) || {
        id: applicationId,
        doctorName: "Unknown Physician",
        email: "pending@docsimus.com",
        status: "Submitted" as const,
        submittedAt: "2025-01-05",
      }
    );
  }, [applicationId]);

  const [applicationStatus, setApplicationStatus] = useState(application.status);
  const [components, setComponents] = useState<ApplicationComponent[]>(initialComponents);

  const handleComponentDecision = (componentId: string, status: ComponentStatus, comment: string) => {
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
    <div className="space-y-6 pb-32">
      {/* Back Button - Mobile */}
      <div className="md:hidden">
        <Link href="/review/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Applications
        </Link>
      </div>

      <ApplicationHeader
        title={`Application ${application.id}`}
        description="Review submission details, verify components, and leave audit-ready comments."
        actions={<StatusBadge status={applicationStatus} />}
      />

      {/* Application Summary Card */}
      <SectionCard
        title="Application Summary"
        description="High-level details provided by the physician."
      >
        <div className="space-y-4">
          {/* Doctor Info Card */}
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{application.doctorName}</p>
              <p className="text-sm text-muted-foreground truncate">{application.email}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">+1 (555) 213-8890</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">Submitted {formatDate(application.submittedAt)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">Status:</span>
              <StatusBadge status={applicationStatus} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Documents Section */}
      <SectionCard
        title="Documents"
        description="Uploaded assets for verification."
      >
        <div className="grid gap-3">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{doc.name}</p>
                  <StatusBadge status={doc.status} />
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex-shrink-0 ml-2">
                View
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Component Verification */}
      <SectionCard
        title="Component Verification"
        description="Verify each component before finalizing the application."
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

      {/* Fixed Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Application Actions</p>
              <p className="text-xs text-muted-foreground">Update the verification status</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
              <Button
                variant="success"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={() => handleApplicationStatus("Verified")}
              >
                ✓ Verify
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 md:flex-none"
                onClick={() => handleApplicationStatus("Rejected")}
              >
                ✗ Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

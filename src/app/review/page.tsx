'use client';

import Link from "next/link";
import { ArrowUpRight, ClipboardList, ShieldCheck, Clock, FileSearch } from "lucide-react";
import { Button, Card, CardContent } from "@/src/components/ui";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";

const highlights = [
  {
    label: "Assigned to Me",
    value: "5",
    icon: ClipboardList,
    tone: "bg-primary/10 text-primary",
  },
  {
    label: "In Progress",
    value: "3",
    icon: Clock,
    tone: "bg-blue-100 text-blue-700",
  },
  {
    label: "Completed This Week",
    value: "12",
    icon: ShieldCheck,
    tone: "bg-green-100 text-green-700",
  },
];

// Mock assigned applications for this reviewer
const myApplications = [
  {
    id: "APP-2046",
    doctorName: "Dr. Javier Morales",
    status: "Under Review",
    submittedAt: "2025-01-06",
    priority: "High",
  },
  {
    id: "APP-2050",
    doctorName: "Dr. Sarah Johnson",
    status: "Under Review",
    submittedAt: "2025-01-07",
    priority: "Normal",
  },
  {
    id: "APP-2051",
    doctorName: "Dr. Ravi Patel",
    status: "Under Review",
    submittedAt: "2025-01-07",
    priority: "Normal",
  },
];

export default function ReviewPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ApplicationHeader
        title="Reviewer Dashboard"
        description="Review and verify doctor applications assigned to you."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 p-4 sm:pt-6">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-foreground">{item.value}</p>
              </div>
              <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${item.tone} flex-shrink-0`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Assigned Applications */}
      <SectionCard
        title="My Assigned Applications"
        description="Applications waiting for your review."
        actions={(
          <Link href="/review/applications">
            <Button size="sm" className="gap-2">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      >
        <div className="space-y-3">
          {myApplications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/40 transition gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{app.doctorName}</p>
                  {app.priority === "High" && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded">High Priority</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {app.id} • Submitted {new Date(app.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">{app.status}</span>
                <Link href={`/review/applications/${app.id}`}>
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileSearch className="h-4 w-4" />
                    <span className="hidden sm:inline">Review</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Tips Card */}
      {/* <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Verify all credentials and certifications thoroughly</li>
          <li>• Check document authenticity against official records</li>
          <li>• Leave detailed comments for rejected applications</li>
          <li>• Contact admin if you need to reassign an application</li>
        </ul>
      </Card> */}
    </div>
  );
}

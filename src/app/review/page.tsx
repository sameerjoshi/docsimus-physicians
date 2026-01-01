'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, ShieldCheck, Clock, FileSearch } from "lucide-react";
import { Button, Card, CardContent } from "@/src/components/ui";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { reviewerService, type ReviewerApplication } from "@/src/services/reviewer.service";
import { LoadingSpinner } from "@/src/components/loading-spinner";
import { Role, RouteGuard } from "@/src/components/RouteGuard";

export default function ReviewPage() {
  const [applications, setApplications] = useState<ReviewerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await reviewerService.getAssignedApplications();
      setApplications(data);
    } catch (err: any) {
      console.error('Failed to load applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RouteGuard role={Role.REVIEWER}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard role={Role.REVIEWER}>
        <div className="p-8">
          <Card className="p-6 bg-destructive/10 border-destructive/30">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadApplications} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </RouteGuard>
    );
  }

  const highlights = [
    {
      label: "Assigned to Me",
      value: applications.length.toString(),
      icon: ClipboardList,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "In Progress",
      value: applications.length.toString(),
      icon: Clock,
      tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Completed This Week",
      value: "0",
      icon: ShieldCheck,
      tone: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
  ];

  // Show first 3 applications
  const recentApplications = applications.slice(0, 3);

  return (
    <RouteGuard role={Role.REVIEWER}>
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
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/40 transition gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">Dr. {app.firstName} {app.lastName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {app.id} • Submitted {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded">Under Review</span>
                    <Link href={`/review/applications/${app.id}`}>
                      <Button size="sm" variant="outline" className="gap-1">
                        <FileSearch className="h-4 w-4" />
                        <span className="hidden sm:inline">Review</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">No applications assigned to you yet.</p>
            )}
          </div>
        </SectionCard>
      </div>
    </RouteGuard>
  );
}

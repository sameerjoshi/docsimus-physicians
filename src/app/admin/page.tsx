'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowUpRight, ClipboardList, ShieldCheck, Users, UserCheck } from "lucide-react";
import { Button, Card, CardContent } from "@/src/components/ui";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { adminService, type AdminDoctorApplication, type Reviewer } from "@/src/services/admin.service";
import { LoadingSpinner } from "@/src/components/loading-spinner";
import { Role, RouteGuard } from '@/src/components/RouteGuard';

export default function AdminPage() {
  const [pendingApplications, setPendingApplications] = useState<AdminDoctorApplication[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [allApplications, setAllApplications] = useState<AdminDoctorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [pending, allApps, reviewerList] = await Promise.all([
        adminService.getPendingApplications(),
        adminService.getAllApplications(),
        adminService.getReviewers(),
      ]);

      setPendingApplications(pending);
      setAllApplications(allApps);
      setReviewers(reviewerList);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RouteGuard role={Role.ADMIN}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard role={Role.ADMIN}>
        <div className="p-8">
          <Card className="p-6 bg-destructive/10 border-destructive/30">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadDashboardData} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </RouteGuard>
    );
  }

  const unassignedCount = pendingApplications.filter(app => !app.reviewerId).length;
  const underReviewCount = allApplications.filter(app => app.status === 'PENDING' && app.reviewerId).length;
  const verifiedThisWeek = allApplications.filter(app => {
    if (!app.verifiedAt) return false;
    const verifiedDate = new Date(app.verifiedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return verifiedDate >= weekAgo;
  }).length;

  const highlights = [
    {
      label: "Pending Assignment",
      value: unassignedCount.toString(),
      icon: ClipboardList,
      tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Under Review",
      value: underReviewCount.toString(),
      icon: UserCheck,
      tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Verified This Week",
      value: verifiedThisWeek.toString(),
      icon: ShieldCheck,
      tone: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      label: "Active Reviewers",
      value: reviewers.length.toString(),
      icon: Users,
      tone: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  // Get recent pending applications (limit to 2)
  const recentPending = pendingApplications.filter(app => !app.reviewerId).slice(0, 2);

  // Get active reviewers (those with assignments)
  const activeReviewers = reviewers
    .filter(r => (r._count?.reviewingApplications || 0) > 0)
    .slice(0, 2);

  return (
    <RouteGuard role={Role.ADMIN}>
      <div className="space-y-6 sm:space-y-8">
        <ApplicationHeader
          title="Admin Dashboard"
          description="Manage doctor applications and assign them to reviewers for verification."
        />

        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <Card key={item.label} className="shadow-sm">
              <CardContent className="flex items-center justify-between gap-4 p-4 sm:pt-6">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.label}</p>
                  <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold text-foreground">{item.value}</p>
                </div>
                <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${item.tone} flex-shrink-0`}>
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="Pending Applications"
            description="Applications waiting to be assigned to a reviewer."
            actions={(
              <Link href="/admin/applications">
                <Button size="sm" className="gap-2">
                  Assign Applications
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          >
            <div className="space-y-3">
              {recentPending.length > 0 ? (
                recentPending.map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div>
                      <p className="font-medium text-sm">Dr. {app.firstName} {app.lastName}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-amber-600 text-white rounded">Pending</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending applications</p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Reviewer Activity"
            description="Track reviewer workload and performance."
            actions={(
              <Link href="/admin/reviewers">
                <Button variant="outline" size="sm" className="gap-2">
                  Manage Reviewers
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          >
            <div className="space-y-3">
              {activeReviewers.length > 0 ? (
                activeReviewers.map(reviewer => {
                  const initials = reviewer.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';
                  return (
                    <div key={reviewer.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{initials}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{reviewer.name || reviewer.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {reviewer._count?.reviewingApplications || 0} active reviews
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded">Active</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No active reviewers</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </RouteGuard>
  );
}

'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { Card, Button } from "@/src/components/ui";
import { FileSearch, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { reviewerService, type ReviewerApplication } from "@/src/services/reviewer.service";
import { LoadingSpinner } from "@/src/components/loading-spinner";

export default function ReviewerApplicationsPage() {
  const [applications, setApplications] = useState<ReviewerApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
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
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error}</p>
          <Button onClick={loadApplications} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const filteredApplications = applications.filter(app => {
    const doctorName = `Dr. ${app.firstName} ${app.lastName}`;
    const matchesSearch =
      doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || filterStatus === "Under Review";

    return matchesSearch && matchesFilter;
  });

  const pendingCount = applications.length; // All assigned apps are pending

  return (
    <div className="space-y-6">
      <ApplicationHeader
        title="My Applications"
        description={`Applications assigned to you for review (${applications.length} total, ${pendingCount} pending)`}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("all")}
        >
          All ({applications.length})
        </Button>
        <Button
          variant={filterStatus === "Under Review" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterStatus("Under Review")}
        >
          Under Review ({pendingCount})
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <input
          type="text"
          placeholder="Search by name, email, or application ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        />
      </Card>

      {/* Applications List - Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Application ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Submitted</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-secondary/40 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-sm">Dr. {app.firstName} {app.lastName}</p>
                        <p className="text-xs text-muted-foreground">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.id}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status="Under Review" />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/review/applications/${app.id}`}>
                        <Button size="sm" className="gap-1">
                          <FileSearch className="h-4 w-4" />
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Applications List - Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold">Dr. {app.firstName} {app.lastName}</p>
                <p className="text-xs text-muted-foreground">{app.email}</p>
              </div>
              <StatusBadge status="Under Review" />
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span>{app.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</span>
              </div>
            </div>
            <Link href={`/review/applications/${app.id}`}>
              <Button className="w-full gap-2">
                <FileSearch className="h-4 w-4" />
                Review Application
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No applications found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof Clock; color: string }> = {
    "Under Review": { icon: Clock, color: "bg-blue-600 text-white" },
    "Verified": { icon: CheckCircle, color: "bg-green-600 text-white" },
    "Rejected": { icon: XCircle, color: "bg-red-600 text-white" },
  };

  const { icon: Icon, color } = config[status] || { icon: Clock, color: "bg-gray-500 text-white" };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${color}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

'use client';

import { useState } from "react";
import Link from "next/link";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { AdminApplication } from "@/src/types/admin";
import { Card, Button } from "@/src/components/ui";
import { FileSearch, CheckCircle, XCircle, Clock, Filter } from "lucide-react";

// Current reviewer ID (would come from auth context in real app)
const CURRENT_REVIEWER_ID = "REV-001";
const CURRENT_REVIEWER_NAME = "Priya Sharma";

// Mock applications assigned to this reviewer
const assignedApplications: AdminApplication[] = [
  {
    id: "APP-2046",
    doctorName: "Dr. Javier Morales",
    email: "j.morales@docsimus.com",
    status: "Under Review",
    submittedAt: "2025-01-06",
    assignedTo: CURRENT_REVIEWER_ID,
    assignedToName: CURRENT_REVIEWER_NAME,
  },
  {
    id: "APP-2050",
    doctorName: "Dr. Sarah Johnson",
    email: "sarah.j@docsimus.com",
    status: "Under Review",
    submittedAt: "2025-01-07",
    assignedTo: CURRENT_REVIEWER_ID,
    assignedToName: CURRENT_REVIEWER_NAME,
  },
  {
    id: "APP-2051",
    doctorName: "Dr. Ravi Patel",
    email: "ravi.p@docsimus.com",
    status: "Under Review",
    submittedAt: "2025-01-07",
    assignedTo: CURRENT_REVIEWER_ID,
    assignedToName: CURRENT_REVIEWER_NAME,
  },
  {
    id: "APP-2040",
    doctorName: "Dr. Emily Watson",
    email: "emily.w@docsimus.com",
    status: "Verified",
    submittedAt: "2025-01-03",
    assignedTo: CURRENT_REVIEWER_ID,
    assignedToName: CURRENT_REVIEWER_NAME,
  },
  {
    id: "APP-2038",
    doctorName: "Dr. Michael Brown",
    email: "m.brown@docsimus.com",
    status: "Rejected",
    submittedAt: "2025-01-02",
    assignedTo: CURRENT_REVIEWER_ID,
    assignedToName: CURRENT_REVIEWER_NAME,
  },
];

export default function ReviewerApplicationsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplications = assignedApplications.filter(app => {
    const matchesSearch =
      app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "all" || app.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const pendingCount = assignedApplications.filter(a => a.status === "Under Review").length;

  return (
    <div className="space-y-6">
      <ApplicationHeader
        title="My Applications"
        description={`Applications assigned to you for review (${assignedApplications.length} total, ${pendingCount} pending)`}
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "Under Review", "Verified", "Rejected"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(status)}
            className="capitalize"
          >
            {status === "all" ? "All" : status}
            {status === "Under Review" && ` (${pendingCount})`}
          </Button>
        ))}
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
                        <p className="font-medium text-sm">{app.doctorName}</p>
                        <p className="text-xs text-muted-foreground">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{app.id}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/review/applications/${app.id}`}>
                        <Button size="sm" className="gap-1">
                          <FileSearch className="h-4 w-4" />
                          {app.status === "Under Review" ? "Review" : "View"}
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
                <p className="font-semibold">{app.doctorName}</p>
                <p className="text-xs text-muted-foreground">{app.email}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span>{app.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span>{new Date(app.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <Link href={`/review/applications/${app.id}`}>
              <Button className="w-full gap-2">
                <FileSearch className="h-4 w-4" />
                {app.status === "Under Review" ? "Review Application" : "View Details"}
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

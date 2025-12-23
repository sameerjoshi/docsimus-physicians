'use client';

import { useState } from "react";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { AdminApplication, Reviewer } from "@/src/types/admin";
import { Card, Button, Badge } from "@/src/components/ui";
import { UserPlus, Check, Search, Filter } from "lucide-react";

// Mock reviewers
const mockReviewers: Reviewer[] = [
    { id: "REV-001", name: "Priya Sharma", email: "priya.sharma@docsimus.com" },
    { id: "REV-002", name: "Amit Kumar", email: "amit.kumar@docsimus.com" },
    { id: "REV-003", name: "Sunita Patel", email: "sunita.patel@docsimus.com" },
    { id: "REV-004", name: "Rahul Verma", email: "rahul.verma@docsimus.com" },
];

// Mock applications
const initialApplications: AdminApplication[] = [
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
        assignedTo: "REV-001",
        assignedToName: "Priya Sharma",
    },
    {
        id: "APP-2047",
        doctorName: "Dr. Priya Nair",
        email: "priya.nair@docsimus.com",
        status: "Verified",
        submittedAt: "2025-01-04",
        assignedTo: "REV-002",
        assignedToName: "Amit Kumar",
    },
    {
        id: "APP-2048",
        doctorName: "Dr. Ethan Walker",
        email: "e.walker@docsimus.com",
        status: "Submitted",
        submittedAt: "2025-01-03",
    },
    {
        id: "APP-2049",
        doctorName: "Dr. Rajesh Kumar",
        email: "rajesh.k@docsimus.com",
        status: "Submitted",
        submittedAt: "2025-01-07",
    },
];

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<AdminApplication[]>(initialApplications);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const handleAssignReviewer = (appId: string, reviewerId: string) => {
        const reviewer = mockReviewers.find(r => r.id === reviewerId);
        if (!reviewer) return;

        setApplications(prev =>
            prev.map(app =>
                app.id === appId
                    ? {
                        ...app,
                        assignedTo: reviewerId,
                        assignedToName: reviewer.name,
                        status: "Under Review",
                        assignedAt: new Date().toISOString(),
                    }
                    : app
            )
        );
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch =
            app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = filterStatus === "all" ||
            (filterStatus === "unassigned" && !app.assignedTo) ||
            (filterStatus === "assigned" && app.assignedTo) ||
            app.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const unassignedCount = applications.filter(a => !a.assignedTo && a.status === "Submitted").length;

    return (
        <div className="space-y-6">
            <ApplicationHeader
                title="Applications Management"
                description="Assign doctor applications to reviewers for verification."
            />

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold">{applications.length}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground">Pending Assignment</p>
                    <p className="text-2xl font-bold text-amber-600">{unassignedCount}</p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground">Under Review</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {applications.filter(a => a.status === "Under Review").length}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground">Verified</p>
                    <p className="text-2xl font-bold text-green-600">
                        {applications.filter(a => a.status === "Verified").length}
                    </p>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        >
                            <option value="all">All Status</option>
                            <option value="unassigned">Unassigned</option>
                            <option value="assigned">Assigned</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Verified">Verified</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Applications List - Desktop Table */}
            <div className="hidden lg:block">
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/60">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Application ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Submitted</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Assigned To</th>
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
                                        <td className="px-6 py-4">
                                            {app.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-xs font-medium text-primary">
                                                            {app.assignedToName?.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm">{app.assignedToName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!app.assignedTo && app.status === "Submitted" ? (
                                                <select
                                                    onChange={(e) => handleAssignReviewer(app.id, e.target.value)}
                                                    className="px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Assign Reviewer</option>
                                                    {mockReviewers.map(r => (
                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                                    <Check className="h-3 w-3" />
                                                    Assigned
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Applications List - Mobile Cards */}
            <div className="lg:hidden space-y-4">
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
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Assigned:</span>
                                <span>{app.assignedToName || "Not assigned"}</span>
                            </div>
                        </div>
                        {!app.assignedTo && app.status === "Submitted" ? (
                            <select
                                onChange={(e) => handleAssignReviewer(app.id, e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                defaultValue=""
                            >
                                <option value="" disabled>Select Reviewer</option>
                                {mockReviewers.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 rounded text-sm">
                                <Check className="h-4 w-4" />
                                Assigned to {app.assignedToName}
                            </div>
                        )}
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
    const styles: Record<string, string> = {
        "Submitted": "bg-amber-600 text-white",
        "Under Review": "bg-blue-600 text-white",
        "Verified": "bg-green-600 text-white",
        "Rejected": "bg-red-600 text-white",
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status] || "bg-gray-500 text-white"}`}>
            {status}
        </span>
    );
}

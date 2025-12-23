'use client';

import { useState } from "react";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { Card, Button } from "@/src/components/ui";
import { UserPlus, Mail, FileText, MoreVertical, CheckCircle, Clock } from "lucide-react";

interface ReviewerData {
    id: string;
    name: string;
    email: string;
    initials: string;
    activeReviews: number;
    totalReviews: number;
    status: 'Active' | 'Inactive';
    lastActive: string;
}

const reviewers: ReviewerData[] = [
    {
        id: "REV-001",
        name: "Priya Sharma",
        email: "priya.sharma@docsimus.com",
        initials: "PS",
        activeReviews: 3,
        totalReviews: 45,
        status: 'Active',
        lastActive: '2 hours ago'
    },
    {
        id: "REV-002",
        name: "Amit Kumar",
        email: "amit.kumar@docsimus.com",
        initials: "AK",
        activeReviews: 2,
        totalReviews: 38,
        status: 'Active',
        lastActive: '30 minutes ago'
    },
    {
        id: "REV-003",
        name: "Sunita Patel",
        email: "sunita.patel@docsimus.com",
        initials: "SP",
        activeReviews: 4,
        totalReviews: 52,
        status: 'Active',
        lastActive: '1 hour ago'
    },
    {
        id: "REV-004",
        name: "Rahul Verma",
        email: "rahul.verma@docsimus.com",
        initials: "RV",
        activeReviews: 0,
        totalReviews: 28,
        status: 'Inactive',
        lastActive: '3 days ago'
    },
];

export default function ReviewersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <ApplicationHeader
                title="Reviewers Management"
                description="Manage review team members and track their workload."
            />

            {/* Stats Summary - More compact on mobile */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                <Card className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-primary">{reviewers.length}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{reviewers.filter(r => r.status === 'Active').length}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Active</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{reviewers.reduce((sum, r) => sum + r.activeReviews, 0)}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Reviews</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold">{reviewers.reduce((sum, r) => sum + r.totalReviews, 0)}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Done</p>
                </Card>
            </div>

            {/* Reviewers List Header with Add Button */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">All Reviewers</h3>
                <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Reviewer</span>
                    <span className="sm:hidden">Add</span>
                </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Card className="overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-secondary/60">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Reviewer</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Active</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Completed</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Last Active</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reviewers.map((reviewer) => (
                                <tr key={reviewer.id} className="hover:bg-secondary/40 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-medium text-primary">{reviewer.initials}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{reviewer.name}</p>
                                                <p className="text-xs text-muted-foreground">{reviewer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${reviewer.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {reviewer.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {reviewer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-lg font-semibold text-primary">{reviewer.activeReviews}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-medium">{reviewer.totalReviews}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                                        {reviewer.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {reviewers.map((reviewer) => (
                    <Card key={reviewer.id} className="p-4">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg font-semibold text-primary">{reviewer.initials}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">{reviewer.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{reviewer.email}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${reviewer.status === 'Active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {reviewer.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                {reviewer.status}
                            </span>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                                <p className="text-lg font-bold text-primary">{reviewer.activeReviews}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Active</p>
                            </div>
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                                <p className="text-lg font-bold">{reviewer.totalReviews}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Completed</p>
                            </div>
                            <div className="p-2 bg-secondary/50 rounded-lg text-center">
                                <p className="text-xs font-medium text-muted-foreground">{reviewer.lastActive}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">Last Active</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                                <Mail className="h-4 w-4" />
                                Email
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                                <FileText className="h-4 w-4" />
                                Work
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

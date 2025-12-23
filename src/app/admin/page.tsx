'use client';

import Link from "next/link";
import { ArrowUpRight, ClipboardList, ShieldCheck, Users, UserCheck } from "lucide-react";
import { Button, Card, CardContent } from "@/src/components/ui";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";

const highlights = [
    {
        label: "Pending Assignment",
        value: "12",
        icon: ClipboardList,
        tone: "bg-amber-100 text-amber-700",
    },
    {
        label: "Under Review",
        value: "8",
        icon: UserCheck,
        tone: "bg-blue-100 text-blue-700",
    },
    {
        label: "Verified This Week",
        value: "42",
        icon: ShieldCheck,
        tone: "bg-green-100 text-green-700",
    },
    {
        label: "Active Reviewers",
        value: "5",
        icon: Users,
        tone: "bg-purple-100 text-purple-700",
    },
];

export default function AdminPage() {
    return (
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
                        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div>
                                <p className="font-medium text-sm">Dr. Amelia Chen</p>
                                <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-amber-600 text-white rounded">Pending</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div>
                                <p className="font-medium text-sm">Dr. Rajesh Kumar</p>
                                <p className="text-xs text-muted-foreground">Submitted 5 hours ago</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-amber-600 text-white rounded">Pending</span>
                        </div>
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
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">PS</span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Priya Sharma</p>
                                    <p className="text-xs text-muted-foreground">3 active reviews</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">AK</span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Amit Kumar</p>
                                    <p className="text-xs text-muted-foreground">2 active reviews</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded">Active</span>
                        </div>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}

import Link from "next/link";
import { ArrowUpRight, ClipboardList, ShieldCheck, Users } from "lucide-react";
import { Button, Card, CardContent } from "@/src/components/ui";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";

const highlights = [
  {
    label: "Pending Applications",
    value: "18",
    icon: ClipboardList,
    tone: "bg-primary/10 text-primary",
  },
  {
    label: "Verified This Week",
    value: "42",
    icon: ShieldCheck,
    tone: "bg-success-light text-success",
  },
  {
    label: "Physicians Onboarded",
    value: "6.2k",
    icon: Users,
    tone: "bg-info-light text-info",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <ApplicationHeader
        title="Admin Dashboard"
        description="Monitor physician onboarding and quickly jump into application reviews."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.label} className="shadow-sm">
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{item.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.tone}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SectionCard
        title="Applications Review"
        description="Review physician submissions and manage verification workflows."
        actions={(
          <Link href="/admin/applications">
            <Button variant="gradient" size="sm" className="gap-2">
              View Applications
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">Stay on top of new submissions</p>
            <p className="text-sm text-muted-foreground">View statuses, add comments, and verify components in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius)] bg-primary/10 px-4 py-2 text-sm font-medium text-primary">New: 6</div>
            <div className="rounded-[var(--radius)] bg-warning-light px-4 py-2 text-sm font-medium text-warning">Under Review: 9</div>
            <div className="rounded-[var(--radius)] bg-success-light px-4 py-2 text-sm font-medium text-success">Verified: 24</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

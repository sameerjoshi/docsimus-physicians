import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, Card } from "@/src/components/ui";
import { StatusBadge } from "./StatusBadge";
import { AdminApplication } from "@/src/types/admin";
import { formatDate } from "@/src/lib/utils";

interface ApplicationTableProps {
  applications: AdminApplication[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] divide-y divide-border">
          <thead className="bg-secondary/60">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Doctor Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Application ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Submitted</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-secondary/40 transition">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{app.doctorName}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{app.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{app.id}</td>
                <td className="px-6 py-4 text-sm"><StatusBadge status={app.status} /></td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(app.submittedAt)}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <Link href={`/admin/applications/${app.id}`}>
                    <Button variant="gradient" size="sm" className="gap-1">
                      Review
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

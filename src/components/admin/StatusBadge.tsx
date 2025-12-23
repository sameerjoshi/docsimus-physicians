import { Badge, badgeVariants } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";
import { ApplicationStatus, ComponentStatus } from "@/src/types/admin";

type Status = ApplicationStatus | ComponentStatus | "Uploaded" | "Not Uploaded";

const statusVariantMap: Record<Status, NonNullable<Parameters<typeof badgeVariants>[0]>["variant"]> = {
  Submitted: "info",
  "Under Review": "warning",
  Verified: "success",
  Rejected: "danger",
  Pending: "warning",
  Uploaded: "success",
  "Not Uploaded": "secondary",
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] || "secondary";

  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {status}
    </Badge>
  );
}

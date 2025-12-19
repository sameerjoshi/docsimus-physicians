import { Badge } from "@/src/components/ui";

interface StatusBadgeProps {
  status: "pending" | "uploaded" | "approved" | "submitted";
}

const variantMap: Record<StatusBadgeProps["status"], "warning" | "success" | "info"> = {
  pending: "warning",
  uploaded: "success",
  approved: "success",
  submitted: "info",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status === "uploaded" ? "Uploaded" : status === "approved" ? "Approved" : status === "submitted" ? "Submitted" : "Pending";
  return <Badge variant={variantMap[status]}>{label}</Badge>;
}

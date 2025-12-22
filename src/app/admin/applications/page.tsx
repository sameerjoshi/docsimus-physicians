import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { ApplicationTable } from "@/src/components/admin/ApplicationTable";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { AdminApplication } from "@/src/types/admin";

const mockApplications: AdminApplication[] = [
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
  },
  {
    id: "APP-2047",
    doctorName: "Dr. Priya Nair",
    email: "priya.nair@docsimus.com",
    status: "Verified",
    submittedAt: "2025-01-04",
  },
  {
    id: "APP-2048",
    doctorName: "Dr. Ethan Walker",
    email: "e.walker@docsimus.com",
    status: "Rejected",
    submittedAt: "2025-01-03",
  },
];

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <ApplicationHeader
        title="Applications"
        description="Track physician submissions and jump into detailed component verification."
      />

      <SectionCard title="Applications Review" description="Use the table below to open any application.">
        <ApplicationTable applications={mockApplications} />
      </SectionCard>
    </div>
  );
}

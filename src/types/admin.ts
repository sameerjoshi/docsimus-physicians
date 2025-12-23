export type ApplicationStatus = "Submitted" | "Under Review" | "Verified" | "Rejected";

export type ComponentStatus = "Pending" | "Verified" | "Rejected";

export interface Reviewer {
  id: string;
  name: string;
  email: string;
}

export interface AdminApplication {
  id: string;
  doctorName: string;
  email: string;
  status: ApplicationStatus;
  submittedAt: string;
  assignedTo?: string; // Reviewer ID
  assignedToName?: string; // Reviewer name for display
  assignedAt?: string;
}

export interface ComponentComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ApplicationComponent {
  id: string;
  title: string;
  status: ComponentStatus;
  checklist: string[];
  comments: ComponentComment[];
}

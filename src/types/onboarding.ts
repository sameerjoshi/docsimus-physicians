export type ApplicationStatus = "draft" | "pending" | "submitted";

export type DocumentType =
  | "medicalDegree"
  | "registrationCertificate"
  | "governmentId"
  | "profilePhoto"
  | "introVideo";

export interface DocumentUpload {
  fileName?: string;
  previewUrl?: string;
  status: "pending" | "uploaded";
}

export interface DoctorProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  gender?: string;
  photo?: string;
}

export interface DoctorAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface DoctorProfessional {
  registrationNumber: string;
  licenseNumber?: string;
  council: string;
  specialization: string;
  experience: string;
}

export interface DoctorAvailability {
  availableNow: boolean;
  weeklyAvailability: Record<string, string>;
  fee: string;
  languages: string[];
  bio: string;
}

export interface DoctorOnboardingState {
  auth: { email: string };
  profile: DoctorProfile;
  address: DoctorAddress;
  professional: DoctorProfessional;
  documents: Record<DocumentType, DocumentUpload>;
  availability: DoctorAvailability;
  status: ApplicationStatus;
}

export const ONBOARDING_STEPS = [
  { title: "Personal Profile", description: "Basic information" },
  { title: "Professional Details", description: "Credentials" },
  { title: "Documents", description: "Verification files" },
  { title: "Availability", description: "Schedule & bio" },
];

export const DOCUMENT_REQUIREMENTS: { key: DocumentType; label: string; hint: string }[] = [
  { key: "medicalDegree", label: "Medical Degree", hint: "Upload your degree certificate" },
  { key: "registrationCertificate", label: "Registration Certificate", hint: "State medical council registration" },
  { key: "governmentId", label: "Government ID", hint: "Aadhar, Passport, or PAN" },
  { key: "profilePhoto", label: "Profile Photo", hint: "Professional headshot" },
  { key: "introVideo", label: "Short Intro Video", hint: "Under 1 minute" },
];

const defaultWeeklyAvailability: Record<string, string> = {
  Monday: "09:00 - 17:00",
  Tuesday: "09:00 - 17:00",
  Wednesday: "09:00 - 17:00",
  Thursday: "09:00 - 17:00",
  Friday: "09:00 - 17:00",
  Saturday: "10:00 - 14:00",
  Sunday: "Unavailable",
};

export const DEFAULT_ONBOARDING_STATE: DoctorOnboardingState = {
  auth: { email: "" },
  profile: {
    firstName: "",
    lastName: "",
    phone: "+91 ",
    email: "",
    dob: "",
    photo: "",
  },
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  },
  professional: {
    registrationNumber: "",
    council: "",
    specialization: "",
    experience: "",
  },
  documents: {
    medicalDegree: { status: "pending" },
    registrationCertificate: { status: "pending" },
    governmentId: { status: "pending" },
    profilePhoto: { status: "pending" },
    introVideo: { status: "pending" },
  },
  availability: {
    availableNow: true,
    weeklyAvailability: defaultWeeklyAvailability,
    fee: "1200",
    languages: ["English", "Hindi"],
    bio: "",
  },
  status: "draft",
};

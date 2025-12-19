"use client";

import { useRouter } from "next/navigation";
import { DocumentUploadCard } from "../../components/DocumentUploadCard";
import { StepLayout } from "../../components/StepLayout";
import { useDoctorOnboarding } from "../../hooks/useDoctorOnboarding";
import { DOCUMENT_REQUIREMENTS } from "../../types/doctor";

export default function DocumentsStepPage() {
  const router = useRouter();
  const { state, updateDocument } = useDoctorOnboarding();

  return (
    <StepLayout
      title="Verification documents"
      description="Upload your credentials for verification. Only you and our compliance team can view these."
      currentStep={3}
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/doctor-onboarding/onboarding/step-4-availability");
      }}
      onBack={() => router.push("/doctor-onboarding/onboarding/step-2-professional")}
      nextLabel="Save & continue"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCUMENT_REQUIREMENTS.map((doc) => (
          <DocumentUploadCard
            key={doc.key}
            title={doc.label}
            description={doc.hint}
            status={state.documents[doc.key]?.status || "pending"}
            fileName={state.documents[doc.key]?.fileName}
            previewUrl={state.documents[doc.key]?.previewUrl}
            accept={doc.key === "introVideo" ? "video/mp4" : "image/*,application/pdf"}
            onFileSelect={(file) => {
              const previewUrl = URL.createObjectURL(file);
              updateDocument(doc.key, { fileName: file.name, previewUrl });
            }}
          />
        ))}
      </div>
    </StepLayout>
  );
}

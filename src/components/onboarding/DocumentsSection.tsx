"use client";

import { ChangeEvent } from "react";
import { UploadCloud, FileText, Play } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { useOnboardingAPI } from "@/src/hooks/useOnboardingAPI";
import { DOCUMENT_REQUIREMENTS } from "@/src/types/onboarding";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  status: "pending" | "uploaded";
  fileName?: string;
  previewUrl?: string;
  accept?: string;
  onFileSelect: (file: File) => void;
}

function DocumentUploadCard({
  title,
  description,
  status,
  fileName,
  previewUrl,
  accept,
  onFileSelect,
}: DocumentUploadCardProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const isVideo = previewUrl && fileName?.toLowerCase().endsWith("mp4");

  return (
    <Card className="h-full border-dashed border-card-border">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${status === "uploaded" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {status === "uploaded" ? "✓ Uploaded" : "Pending"}
        </span>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <div className="flex items-center gap-3 rounded-[var(--radius)] border border-card-border bg-secondary/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isVideo ? <Play className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {fileName ? fileName : "No file uploaded yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {fileName ? "Ready for review" : "Supported formats: PDF, JPG, PNG, MP4"}
            </p>
          </div>
          <div>
            <input
              type="file"
              accept={accept}
              className="hidden"
              id={`file-input-${title.replace(/\s+/g, '-')}`}
              onChange={handleChange}
            />
            <Button
              variant="outline"
              type="button"
              className="gap-2"
              onClick={() => {
                document.getElementById(`file-input-${title.replace(/\s+/g, '-')}`)?.click();
              }}
            >
              <UploadCloud className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {previewUrl && !isVideo && (
          <div className="overflow-hidden rounded-[var(--radius)] border border-card-border bg-secondary/40 p-3">
            <img
              src={previewUrl}
              alt={`${title} preview`}
              className="h-40 w-full object-cover rounded-[var(--radius-sm)]"
            />
          </div>
        )}
        {previewUrl && isVideo && (
          <div className="overflow-hidden rounded-[var(--radius)] border border-card-border bg-secondary/40 p-3">
            <video controls className="w-full rounded-[var(--radius-sm)]">
              <source src={previewUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DocumentsSection() {
  const router = useRouter();
  const { state, updateDocument } = useOnboardingAPI();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch uploaded documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { doctorService } = await import("@/src/services/doctor.service");
        const documents = await doctorService.getDocuments();

        // Update state with uploaded documents
        documents.forEach((doc: any) => {
          updateDocument(doc.type as any, {
            fileName: doc.originalName,
            status: "uploaded",
          });
        });
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isHydrated) {
      fetchDocuments();
    }
  }, [isHydrated, updateDocument]);

  if (!isHydrated || loading) {
    return null;
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/onboarding");
    }, 500);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/onboarding")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Documents & Verification</h1>
          <p className="text-muted-foreground mt-1">Upload your credentials for verification</p>
        </div>
      </div>

      {/* Documents Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {DOCUMENT_REQUIREMENTS.map((doc) => (
          <motion.div key={doc.key} variants={staggerItem}>
            <DocumentUploadCard
              title={doc.label}
              description={doc.hint}
              status={state.documents[doc.key]?.status || "pending"}
              fileName={state.documents[doc.key]?.fileName}
              previewUrl={state.documents[doc.key]?.previewUrl}
              accept={doc.key === "introVideo" ? "video/mp4" : "image/*,application/pdf"}
              onFileSelect={async (file) => {
                try {
                  // Show preview immediately
                  const previewUrl = URL.createObjectURL(file);
                  updateDocument(doc.key, { fileName: file.name, previewUrl });

                  // Upload to backend
                  const { doctorService } = await import("@/src/services/doctor.service");
                  await doctorService.uploadDocument(file, doc.key);

                  // Mark as uploaded
                  updateDocument(doc.key, { fileName: file.name, previewUrl, status: "uploaded" });
                } catch (error) {
                  console.error("Upload failed:", error);
                  // Revert to pending on error
                  updateDocument(doc.key, { status: "pending" });
                  alert("Failed to upload document. Please try again.");
                }
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={fadeInUp} className="flex gap-3 pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/onboarding")}
        >
          Discard
        </Button>
      </motion.div>

      {/* Info */}
      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> You can upload documents now and replace them later before submitting your application.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

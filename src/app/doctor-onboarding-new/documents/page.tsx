"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { useDoctorOnboarding } from "../../doctor-onboarding/hooks/useDoctorOnboarding";
import { DocumentUploadCard } from "../../doctor-onboarding/components/DocumentUploadCard";
import { DOCUMENT_REQUIREMENTS } from "../../doctor-onboarding/types/doctor";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const { state, updateDocument } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/doctor-onboarding-new");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/doctor-onboarding-new")}
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
                  onFileSelect={(file) => {
                    const previewUrl = URL.createObjectURL(file);
                    updateDocument(doc.key, { fileName: file.name, previewUrl });
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
              onClick={() => router.push("/doctor-onboarding-new")}
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
      </div>
    </div>
  );
}

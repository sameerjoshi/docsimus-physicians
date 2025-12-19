"use client";

import { ChangeEvent } from "react";
import { UploadCloud, FileText, Play } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui";
import { StatusBadge } from "./StatusBadge";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  status: "pending" | "uploaded";
  fileName?: string;
  previewUrl?: string;
  accept?: string;
  onFileSelect: (file: File) => void;
}

export function DocumentUploadCard({
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
        <StatusBadge status={status} />
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
          <label className="relative inline-flex">
            <input
              type="file"
              accept={accept}
              className="sr-only"
              onChange={handleChange}
            />
            <Button variant="outline" type="button" className="gap-2">
              <UploadCloud className="h-4 w-4" />
              Upload
            </Button>
          </label>
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

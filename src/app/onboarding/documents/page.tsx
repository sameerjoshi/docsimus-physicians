"use client";

import { DocumentsSection } from "@/src/components/onboarding/DocumentsSection";

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <DocumentsSection />
      </div>
    </div>
  );
}

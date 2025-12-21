"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { ReviewSection } from "@/src/components/onboarding/ReviewSection";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function ReviewPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <RouteGuard requireAuth requireVerified>
      <div className="min-h-screen bg-secondary/60 px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold">Review Your Application</h1>
              <p className="text-muted-foreground mt-1">
                Please review all information before submitting
              </p>
            </div>
          </motion.div>

          <ReviewSection />
        </div>
      </div>
    </RouteGuard>
  );
}

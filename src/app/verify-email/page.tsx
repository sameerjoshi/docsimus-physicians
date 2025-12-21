"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { CheckCircle2, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, successCheckmark } from "@/src/lib/animations";
import { useOnboarding } from "@/src/hooks/useOnboarding";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for hydration
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    // If no email after hydration, redirect to signup
    if (!state.auth.email) {
      const timeout = setTimeout(() => {
        router.replace("/signup");
      }, 500);
      return () => clearTimeout(timeout);
    }

    // Simulate email verification
    const verificationTimeout = setTimeout(() => {
      setIsVerified(true);
      setIsVerifying(false);
      // Auto-redirect after 2 seconds to registration
      const redirectTimeout = setTimeout(() => {
        router.push("/registration");
      }, 2000);
      return () => clearTimeout(redirectTimeout);
    }, 1500);

    return () => clearTimeout(verificationTimeout);
  }, [isHydrated, state.auth.email, router]);

  return (
    <div className="min-h-screen bg-secondary/60 flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-lg"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Card className="shadow-xl text-center">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center mb-2">
              {isVerifying ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Loader className="h-10 w-10" />
                  </div>
                </motion.div>
              ) : (
                <motion.div variants={successCheckmark} initial="hidden" animate="visible">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </motion.div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {isVerifying ? "Verifying your email..." : "Email verified successfully"}
            </CardTitle>
            <CardDescription>
              {isVerifying
                ? `Verifying ${state.auth.email}...`
                : state.auth.email
                  ? `We have confirmed ${state.auth.email}. Redirecting to onboarding...`
                  : "Email verified. Redirecting..."}
            </CardDescription>
          </CardHeader>
          {isVerified && !isVerifying && (
            <CardContent className="space-y-4">
              <Button
                size="lg"
                variant="gradient"
                className="w-full justify-center"
                onClick={() => router.push("/registration")}
              >
                Continue to Registration
              </Button>
              <p className="text-sm text-muted-foreground">
                You can complete the registration sections in any order.
              </p>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

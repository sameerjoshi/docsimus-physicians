"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/src/components/ui";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useOnboardingAPI } from "@/src/hooks/useOnboardingAPI";
import { fadeInUp } from "@/src/lib/animations";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, loading, error: apiError, clearError, state } = useOnboardingAPI();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration before allowing form submission
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isHydrated) {
      setError("Page is loading, please try again");
      return;
    }

    setError("");
    clearError();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    const success = await loginUser(email.trim(), password);
    if (success) {
      // User is now logged in, redirect based on onboarding status
      // The useOnboardingAPI hook will have loaded the profile
      // Check if they have pending/submitted application or still in draft
      if (state.status === "pending" || state.status === "submitted") {
        router.push("/dashboard");
      } else {
        // Still in draft, go to onboarding
        router.push("/onboarding");
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary/60 flex items-center justify-center px-4 py-10">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Card className="shadow-xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">Doctor Login</CardTitle>
            <CardDescription>
              Log in to access your onboarding dashboard and application status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@clinic.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {(error || apiError) && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-medium">
                  {error || apiError}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="gradient"
                className="w-full justify-center gap-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Create one now
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

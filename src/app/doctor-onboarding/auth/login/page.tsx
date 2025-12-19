"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/src/components/ui";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useDoctorOnboarding } from "../../hooks/useDoctorOnboarding";
import { fadeInUp } from "@/src/lib/animations";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useDoctorOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call - in production, this would validate against a backend
      const success = await loginUser(email.trim(), password);
      if (success) {
        // Redirect to dashboard instead of registration
        router.push("/doctor/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="gradient"
                className="w-full justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/doctor-onboarding/auth/signup"
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

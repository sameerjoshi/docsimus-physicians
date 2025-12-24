"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/src/components/ui";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { authService } from "@/src/services/auth.service";
import { fadeInUp } from "@/src/lib/animations";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // Login with auth service (works for all roles)
      await authService.login({ email: email.trim(), password });

      // Get user info to determine redirect
      const user = authService.getUser();
      const userRole = user?.role || 'DOCTOR';

      // Redirect based on role
      switch (userRole) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'REVIEWER':
          router.push('/review');
          break;
        case 'DOCTOR':
          // For doctors, try to fetch their profile to check status
          try {
            const { doctorService } = await import('@/src/services/doctor.service');
            const profile = await doctorService.getProfile();

            if (profile.status === 'PENDING') {
              router.push('/application-status');
            } else if (profile.status === 'VERIFIED') {
              router.push('/dashboard');
            } else {
              router.push('/registration');
            }
          } catch (err) {
            // If profile fetch fails, default to registration
            router.push('/registration');
          }
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
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
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Log in to access your dashboard and manage your account.
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

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-medium">
                  {error}
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

"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function RegistrationPage() {
  const { isAuthenticated } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    // Registration is the onboarding flow, redirect there
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding");
    }
  }, [isAuthenticated, router]);

  return (
    <div style={styles.container}>
      <button
        onClick={() => router.push("/")}
        style={styles.backButton}
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <div style={styles.card}>
        <h1 style={styles.title}>Complete Your Registration</h1>
        <p style={styles.description}>
          We're redirecting you to the registration form...
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column" as const,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "16px",
    fontSize: "14px",
    transition: "background 0.3s ease",
    alignSelf: "flex-start" as const,
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "48px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
    maxWidth: "500px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: "0 0 16px 0",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    margin: 0,
  },
};

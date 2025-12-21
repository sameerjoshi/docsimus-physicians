"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { state } = useOnboarding();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const profileData = [
    { label: "First Name", value: state.profile.firstName || "Not provided" },
    { label: "Last Name", value: state.profile.lastName || "Not provided" },
    { label: "Email", value: state.auth.email || "Not provided" },
    { label: "Phone", value: state.profile.phone || "Not provided" },
    { label: "Specialization", value: state.professional.specialization || "Not provided" },
    { label: "Registration Number", value: state.professional.registrationNumber || "Not provided" },
    { label: "Medical Council", value: state.professional.council || "Not provided" },
    { label: "Experience", value: state.professional.experience || "Not provided" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => router.push("/dashboard")}
          style={styles.backButton}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={styles.title}>Doctor Profile</h1>
      </div>

      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {(state.profile.firstName?.[0] || "D") + (state.profile.lastName?.[0] || "P")}
          </div>
          <div>
            <h2 style={styles.name}>
              Dr. {state.profile.firstName} {state.profile.lastName}
            </h2>
            <p style={styles.email}>{state.auth.email}</p>
          </div>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.profileGrid}>
          {profileData.map((item, index) => (
            <div key={index} style={styles.profileItem}>
              <label style={styles.label}>{item.label}</label>
              <p style={styles.value}>{item.value}</p>
            </div>
          ))}
        </div>

        <div style={styles.divider}></div>

        <div style={styles.actions}>
          <button style={styles.editButton} onClick={() => router.push("/registration")}>
            Edit Profile
          </button>
          <button style={styles.logoutButton} onClick={() => {
            localStorage.removeItem("doctor-onboarding-state");
            localStorage.removeItem("doctor-auth");
            router.push("/login");
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
  },
  header: {
    marginBottom: "24px",
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
  },
  title: {
    color: "white",
    fontSize: "32px",
    fontWeight: "bold",
    margin: 0,
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "24px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },
  name: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: 0,
  },
  email: {
    color: "#666",
    fontSize: "14px",
    margin: "8px 0 0 0",
  },
  divider: {
    height: "1px",
    background: "#e0e0e0",
    margin: "24px 0",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  profileItem: {
    display: "flex",
    flexDirection: "column" as const,
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  value: {
    fontSize: "16px",
    color: "#1a1a1a",
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  editButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s ease",
  },
  logoutButton: {
    padding: "12px 24px",
    background: "#e0e0e0",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.2s ease",
  },
};

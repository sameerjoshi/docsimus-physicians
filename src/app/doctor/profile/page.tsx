"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorOnboarding } from "../../doctor-onboarding/hooks/useDoctorOnboarding";
import { Home, Calendar, Users, DollarSign, Settings, Bell, Video, Heart } from "lucide-react";
export default function DoctorProfilePage() {
  const router = useRouter();
  const { state, isAuthenticated } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    router.push("/doctor-onboarding/auth/login");
    return null;
  }

  const getStatusColor = () => {
    if (state.status === "pending" || state.status === "submitted") {
      return "#FFA500";
    }
    return "#999";
  };

  const getStatusLabel = () => {
    if (state.status === "pending" || state.status === "submitted") {
      return "Pending Review";
    }
    return "Incomplete";
  };

  const getInitials = () => {
    const first = state.profile.firstName?.[0] || "D";
    const last = state.profile.lastName?.[0] || "P";
    return (first + last).toUpperCase();
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/doctor/dashboard" },
    { icon: Calendar, label: "Schedule", path: "/doctor/schedule" },
    { icon: Users, label: "Patients", path: "/doctor/patients" },
    { icon: DollarSign, label: "Earnings", path: "/doctor/earnings" },
    { icon: Settings, label: "Settings", path: "/doctor/settings" },
  ];

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Top Navigation */}
      <nav style={styles.topNav}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <div style={styles.logo}>
              <Heart size={24} fill="#E63946" color="#E63946" />
            </div>
            <span style={styles.appName}>Docsium</span>
          </div>
          <div style={styles.navCenter}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  style={{
                    ...styles.navItem,
                    ...(item.path === "/doctor/profile" ? styles.navItemActive : {}),
                  }}
                >
                  <IconComponent style={{ width: "20px", height: "20px" }} />
                </button>
              );
            })}
          </div>
          <div style={styles.navRight}>
            <button
              style={styles.notificationIcon}
              onClick={() => {}}
            >
              🔔
            </button>
            <button
              onClick={() => router.push("/doctor/profile")}
              style={styles.profileButton}
            >
              <div style={styles.profileAvatar}>{getInitials()}</div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.contentContainer}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Doctor Profile</h1>
          </div>

          <div style={styles.profileGrid}>
            {/* Profile Card */}
            <div style={styles.card}>
              <div style={styles.profileHeader}>
                <div style={styles.largeAvatar}>{getInitials()}</div>
                <div style={styles.profileHeaderText}>
                  <h2 style={styles.doctorName}>
                    Dr. {state.profile.firstName} {state.profile.lastName}
                  </h2>
                  <p style={styles.specialization}>
                    {state.professional.specialization || "Specialist"}
                  </p>
                </div>
              </div>

              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Application Status</h3>
                <div
                  style={{
                    ...styles.statusBadge,
                    background: getStatusColor() + "20",
                    borderColor: getStatusColor(),
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: getStatusColor(),
                    }}
                  ></div>
                  <span style={{ color: getStatusColor(), fontWeight: "600" }}>
                    {getStatusLabel()}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Personal Information</h3>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Email</span>
                  <span style={styles.value}>{state.profile.email || state.auth.email}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Phone</span>
                  <span style={styles.value}>{state.profile.phone || "Not provided"}</span>
                </div>
              </div>

              {/* Professional Information */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Professional Information</h3>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Specialization</span>
                  <span style={styles.value}>{state.professional.specialization || "Not provided"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Experience</span>
                  <span style={styles.value}>{state.professional.experience || "Not provided"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Medical Council</span>
                  <span style={styles.value}>{state.professional.council || "Not provided"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Registration Number</span>
                  <span style={styles.value}>{state.professional.registrationNumber || "Not provided"}</span>
                </div>
              </div>

              {/* Availability & Fees */}
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Availability & Fees</h3>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Consultation Fee</span>
                  <span style={styles.value}>${state.availability.fee || "Not set"}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Languages</span>
                  <span style={styles.value}>
                    {state.availability.languages?.join(", ") || "Not provided"}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Available Now</span>
                  <span style={styles.value}>
                    {state.availability.availableNow ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Details Card */}
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Registration Progress</h3>
              <div style={styles.progressItem}>
                <div style={styles.progressItemHeader}>
                  <span>Personal Profile</span>
                  <span style={styles.checkmark}>✓</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: "100%" }}></div>
                </div>
              </div>

              <div style={styles.progressItem}>
                <div style={styles.progressItemHeader}>
                  <span>Professional Credentials</span>
                  <span style={styles.checkmark}>{state.professional.specialization ? "✓" : "○"}</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: state.professional.specialization ? "100%" : "0%",
                    }}
                  ></div>
                </div>
              </div>

              <div style={styles.progressItem}>
                <div style={styles.progressItemHeader}>
                  <span>Documents</span>
                  <span style={styles.checkmark}>
                    {Object.values(state.documents).some((d: any) => d?.status === "uploaded")
                      ? "✓"
                      : "○"}
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: Object.values(state.documents).some((d: any) => d?.status === "uploaded")
                        ? "100%"
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>

              <div style={styles.progressItem}>
                <div style={styles.progressItemHeader}>
                  <span>Availability & Fees</span>
                  <span style={styles.checkmark}>{state.availability.fee ? "✓" : "○"}</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: state.availability.fee ? "100%" : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {state.status === "draft" || state.status === "pending" ? (
                <button
                  onClick={() => router.push("/doctor/registration")}
                  style={styles.editButton}
                >
                  Complete Registration
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: "100vh",
    background: "#F5F5F5",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  topNav: {
    background: "#FFFFFF",
    borderBottom: "1px solid #E0E0E0",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    height: "64px",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "180px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
  },
  appName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A1A1A",
  },
  navCenter: {
    display: "flex",
    gap: "8px",
    flex: 1,
    justifyContent: "center",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#666",
    transition: "all 0.2s",
  },
  navItemActive: {
    background: "#00B368",
    color: "#FFFFFF",
  },
  navItemIcon: {
    fontSize: "18px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  notificationIcon: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    padding: "8px",
  },
  profileButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  profileAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#00B368",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  main: {
    padding: "40px 20px",
  },
  contentContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: 0,
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  },
  profileHeader: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom: "1px solid #E0E0E0",
  },
  largeAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#00B368",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "28px",
  },
  profileHeaderText: {},
  doctorName: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 4px 0",
  },
  specialization: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },
  profileSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 12px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid",
    width: "fit-content",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "12px",
    borderBottom: "1px solid #F0F0F0",
    marginBottom: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#666",
  },
  value: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1A1A1A",
  },
  progressItem: {
    marginBottom: "16px",
  },
  progressItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#1A1A1A",
  },
  checkmark: {
    color: "#00B368",
    fontWeight: "700",
  },
  progressBar: {
    height: "6px",
    background: "#E0E0E0",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#00B368",
    transition: "width 0.3s ease",
  },
  editButton: {
    width: "100%",
    padding: "12px 24px",
    background: "#00B368",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "16px",
  },
};

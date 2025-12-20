"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { Home, Calendar, Users, DollarSign, Settings, Bell, Video, Zap, Clock, CheckCircle, Heart, Phone, MessageCircle } from "lucide-react";

export function DoctorDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, isAuthenticated } = useOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: Users, label: "Patients", path: "/patients" },
    { icon: DollarSign, label: "Earnings", path: "/earnings" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const getInitials = () => {
    const first = state.profile.firstName?.[0] || "D";
    const last = state.profile.lastName?.[0] || "P";
    return (first + last).toUpperCase();
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
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigateTo(item.path)}
                  style={{
                    ...styles.navItem,
                    ...(isActive ? styles.navItemActive : {}),
                  }}
                >
                  <IconComponent style={styles.navItemIconSize} />
                  <span style={styles.navItemLabel}>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div style={styles.navRight}>
            <button style={styles.notificationIcon} onClick={() => {}}>
              <Bell size={20} />
            </button>
            <button
              onClick={() => router.push("/profile")}
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
          {/* Header Section */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>
              Welcome, Dr. {state.profile.firstName && state.profile.lastName ? `${state.profile.firstName} ${state.profile.lastName}` : "Physician"}
            </h1>
          </div>

          {/* Stats Cards Row */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statCardHeader}>
                <p style={styles.statLabel}>Today's Consultations</p>
                <Video size={24} style={{ color: "#999" }} />
              </div>
              <h2 style={styles.statValue}>5 Confirmed</h2>
              <p style={styles.statSubtext}>+2 new patients</p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statCardHeader}>
                <p style={styles.statLabel}>Pending Requests</p>
                <Clock size={24} style={{ color: "#999" }} />
              </div>
              <h2 style={styles.statValue}>2 New</h2>
              <p style={styles.statSubtext}>Review patient profiles</p>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statCardHeader}>
                <p style={styles.statLabel}>Completed Today</p>
                <CheckCircle size={24} style={{ color: "#999" }} />
              </div>
              <h2 style={styles.statValue}>4 Consultations</h2>
              <p style={styles.statSubtext}>Successfully finished</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Quick Actions</h3>
            <div style={styles.quickActionsGrid}>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonPrimary}} onClick={() => navigateTo("/dashboard")}>
                <Video size={20} />
                Start Instant Consultation
              </button>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonSecondary}} onClick={() => navigateTo("/schedule")}>
                <Calendar size={20} />
                View Schedule
              </button>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonSecondary}} onClick={() => navigateTo("/patients")}>
                <Users size={20} />
                View Patients
              </button>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonSecondary}} onClick={() => navigateTo("/earnings")}>
                <DollarSign size={20} />
                Schedule Payment
              </button>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonSecondary}} onClick={() => navigateTo("/settings")}>
                <Settings size={20} />
                Settings
              </button>
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
    position: "sticky" as const,
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
  navItemIconSize: {
    width: "20px",
    height: "20px",
  },
  navItemLabel: {
    display: "block",
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
    display: "flex",
    flexDirection: "column" as const,
  },
  statCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  statLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#999999",
    margin: 0,
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "8px 0 4px 0",
  },
  statSubtext: {
    fontSize: "13px",
    color: "#999999",
    margin: 0,
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 20px 0",
  },
  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    width: "100%",
  },
  quickActionButton: {
    padding: "20px 32px",
    borderRadius: "16px",
    border: "2px solid #00B368",
    background: "transparent",
    color: "#00B368",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    minHeight: "60px",
    width: "100%",
  },
  quickActionButtonPrimary: {
    background: "#00B368",
    color: "#FFFFFF",
    border: "2px solid #00B368",
  },
  quickActionButtonSecondary: {
    background: "transparent",
    color: "#00B368",
    border: "2px solid #00B368",
  },
};

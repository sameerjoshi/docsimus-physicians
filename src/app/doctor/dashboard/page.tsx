"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useDoctorOnboarding } from "../../doctor-onboarding/hooks/useDoctorOnboarding";
import { Home, Calendar, Users, DollarSign, Settings, Bell, Video, Zap, Clock, CheckCircle, Heart, Phone, MessageCircle } from "lucide-react";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
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
            <button
              style={styles.notificationIcon}
              onClick={() => {}}
            >
              <Bell size={20} />
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
          {/* Header Section */}
          <div style={styles.header}>
            <h1 style={styles.pageTitle}>Welcome, Dr. {state.profile.firstName && state.profile.lastName ? `${state.profile.firstName} ${state.profile.lastName}` : "Physician"}</h1>
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

          {/* Main Content Grid */}
          <div style={styles.contentGrid}>
            {/* Left Column */}
            <div style={styles.leftColumn}>
              {/* Scheduling Calendar */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>Scheduling Calendar</h2>
                  <div style={styles.tabButtons}>
                    <button style={styles.tabButton}>Month</button>
                    <button style={{...styles.tabButton, ...styles.tabButtonActive}}>Week</button>
                    <button style={styles.tabButton}>Block Time</button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div style={styles.calendarSection}>
                  <div style={styles.dayLabels}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} style={styles.dayLabel}>{day}</div>
                    ))}
                  </div>
                  <div style={styles.daysGrid}>
                    {[17, 18, 19, 20, 21, 22, 23].map((day) => (
                      <div
                        key={day}
                        style={{
                          ...styles.dayCell,
                          ...(day === 21 ? styles.dayActive : {}),
                        }}
                      >
                        <div style={styles.dayNumber}>{day}</div>
                        <div style={styles.dayMonth}>Aug</div>
                        <div style={styles.dayAppts}>Appts</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div style={styles.appointmentsSection}>
                  <h3 style={styles.appointmentTitle}>Upcoming Appointments</h3>
                  {[
                    { name: "Emily White", time: "10:00 AM", status: "Follow-up" },
                    { name: "John Doe", time: "02:30 PM", status: "Initial Consultation" },
                  ].map((appt, idx) => (
                    <div key={idx} style={styles.appointmentItem}>
                      <div>
                        <p style={styles.appointmentName}>{appt.name}</p>
                        <p style={styles.appointmentTime}>{appt.time} - {appt.status}</p>
                      </div>
                      <button style={styles.consultButton}>Start Consultation</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.rightColumn}>
              {/* Recent Patients and Earnings Side by Side */}
              <div style={styles.sideBySedeGrid}>
                {/* Recent Patients */}
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h2 style={styles.cardTitle}>Recent Patients</h2>
                    <button style={styles.menuButton}>⋮</button>
                  </div>
                  <div style={styles.cardDivider}></div>
                  <div style={styles.patientsList}>
                    {[
                      { name: "Michael Brown", date: "Aug 20, 2024", avatar: "MB" },
                      { name: "Sarah Davis", date: "Aug 19, 2024", avatar: "SD" },
                      { name: "David Lee", date: "Aug 18, 2024", avatar: "DL" },
                      { name: "Jessica Wilson", date: "Aug 17, 2024", avatar: "JW" },
                      { name: "Chris Taylor", date: "Aug 16, 2024", avatar: "CT" },
                      { name: "Olivia Moore", date: "Aug 15, 2024", avatar: "OM" },
                    ].map((patient, idx) => (
                      <div key={idx} style={styles.patientItem}>
                        <div style={styles.patientAvatar}>{patient.avatar}</div>
                        <div style={styles.patientInfo}>
                          <p style={styles.patientName}>{patient.name}</p>
                          <p style={styles.patientDate}>Last: {patient.date}</p>
                        </div>
                        <div style={styles.patientActions}>
                          <button style={styles.actionIcon} title="History">
                            <Clock size={18} color="#999" />
                          </button>
                          <button style={styles.actionIcon} title="Call">
                            <Phone size={18} color="#999" />
                          </button>
                          <button style={styles.actionIcon} title="Message">
                            <MessageCircle size={18} color="#999" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings Overview */}
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Earnings Overview</h2>
                  <div style={styles.earningsContent}>
                    <div>
                      <p style={styles.earningsAmount}>$2,500</p>
                      <p style={styles.earningsChange}>↑ 12% from last month</p>
                    </div>
                    <button style={styles.viewDetailsButton}>View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Full Width */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Quick Actions</h3>
            <div style={styles.quickActionsGrid}>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonPrimary}} onClick={() => navigateTo("/doctor/dashboard")}>
                <Video size={20} />
                Start Instant Consultation
              </button>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonSecondary}} onClick={() => navigateTo("/doctor/schedule")}>
                <Calendar size={20} />
                View Schedule
              </button>
              <button style={{...styles.quickActionButton, ...styles.quickActionButtonSecondary}} onClick={() => navigateTo("/doctor/settings")}>
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
    flexDirection: "column",
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
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  sideBySedeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  menuButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
    padding: 0,
  },
  cardDivider: {
    height: "2px",
    background: "linear-gradient(to right, #6366F1, #8B5CF6)",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: 0,
  },
  tabButtons: {
    display: "flex",
    gap: "8px",
  },
  tabButton: {
    padding: "6px 12px",
    border: "1px solid #E0E0E0",
    borderRadius: "6px",
    background: "#FFFFFF",
    fontSize: "12px",
    fontWeight: "500",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabButtonActive: {
    background: "#00B368",
    color: "#FFFFFF",
    border: "1px solid #00B368",
  },
  calendarSection: {
    marginBottom: "24px",
  },
  dayLabels: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "12px",
  },
  dayLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#999",
    textAlign: "center",
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
  },
  dayCell: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E0E0E0",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  dayActive: {
    background: "#00B368",
    border: "1px solid #00B368",
    color: "#FFFFFF",
  },
  dayNumber: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 4px 0",
  },
  dayMonth: {
    fontSize: "12px",
    fontWeight: "500",
    margin: "0 0 4px 0",
  },
  dayAppts: {
    fontSize: "11px",
    color: "#666",
  },
  appointmentsSection: {
    borderTop: "1px solid #E0E0E0",
    paddingTop: "20px",
  },
  appointmentTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 12px 0",
  },
  appointmentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #F0F0F0",
  },
  appointmentName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 4px 0",
  },
  appointmentTime: {
    fontSize: "12px",
    color: "#999",
    margin: 0,
  },
  consultButton: {
    padding: "6px 16px",
    background: "#00B368",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
  },
  patientsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  patientItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "8px",
    background: "#F9F9F9",
    transition: "all 0.2s",
  },
  patientAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#00B368",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "12px",
    flexShrink: 0,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 2px 0",
  },
  patientDate: {
    fontSize: "11px",
    color: "#999",
    margin: 0,
  },
  patientActions: {
    display: "flex",
    gap: "8px",
  },
  actionIcon: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px",
  },
  earningsContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  earningsAmount: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#00B368",
    margin: 0,
  },
  earningsChange: {
    fontSize: "13px",
    color: "#00B368",
    margin: "8px 0 0 0",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  viewDetailsButton: {
    padding: "10px 20px",
    background: "transparent",
    border: "2px solid #00B368",
    borderRadius: "6px",
    color: "#00B368",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
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


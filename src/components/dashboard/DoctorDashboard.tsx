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

          {/* Scheduling Calendar, Recent Patients and Earnings Grid */}
          <div style={styles.threeColumnGrid}>
            {/* Scheduling Calendar */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Scheduling Calendar</h3>
              <div style={styles.calendarContainer}>
                <div style={styles.calendarHeader}>
                  <button style={styles.calendarNav}>&lt;</button>
                  <span style={styles.calendarMonth}>August 2024</span>
                  <button style={styles.calendarNav}>&gt;</button>
                </div>
                
                {/* Day headers */}
                <div style={styles.calendarDayHeaders}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={styles.dayHeader}>{day}</div>
                  ))}
                </div>

                {/* Calendar days */}
                <div style={styles.calendarDays}>
                  {[17, 18, 19, 20, 21, 22, 23].map((day) => (
                    <button 
                      key={day} 
                      style={{
                        ...styles.calendarDay,
                        ...(day === 21 ? styles.calendarDaySelected : {})
                      }}
                    >
                      <span style={styles.dayNumber}>{day}</span>
                      <span style={styles.dayName}>Aug</span>
                    </button>
                  ))}
                </div>

                {/* Toggle buttons */}
                <div style={styles.calendarToggleButtons}>
                  <button style={styles.toggleButton}>Month</button>
                  <button style={{...styles.toggleButton, ...styles.toggleButtonActive}}>Week</button>
                  <button style={styles.toggleButton}>Block Time</button>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div style={styles.upcomingAppointments}>
                <h4 style={styles.upcomingTitle}>Upcoming Appointments</h4>
                <div style={styles.appointmentsList}>
                  <div style={styles.appointmentItem}>
                    <div style={styles.appointmentAvatar}>EM</div>
                    <div style={styles.appointmentInfo}>
                      <p style={styles.appointmentName}>Emily White</p>
                      <p style={styles.appointmentTime}>01:30 AM - Follow-up</p>
                    </div>
                    <button style={styles.appointmentButton}>Start Consultation</button>
                  </div>
                  <div style={styles.appointmentItem}>
                    <div style={styles.appointmentAvatar}>JD</div>
                    <div style={styles.appointmentInfo}>
                      <p style={styles.appointmentName}>John Doe</p>
                      <p style={styles.appointmentTime}>02:30 PM - Initial Consultation</p>
                    </div>
                    <button style={styles.appointmentButton}>Start Consultation</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Patients */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Recent Patients</h3>
              <div style={styles.patientsList}>
                <div style={styles.patientItem}>
                  <div style={styles.patientAvatar}>MB</div>
                  <div style={styles.patientInfo}>
                    <p style={styles.patientName}>Michael Brown</p>
                    <p style={styles.patientDate}>Last: Aug 20, 2024</p>
                  </div>
                  <div style={styles.patientActions}>
                    <button style={styles.patientActionButton} title="Schedule"><Calendar size={18} /></button>
                    <button style={styles.patientActionButton} title="Call"><Phone size={18} /></button>
                    <button style={styles.patientActionButton} title="Message"><MessageCircle size={18} /></button>
                  </div>
                </div>

                <div style={styles.patientItem}>
                  <div style={styles.patientAvatar}>SD</div>
                  <div style={styles.patientInfo}>
                    <p style={styles.patientName}>Sarah Davis</p>
                    <p style={styles.patientDate}>Last: Aug 19, 2024</p>
                  </div>
                  <div style={styles.patientActions}>
                    <button style={styles.patientActionButton} title="Schedule"><Calendar size={18} /></button>
                    <button style={styles.patientActionButton} title="Call"><Phone size={18} /></button>
                    <button style={styles.patientActionButton} title="Message"><MessageCircle size={18} /></button>
                  </div>
                </div>

                <div style={styles.patientItem}>
                  <div style={styles.patientAvatar}>DL</div>
                  <div style={styles.patientInfo}>
                    <p style={styles.patientName}>David Lee</p>
                    <p style={styles.patientDate}>Last: Aug 18, 2024</p>
                  </div>
                  <div style={styles.patientActions}>
                    <button style={styles.patientActionButton} title="Schedule"><Calendar size={18} /></button>
                    <button style={styles.patientActionButton} title="Call"><Phone size={18} /></button>
                    <button style={styles.patientActionButton} title="Message"><MessageCircle size={18} /></button>
                  </div>
                </div>

                <div style={styles.patientItem}>
                  <div style={styles.patientAvatar}>JW</div>
                  <div style={styles.patientInfo}>
                    <p style={styles.patientName}>Jessica Wilson</p>
                    <p style={styles.patientDate}>Last: Aug 17, 2024</p>
                  </div>
                  <div style={styles.patientActions}>
                    <button style={styles.patientActionButton} title="Schedule"><Calendar size={18} /></button>
                    <button style={styles.patientActionButton} title="Call"><Phone size={18} /></button>
                    <button style={styles.patientActionButton} title="Message"><MessageCircle size={18} /></button>
                  </div>
                </div>

                <div style={styles.patientItem}>
                  <div style={styles.patientAvatar}>CT</div>
                  <div style={styles.patientInfo}>
                    <p style={styles.patientName}>Chris Taylor</p>
                    <p style={styles.patientDate}>Last: Aug 16, 2024</p>
                  </div>
                  <div style={styles.patientActions}>
                    <button style={styles.patientActionButton} title="Schedule"><Calendar size={18} /></button>
                    <button style={styles.patientActionButton} title="Call"><Phone size={18} /></button>
                    <button style={styles.patientActionButton} title="Message"><MessageCircle size={18} /></button>
                  </div>
                </div>

                <div style={styles.patientItem}>
                  <div style={styles.patientAvatar}>OM</div>
                  <div style={styles.patientInfo}>
                    <p style={styles.patientName}>Olivia Moore</p>
                    <p style={styles.patientDate}>Last: Aug 15, 2024</p>
                  </div>
                  <div style={styles.patientActions}>
                    <button style={styles.patientActionButton} title="Schedule"><Calendar size={18} /></button>
                    <button style={styles.patientActionButton} title="Call"><Phone size={18} /></button>
                    <button style={styles.patientActionButton} title="Message"><MessageCircle size={18} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Overview */}
            <div style={styles.card}>
              <div style={styles.earningsHeader}>
                <h3 style={styles.cardTitle}>Earnings Overview</h3>
                <button style={styles.moreButton}>⋮</button>
              </div>
              <div style={styles.earningsContent}>
                <p style={styles.earningsAmount}>$2,500</p>
                <p style={styles.earningsSubtext}>↑ 12% from last month</p>
                <button style={styles.viewDetailsButton}>View Details</button>
              </div>
              <div style={styles.earningsChart}>
                <svg viewBox="0 0 300 150" style={styles.chartSvg}>
                  {/* Background gradient areas */}
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#A8E6D9', stopOpacity: 0.4 }} />
                      <stop offset="100%" style={{ stopColor: '#A8E6D9', stopOpacity: 0.1 }} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#F8B4D1', stopOpacity: 0.5 }} />
                      <stop offset="100%" style={{ stopColor: '#F8B4D1', stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>
                  {/* Teal area */}
                  <path d="M 0 100 Q 30 85 60 80 T 120 75 T 180 70 T 240 75 T 300 65 L 300 150 L 0 150 Z" fill="url(#grad1)" />
                  {/* Pink area */}
                  <path d="M 0 80 Q 30 70 60 65 T 120 60 T 180 50 T 240 55 T 300 40 L 300 150 L 0 150 Z" fill="url(#grad2)" />
                  {/* Teal line */}
                  <path d="M 0 100 Q 30 85 60 80 T 120 75 T 180 70 T 240 75 T 300 65" stroke="#4ECDC4" strokeWidth="2" fill="none" />
                  {/* Pink line */}
                  <path d="M 0 80 Q 30 70 60 65 T 120 60 T 180 50 T 240 55 T 300 40" stroke="#F8B4D1" strokeWidth="2" fill="none" />
                </svg>
              </div>
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
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginTop: "32px",
  },
  threeColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "24px",
    marginTop: "32px",
  },
  calendarContainer: {
    marginBottom: "24px",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  calendarMonth: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A1A1A",
  },
  calendarNav: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#999",
    padding: "4px 8px",
  },
  calendarDayHeaders: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "12px",
    textAlign: "center" as const,
  },
  dayHeader: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#999",
    padding: "8px 0",
  },
  calendarDays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "16px",
  },
  calendarDay: {
    background: "#F5F5F5",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    padding: "12px 8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDaySelected: {
    background: "#00B368",
    borderColor: "#00B368",
    color: "#FFFFFF",
  },
  dayNumber: {
    fontSize: "14px",
    fontWeight: "600",
  },
  dayName: {
    fontSize: "10px",
    color: "#999",
  },
  calendarToggleButtons: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  toggleButton: {
    background: "#F5F5F5",
    border: "1px solid #E0E0E0",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  toggleButtonActive: {
    background: "#00B368",
    borderColor: "#00B368",
    color: "#FFFFFF",
  },
  upcomingAppointments: {
    borderTop: "1px solid #E0E0E0",
    paddingTop: "16px",
  },
  upcomingTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 12px 0",
  },
  appointmentsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  appointmentItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#F9F9F9",
    borderRadius: "8px",
  },
  appointmentAvatar: {
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
  appointmentInfo: {
    flex: 1,
  },
  appointmentName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 2px 0",
  },
  appointmentTime: {
    fontSize: "12px",
    color: "#999",
    margin: 0,
  },
  appointmentButton: {
    background: "none",
    border: "none",
    color: "#00B368",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "4px 8px",
    whiteSpace: "nowrap" as const,
  },
  patientsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto" as const,
  },
  patientItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#F9F9F9",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  patientAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#E8E8E8",
    color: "#666",
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
    fontSize: "12px",
    color: "#999",
    margin: 0,
  },
  patientActions: {
    display: "flex",
    gap: "8px",
  },
  patientActionButton: {
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  },
  earningsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  moreButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#999",
    padding: "0",
  },
  earningsContent: {
    marginBottom: "16px",
  },
  earningsAmount: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#00B368",
    margin: "0 0 4px 0",
  },
  earningsSubtext: {
    fontSize: "13px",
    color: "#999",
    margin: "0 0 12px 0",
  },
  viewDetailsButton: {
    background: "none",
    border: "none",
    color: "#00B368",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
  },
  earningsChart: {
    width: "100%",
    height: "120px",
    marginTop: "16px",
    borderRadius: "12px",
    border: "2px solid #E0E0E0",
    overflow: "hidden",
    padding: "8px",
    boxSizing: "border-box" as const,
  },
  chartSvg: {
    width: "100%",
    height: "100%",
  },
};

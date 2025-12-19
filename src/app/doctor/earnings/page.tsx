"use client";

import { useRouter } from "next/navigation";
import { Home, Calendar, Users, DollarSign, Settings, Bell, Video, Heart } from "lucide-react"; 
export default function EarningsPage() {
  const router = useRouter();

 
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
      <nav style={styles.topNav}>
        <div style={styles.navContent}>
          <div style={styles.navLeft}>
            <div style={styles.logo}>
              <Heart size={24} fill="#E63946" color="#E63946" />
            </div>
            <span style={styles.appName}>Docsium</span>
          </div>
          <div style={styles.navCenter}>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                style={{
                  ...styles.navItem,
                  ...(item.path === "/doctor/earnings" ? styles.navItemActive : {}),
                }}
              >
                <item.icon style={styles.navItemIcon} size={18} />
              </button>
            ))}
          </div>
          <div style={styles.navRight}>
            <button style={styles.notificationIcon}>🔔</button>
            <button onClick={() => router.push("/doctor/profile")} style={styles.profileButton}>
              <div style={styles.profileAvatar}>DP</div>
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.contentContainer}>
          <h1 style={styles.pageTitle}>Earnings</h1>
          <div style={styles.card}>
            <p style={styles.placeholder}>Earnings analytics coming soon...</p>
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
    padding: "8px 16px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.2s",
  },
  navItemActive: {
    background: "#00B368",
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
  },
  main: {
    padding: "40px 20px",
  },
  contentContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 24px 0",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: "14px",
    padding: "40px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
  },
  placeholder: {
    fontSize: "16px",
    color: "#999",
    margin: 0,
  },
};

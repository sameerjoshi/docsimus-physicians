"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppointments } from "@/src/hooks/use-appointments";
import { RouteGuard } from "@/src/components/RouteGuard";
import { AppHeader } from "@/src/components/layout/app-header";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { LoadingSpinner } from "@/src/components/loading-spinner";
import { AvailabilityToggle } from "@/src/components/dashboard/AvailabilityToggle";
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  Video,
  CheckCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/src/lib/animations";
import { useProfile } from "@/src/hooks/use-profile";
import { usePatientsStats } from "@/src/hooks/use-patients";

export default function DashboardPage() {
  const router = useRouter();
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  const { profile, fetchProfile, isLoading: profileLoading } = useProfile();
  const {
    todayAppointments,
    upcomingAppointmentsCount,
    fetchTodayAppointments,
    fetchUpcomingAppointmentsCount,
    isLoading: appointmentsLoading,
  } = useAppointments();
  const { data: patientStats, isLoading: statsLoading } = usePatientsStats();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        await fetchProfile();
        await fetchUpcomingAppointmentsCount();
        await fetchTodayAppointments();

        // Stats - totalPatients and monthlyEarnings would come from a separate API
        // appointmentsToday will be derived from todayAppointments
        // setMonthly earnings would come from a separate earnings API
        setMonthlyEarnings(45000); // TODO: Replace with actual earnings API
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    }
    loadDashboardData();
  }, []);

  if (profileLoading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  const isPending =
    profile?.status === "PENDING" || profile?.status === "pending";
  const isRejected =
    profile?.status === "REJECTED" || profile?.status === "rejected";

  // Calculate pending appointments count
  const pendingCount = todayAppointments.filter(
    (apt) => apt.status === "PENDING"
  ).length;

  const statCards = [
    {
      title: "Total Patients",
      value: statsLoading ? "..." : patientStats?.totalPatients || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      change: statsLoading
        ? "..."
        : `${patientStats?.newPatientsThisMonth || 0} new this month`,
    },
    {
      title: "Appointments Today",
      value: todayAppointments.length,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      change: pendingCount > 0 ? `${pendingCount} pending` : "All confirmed",
    },
    {
      title: "Upcoming",
      value: upcomingAppointmentsCount,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      change: "Next 7 days",
    },
    {
      title: "Monthly Earnings",
      value: `₹${monthlyEarnings.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      change: "+8%",
    },
  ];

  return (
    <RouteGuard
      requireAuth={true}
      requireVerified={true}
      requireRole="DOCTOR"
      requireOnboarding={true}
    >
      <>
        <AppHeader />
        <div className="min-h-screen bg-background">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl"
          >
            {/* Welcome Section */}
            <motion.div variants={staggerItem} className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Welcome back, Dr. {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Here's what's happening with your practice today
              </p>
            </motion.div>

            {/* Profile Status Alerts */}
            {isPending && (
              <motion.div variants={staggerItem} className="mb-6">
                <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        Your profile is under review
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        You'll be able to start consultations once approved
                        (24-48 hours)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/application-status")}
                      className="flex-shrink-0 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                    >
                      View Status
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {isRejected && (
              <motion.div variants={staggerItem} className="mb-6">
                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-900 dark:text-red-200">
                        Application Rejected
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {profile?.rejectionReason ||
                          "Please review the feedback and resubmit your application."}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/registration")}
                      className="flex-shrink-0 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      Resubmit
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Stats Grid */}
            <motion.div
              variants={staggerItem}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                      >
                        <Icon
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </Card>
                );
              })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Appointments */}
              <motion.div variants={staggerItem} className="lg:col-span-2">
                <Card className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Today's Appointments
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/schedule")}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {todayAppointments.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No appointments scheduled for today</p>
                      </div>
                    ) : (
                      todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors gap-3 sm:gap-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-foreground truncate">
                                {appointment.patient?.name || "Patient"}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                <Clock className="h-3 w-3" />
                                {new Date(
                                  appointment.scheduledAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                <span className="hidden sm:inline">•</span>
                                <Video className="h-3 w-3" />
                                {appointment.type || "Video Call"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:ml-4">
                            {appointment.status === "CONFIRMED" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                                <CheckCircle className="h-3 w-3" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded-full text-xs font-medium">
                                {appointment.status}
                              </span>
                            )}
                            {(appointment.status === "CONFIRMED" ||
                              appointment.status === "IN_PROGRESS") && (
                              <Button
                                size="sm"
                                className="flex-shrink-0"
                                onClick={() =>
                                  router.push(
                                    `/appointment/${appointment.id}/join`
                                  )
                                }
                              >
                                Join Call
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Performance Card */}
              <motion.div variants={staggerItem}>
                <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Performance</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    98%
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Patient satisfaction rate
                  </p>
                </Card>

                {/* Availability Toggle */}
                <div className="mt-6">
                  <AvailabilityToggle />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </>
    </RouteGuard>
  );
}

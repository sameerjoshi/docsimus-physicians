'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doctorService } from '@/src/services/doctor.service';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { LoadingSpinner } from '@/src/components/loading-spinner';
import { AvailabilityToggle } from '@/src/components/dashboard/AvailabilityToggle';
import {
  Users, Calendar, DollarSign, Activity, Clock,
  Video, CheckCircle, TrendingUp, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/src/lib/animations';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    upcomingAppointments: 0,
    monthlyEarnings: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const profileData = await doctorService.getProfile();
      setProfile(profileData);

      // Mock stats - replace with actual API calls
      setStats({
        totalPatients: 42,
        appointmentsToday: 5,
        upcomingAppointments: 12,
        monthlyEarnings: 45000,
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  const isPending = profile?.status === 'PENDING' || profile?.status === 'pending';

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
    },
    {
      title: 'Appointments Today',
      value: stats.appointmentsToday,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      change: '3 pending',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      change: 'Next week',
    },
    {
      title: 'Monthly Earnings',
      value: `₹${stats.monthlyEarnings.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      change: '+8%',
    },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Rajesh Kumar', time: '10:00 AM', type: 'Video Call', status: 'confirmed' },
    { id: 2, patient: 'Priya Sharma', time: '11:30 AM', type: 'Video Call', status: 'confirmed' },
    { id: 3, patient: 'Amit Patel', time: '02:00 PM', type: 'Video Call', status: 'pending' },
  ];

  return (
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

          {/* Profile Status Alert */}
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
                      You'll be able to start consultations once approved (24-48 hours)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/profile')}
                    className="flex-shrink-0 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  >
                    View Profile
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
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
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
                    onClick={() => router.push('/schedule')}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No appointments scheduled for today</p>
                    </div>
                  ) : (
                    upcomingAppointments.map((appointment) => (
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
                              {appointment.patient}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                              <span className="hidden sm:inline">•</span>
                              <Video className="h-3 w-3" />
                              {appointment.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:ml-4">
                          {appointment.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                              <CheckCircle className="h-3 w-3" />
                              Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600 text-white rounded-full text-xs font-medium">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                          <Button size="sm" className="flex-shrink-0">
                            Join Call
                          </Button>
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
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">98%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Patient satisfaction rate
                </p>
              </Card>

              {/* Availability Toggle */}
              <div className="mt-6">
                <AvailabilityToggle onToggle={(available) => console.log('Availability:', available)} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

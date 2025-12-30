'use client';

import { useState, useEffect, useMemo } from 'react';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Label } from '@/src/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { ChevronLeft, ChevronRight, Plus, Video, CheckCircle, X, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';
import { useAppointments } from '@/src/hooks/use-appointments';
import { Appointment } from '@/src/types/appointments';
import { CreateAvailabilityPayload } from '@/src/types/availabilities';
import { useAvailabilities } from '@/src/hooks/use-availabilities';
import { Input } from '@/src/components/ui/input';
import { Checkbox } from '@/src/components/ui/checkbox';
import { toast } from 'sonner';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  // Modal states
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // New availability form
  const [newSlot, setNewSlot] = useState({
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: true,
  });

  const { appointments, isLoading, fetchAppointments } = useAppointments();
  const { availabilities, fetchAvailabilities, createAvailability, deleteAvailability } = useAvailabilities();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getWeekDates = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates();

  // Fetch data on mount and when view/date changes
  useEffect(() => {
    if (view === 'week') {
      const weekStart = new Date(weekDates[0].setHours(0, 0, 0, 0)).toISOString();
      const weekEnd = new Date(weekDates[6].setHours(23, 59, 59, 999)).toISOString();
      fetchAppointments({ fromDate: weekStart, toDate: weekEnd });
    } else {
      // Day view - fetch only for the selected day
      const dayStart = new Date(selectedDay.setHours(0, 0, 0, 0)).toISOString();
      const dayEnd = new Date(selectedDay.setHours(23, 59, 59, 999)).toISOString();
      fetchAppointments({ fromDate: dayStart, toDate: dayEnd });
    }
    fetchAvailabilities();
  }, [currentDate, selectedDay, view]);

  const previousPeriod = () => {
    if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(selectedDay);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDay(newDate);
      // Update currentDate if we moved to a different week
      const weekStart = weekDates[0];
      if (newDate < weekStart) {
        setCurrentDate(newDate);
      }
    }
  };

  const nextPeriod = () => {
    if (view === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(selectedDay);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDay(newDate);
      // Update currentDate if we moved to a different week
      const weekEnd = weekDates[6];
      if (newDate > weekEnd) {
        setCurrentDate(newDate);
      }
    }
  };

  // Group appointments by day and time
  const appointmentsByDayAndTime = useMemo(() => {
    const grouped: Record<number, Record<string, Appointment[]>> = {};

    appointments.forEach(apt => {
      const date = new Date(apt.scheduledAt);
      const dayOfWeek = date.getDay();
      const hour = date.getHours().toString().padStart(2, '0');

      if (!grouped[dayOfWeek]) grouped[dayOfWeek] = {};
      if (!grouped[dayOfWeek][hour]) grouped[dayOfWeek][hour] = [];
      grouped[dayOfWeek][hour].push(apt);
    });

    return grouped;
  }, [appointments]);

  // Get appointments grouped by hour (used for day view)
  const dayAppointmentsByTime = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {};

    appointments.forEach(apt => {
      const date = new Date(apt.scheduledAt);
      const hour = date.getHours().toString().padStart(2, '0');
      if (!grouped[hour]) grouped[hour] = [];
      grouped[hour].push(apt);
    });

    return grouped;
  }, [appointments]);

  // Get display hours (all 24 hours)
  const displayHours = Array.from({ length: 24 }, (_, i) => i);

  const handleAddTimeSlot = async () => {
    // Validate date
    if (!newSlot.date) {
      toast.error('Please select a date');
      return;
    }

    // Validate start time
    if (!newSlot.startTime) {
      toast.error('Please select a start time');
      return;
    }

    // Validate end time
    if (!newSlot.endTime) {
      toast.error('Please select an end time');
      return;
    }

    // Validate that end time is after start time
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    // Validate date is not in the past (for non-recurring)
    const selectedDate = new Date(newSlot.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newSlot.isRecurring && selectedDate < today) {
      toast.error('Please select a date in the future');
      return;
    }

    const dayOfWeek = selectedDate.getDay();

    const payload: CreateAvailabilityPayload = {
      dayOfWeek,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isRecurring: newSlot.isRecurring,
      // If not recurring, include the specific date
      ...(!newSlot.isRecurring && { specificDate: newSlot.date }),
    };

    const success = await createAvailability(payload);
    if (success) {
      setShowAddSlotDialog(false);
      setNewSlot({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-600 text-white"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-600 text-white"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-600 text-white"><X className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canJoinConsultation = () => {
    if (!selectedAppointment) return false;

    const now = Date.now();
    const start = (new Date(selectedAppointment.scheduledAt)).getUTCMilliseconds();
    const end = start + selectedAppointment.duration * 60 * 1000;

    return (selectedAppointment.status === "CONFIRMED" ||
      selectedAppointment.status === "REMINDER_SENT" ||
      selectedAppointment.status === "IN_PROGRESS") &&
      (now - start) > 0 && (end - now) > 0;
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

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
          {/* Header */}
          <motion.div variants={staggerItem} className="mb-6">
            <div className="gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Schedule</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage your appointments and availability</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
              {/* Calendar Header */}
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={previousPeriod}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold">
                      {view === 'week'
                        ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                      }
                    </h2>
                    <Button variant="outline" size="sm" onClick={nextPeriod}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={view === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={view === 'day' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('day')}
                    >
                      Day
                    </Button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {/* Calendar Grid - Desktop */}
                {!isLoading && view === 'week' && (
                  <div className="hidden md:block overflow-x-auto">
                    <div className="min-w-[600px]">
                      {/* Days Header */}
                      <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-xs font-medium text-muted-foreground"></div>
                        {weekDates.map((date, i) => (
                          <div
                            key={i}
                            className="text-center cursor-pointer hover:bg-accent rounded-lg p-1 transition-colors"
                            onClick={() => {
                              setSelectedDay(date);
                              setView('day');
                            }}
                          >
                            <div className="text-xs font-medium text-muted-foreground">{daysOfWeek[i]}</div>
                            <div className={`text-sm font-semibold mt-1 ${date.toDateString() === new Date().toDateString()
                              ? 'w-8 h-8 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center'
                              : ''
                              }`}>
                              {date.getDate()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Time Slots Grid */}
                      <div className="space-y-1">
                        {displayHours.map((hour) => {
                          const hourStr = hour.toString().padStart(2, '0');
                          return (
                            <div key={hour} className="grid grid-cols-8 gap-2">
                              <div className="text-xs text-muted-foreground pt-1">
                                {hour === 0 ? '12:00 AM' : hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                              </div>
                              {weekDates.map((date, dayIndex) => {
                                const dayAppointments = appointmentsByDayAndTime[dayIndex]?.[hourStr] || [];
                                return (
                                  <div
                                    key={`${hour}-${dayIndex}`}
                                    className="border border-border rounded-lg p-1 min-h-[68px] bg-background"
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      {dayAppointments.slice(0, 4).map((apt) => (
                                        <div
                                          key={apt.id}
                                          onClick={() => {
                                            setSelectedAppointment(apt);
                                            setShowAppointmentDialog(true);
                                          }}
                                          className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-all hover:opacity-80 hover:scale-[1.02] active:scale-[0.98] ${apt.status === 'CONFIRMED'
                                            ? 'bg-green-600 text-white'
                                            : apt.status === 'COMPLETED'
                                              ? 'bg-blue-600 text-white'
                                              : 'bg-amber-600 text-white'
                                            }`}
                                        >
                                          <p className="font-medium truncate">{apt.patient?.name || 'Patient'}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Calendar Grid - Day View Desktop */}
                {!isLoading && view === 'day' && (
                  <div className="hidden md:block">
                    <div className="space-y-1">
                      {displayHours.map((hour) => {
                        const hourStr = hour.toString().padStart(2, '0');
                        const hourAppointments = dayAppointmentsByTime[hourStr] || [];
                        return (
                          <div key={hour} className="grid grid-cols-[80px_1fr] gap-4">
                            <div className="text-xs text-muted-foreground pt-2">
                              {hour === 0 ? '12:00 AM' : hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                            </div>
                            <div className="border border-border rounded-lg p-2 min-h-[60px] bg-background">
                              <div className="flex flex-col gap-1">
                                {hourAppointments.map((apt) => (
                                  <div
                                    key={apt.id}
                                    onClick={() => {
                                      setSelectedAppointment(apt);
                                      setShowAppointmentDialog(true);
                                    }}
                                    className={`text-sm px-3 py-2 rounded cursor-pointer transition-all hover:opacity-80 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between ${apt.status === 'CONFIRMED'
                                      ? 'bg-green-600 text-white'
                                      : apt.status === 'COMPLETED'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-amber-600 text-white'
                                      }`}
                                  >
                                    <div>
                                      <p className="font-medium">{apt.patient?.name || 'Patient'}</p>
                                      <p className="text-xs opacity-90">{formatTime(apt.scheduledAt)} - {apt.duration} mins</p>
                                    </div>
                                    <Badge className="bg-white/20 text-white text-[10px]">{apt.status}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Calendar Grid - Mobile Week View */}
                {!isLoading && view === 'week' && (
                  <div className="md:hidden">
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {weekDates.map((date, i) => {
                        const dayApts = appointments.filter(apt =>
                          new Date(apt.scheduledAt).toDateString() === date.toDateString()
                        );
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <div
                            key={i}
                            className="text-center cursor-pointer"
                            onClick={() => {
                              setSelectedDay(date);
                              setView('day');
                            }}
                          >
                            <div className="text-xs font-medium text-muted-foreground mb-1">{daysOfWeek[i].slice(0, 1)}</div>
                            <div className={`text-sm font-semibold p-2 rounded-lg transition-colors ${isToday
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                              }`}>
                              {date.getDate()}
                            </div>
                            {/* Appointment indicators */}
                            <div className="flex justify-center gap-0.5 mt-1 min-h-[8px]">
                              {dayApts.slice(0, 3).map((apt, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full ${apt.status === 'CONFIRMED' ? 'bg-green-500' :
                                    apt.status === 'COMPLETED' ? 'bg-blue-500' :
                                      apt.status === 'CANCELLED' ? 'bg-red-500' : 'bg-amber-500'
                                    }`}
                                />
                              ))}
                              {dayApts.length > 3 && (
                                <span className="text-[8px] text-muted-foreground">+{dayApts.length - 3}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Week appointments summary */}
                    {appointments.length > 0 && (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {appointments
                          .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                          .slice(0, 5)
                          .map((apt) => (
                            <div
                              key={apt.id}
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setShowAppointmentDialog(true);
                              }}
                              className={`p-2 rounded-lg cursor-pointer text-white text-xs ${apt.status === 'CONFIRMED' ? 'bg-green-600' :
                                apt.status === 'COMPLETED' ? 'bg-blue-600' : 'bg-amber-600'
                                }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium truncate">{apt.patient?.name || 'Patient'}</span>
                                <span className="text-[10px] opacity-90">
                                  {new Date(apt.scheduledAt).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                              </div>
                              <p className="text-[10px] opacity-90">{formatTime(apt.scheduledAt)}</p>
                            </div>
                          ))}
                        {appointments.length > 5 && (
                          <p className="text-xs text-center text-muted-foreground">
                            +{appointments.length - 5} more appointments
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Calendar Grid - Mobile Day View */}
                {!isLoading && view === 'day' && (
                  <div className="md:hidden">
                    {/* Day selector strip */}
                    <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                      {weekDates.map((date, i) => {
                        const isSelected = date.toDateString() === selectedDay.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedDay(date)}
                            className={`flex-shrink-0 text-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected
                              ? 'bg-primary text-primary-foreground'
                              : isToday
                                ? 'bg-primary/20 hover:bg-primary/30'
                                : 'hover:bg-accent'
                              }`}
                          >
                            <div className="text-xs font-medium">{daysOfWeek[i].slice(0, 3)}</div>
                            <div className="text-sm font-semibold">{date.getDate()}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Day appointments list */}
                    <div className="space-y-2 max-h-[350px] overflow-y-auto">
                      {Object.keys(dayAppointmentsByTime).length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No appointments on this day
                        </p>
                      ) : (
                        displayHours.map((hour) => {
                          const hourStr = hour.toString().padStart(2, '0');
                          const hourAppointments = dayAppointmentsByTime[hourStr] || [];
                          if (hourAppointments.length === 0) return null;
                          return (
                            <div key={hour} className="flex gap-2">
                              <div className="text-xs text-muted-foreground w-14 pt-2 shrink-0">
                                {hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                              </div>
                              <div className="flex-1 space-y-1">
                                {hourAppointments.map((apt) => (
                                  <div
                                    key={apt.id}
                                    onClick={() => {
                                      setSelectedAppointment(apt);
                                      setShowAppointmentDialog(true);
                                    }}
                                    className={`p-2 rounded-lg cursor-pointer text-white text-sm ${apt.status === 'CONFIRMED' ? 'bg-green-600' :
                                      apt.status === 'COMPLETED' ? 'bg-blue-600' : 'bg-amber-600'
                                      }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{apt.patient?.name || 'Patient'}</p>
                                        <p className="text-xs opacity-90">{apt.duration} mins</p>
                                      </div>
                                      <Badge className="bg-white/20 text-white text-[10px]">{apt.status}</Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Stats Sidebar */}
            <motion.div variants={staggerItem} className="space-y-6">
              {/* Stats */}
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4">{view === 'week' ? 'This Week' : 'This Day'}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Total Appointments</span>
                      <span className="font-semibold">{appointments.length}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(appointments.length * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-semibold">
                        {appointments.filter(a => a.status === 'COMPLETED').length}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{
                          width: appointments.length
                            ? `${(appointments.filter(a => a.status === 'COMPLETED').length / appointments.length) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Existing Time Slots */}
              {availabilities.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Your Availability Slots</h3>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => setShowAddSlotDialog(true)}
                    >
                      <Plus className="mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {availabilities.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{!slot.isRecurring && `${new Date(slot.specificDate!).toLocaleDateString()} - `}{daysOfWeekFull[slot.dayOfWeek]}</p>
                          <p className="text-sm text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                            {slot.isRecurring && <span className="ml-2 text-xs">(Weekly)</span>}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAvailability(slot.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Add Availability Dialog */}
      <Dialog open={showAddSlotDialog} onOpenChange={setShowAddSlotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Availability</DialogTitle>
            <DialogDescription>
              Set your available time slots for appointments.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              {newSlot.date && (
                <p className="text-xs text-muted-foreground">
                  {daysOfWeekFull[new Date(newSlot.date).getDay()]}
                  {newSlot.isRecurring && ' (will repeat every week)'}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  required
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  required
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="recurring"
                checked={newSlot.isRecurring}
                onCheckedChange={(checked: boolean | 'indeterminate') => setNewSlot({ ...newSlot, isRecurring: checked === true })}
              />
              <Label htmlFor="recurring" className="cursor-pointer">
                Repeat weekly on {newSlot.date ? daysOfWeekFull[new Date(newSlot.date).getDay()] + 's' : 'this day'}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSlotDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Dialog */}
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div>
                <span className="text-muted-foreground">Patient</span>
                <p className="mt-1 text-sm">{selectedAppointment.patient?.name || 'Unknown'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date & Time</span>
                <p className="mt-1 text-sm">
                  {new Date(selectedAppointment.scheduledAt).toLocaleDateString()} at {formatTime(selectedAppointment.scheduledAt)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration</span>
                <p className="mt-1 text-sm">{selectedAppointment.duration} mins</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type</span>
                <p className="mt-1 text-sm">{selectedAppointment.type}</p>
              </div>
              <div>
                <span className="block text-muted-foreground">Status</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
              {selectedAppointment.reason && (
                <div>
                  <span className="text-muted-foreground">Reason</span>
                  <p className="mt-1 text-sm">{selectedAppointment.reason}</p>
                </div>
              )}
              {selectedAppointment.symptoms && (
                <div>
                  <span className="text-muted-foreground">Symptoms</span>
                  <p className="mt-1 text-sm">{selectedAppointment.symptoms}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {canJoinConsultation() && (
              <>
                <Button>
                  <Video className="h-4 w-4 mr-2" />
                  Join Consultation
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setShowAppointmentDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

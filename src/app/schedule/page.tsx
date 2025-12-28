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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Calendar, Clock, ChevronLeft, ChevronRight,
  Plus, Video, CheckCircle, X, Loader2,
  Bell, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';
import { useAppointments } from '@/src/hooks/useAppointments';
import { Appointment } from '@/src/types/appointments';
import { CreateTimeSlotPayload } from '@/src/types/time-slots';
import { useTimeSlots } from '@/src/hooks/useTimeSlots';
import { useConsultations } from '@/src/hooks/useConsultations';
import { useProfile } from '@/src/hooks/useProfile';
import { useConsultationSocket } from '@/src/hooks/useConsultationSocket';
import { useToast } from '@/src/hooks/use-toast';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  // Modal states
  const [showAddSlotDialog, setShowAddSlotDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // New time slot form
  const [newSlot, setNewSlot] = useState<CreateTimeSlotPayload>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: true,
  });

  const {
    appointments,
    todayAppointments,
    isLoading,
    fetchWeekAppointments,
    fetchTodayAppointments,
  } = useAppointments();

  const { timeSlots, fetchTimeSlots, createTimeSlot, deleteTimeSlot } = useTimeSlots();
  const { pendingRequests, fetchPendingRequests } = useConsultations();
  const { availability, fetchAvailability, toggleAvailability } = useProfile();
  const { respondToRequest } = useConsultationSocket();
  const toast = useToast();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlotOptions = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );

  // Fetch data on mount and when week changes
  useEffect(() => {
    const weekStart = getWeekDates()[0];
    fetchWeekAppointments(weekStart);
    fetchTodayAppointments();
    fetchTimeSlots();
    fetchPendingRequests();
    fetchAvailability();
  }, [currentDate]);

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

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

  // Get display hours (9 AM to 9 PM)
  const displayHours = Array.from({ length: 13 }, (_, i) => i + 9);

  const handleAddTimeSlot = async () => {
    const success = await createTimeSlot(newSlot);
    if (success) {
      setShowAddSlotDialog(false);
      setNewSlot({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
      });
    }
  };

  const handleToggleAvailability = async () => {
    await toggleAvailability(!availability);
  };

  const handleAcceptInstantRequest = async (requestId: string) => {
    try {
      const result = await respondToRequest(requestId, true);

      if (result.success && result.appointmentId) {
        toast.success('Consultation Accepted. Redirecting...');

        return { appointmentId: result.appointmentId };
      } else {
        throw new Error(result.error || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast.error(`Failed to Accept: ${error instanceof Error ? error.message : 'Please try again'}`);
    }
  };

  const handleRejectInstantRequest = async (requestId: string) => {
    try {
      const result = await respondToRequest(requestId, false);

      if (result.success) {
        toast.info('Request Declined');
      } else {
        throw new Error(result.error || 'Failed to decline request');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error(`Failed to Decline: ${error instanceof Error ? error.message : 'Please try again'}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-600 text-white"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-600 text-white"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-600 text-white"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-600 text-white"><X className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Schedule</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Manage your appointments and availability</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant={availability ? "default" : "outline"}
                  onClick={handleToggleAvailability}
                  disabled={isLoading}
                >
                  {availability ? (
                    <><ToggleRight className="h-4 w-4 mr-2" />Available Now</>
                  ) : (
                    <><ToggleLeft className="h-4 w-4 mr-2" />Set Available</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Pending Instant Requests */}
          {pendingRequests.length > 0 && (
            <motion.div variants={staggerItem} className="mb-6">
              <Card className="p-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Instant Consultation Requests ({pendingRequests.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div>
                        <p className="font-medium">{request.patient?.name || 'Patient'}</p>
                        {request.reason && (
                          <p className="text-sm text-muted-foreground">{request.reason}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {new Date(request.expiresAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInstantRequest(request.id)}
                          disabled={isLoading}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectInstantRequest(request.id)}
                          disabled={isLoading}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
              {/* Calendar Header */}
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={previousWeek}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <Button variant="outline" size="sm" onClick={nextWeek}>
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
                {!isLoading && (
                  <div className="hidden md:block overflow-x-auto">
                    <div className="min-w-[600px]">
                      {/* Days Header */}
                      <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-xs font-medium text-muted-foreground"></div>
                        {weekDates.map((date, i) => (
                          <div key={i} className="text-center">
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
                      <div className="space-y-2">
                        {displayHours.map((hour) => {
                          const hourStr = hour.toString().padStart(2, '0');
                          return (
                            <div key={hour} className="grid grid-cols-8 gap-2">
                              <div className="text-xs text-muted-foreground pt-2">
                                {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                              </div>
                              {weekDates.map((date, dayIndex) => {
                                const dayAppointments = appointmentsByDayAndTime[dayIndex]?.[hourStr] || [];
                                return (
                                  <div
                                    key={`${hour}-${dayIndex}`}
                                    className="border border-border rounded-lg p-2 min-h-[60px] hover:bg-accent/50 transition-colors cursor-pointer relative"
                                  >
                                    {dayAppointments.map((apt) => (
                                      <div
                                        key={apt.id}
                                        onClick={() => {
                                          setSelectedAppointment(apt);
                                          setShowAppointmentDialog(true);
                                        }}
                                        className={`text-xs p-2 rounded cursor-pointer ${apt.status === 'CONFIRMED'
                                          ? 'bg-green-600 text-white'
                                          : apt.status === 'COMPLETED'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-amber-600 text-white'
                                          }`}
                                      >
                                        <p className="font-medium truncate">{apt.patient?.name || 'Patient'}</p>
                                        <p className="text-xs opacity-90">{formatTime(apt.scheduledAt)}</p>
                                      </div>
                                    ))}
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

                {/* Calendar Grid - Mobile */}
                <div className="md:hidden">
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {daysOfWeek.map((day, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xs font-medium text-muted-foreground mb-1">{day.slice(0, 1)}</div>
                        <div className={`text-sm font-semibold p-2 rounded-lg ${weekDates[i].toDateString() === new Date().toDateString()
                          ? 'bg-primary text-primary-foreground'
                          : ''
                          }`}>
                          {weekDates[i].getDate()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-4" onClick={() => setShowAddSlotDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              </Card>

              {/* Existing Time Slots */}
              {timeSlots.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <h3 className="font-semibold mb-4">Your Availability Slots</h3>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{daysOfWeekFull[slot.dayOfWeek]}</p>
                          <p className="text-sm text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                            {slot.isRecurring && <span className="ml-2 text-xs">(Weekly)</span>}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTimeSlot(slot.id)}
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

            {/* Today's Appointments Sidebar */}
            <motion.div variants={staggerItem}>
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today&apos;s Appointments
                </h3>
                <div className="space-y-3">
                  {todayAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No appointments today</p>
                    </div>
                  ) : (
                    todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowAppointmentDialog(true);
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{apt.patient?.name || 'Patient'}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(apt.scheduledAt)}
                            </p>
                          </div>
                          {getStatusBadge(apt.status)}
                        </div>
                        <div className="flex gap-2 mt-3">
                          {apt.status === 'CONFIRMED' && (
                            <Button size="sm" className="flex-1">
                              <Video className="h-3 w-3 mr-1" />
                              Join
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Stats */}
              <Card className="p-4 sm:p-6 mt-6">
                <h3 className="font-semibold mb-4">This Week</h3>
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
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-semibold">
                        {appointments.filter(a => a.status === 'PENDING').length}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{
                          width: appointments.length
                            ? `${(appointments.filter(a => a.status === 'PENDING').length / appointments.length) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Add Time Slot Dialog */}
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
              <Label>Day of Week</Label>
              <Select
                value={newSlot.dayOfWeek.toString()}
                onValueChange={(value) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeekFull.map((day, i) => (
                    <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select
                  value={newSlot.startTime}
                  onValueChange={(value) => setNewSlot({ ...newSlot, startTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlotOptions.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Select
                  value={newSlot.endTime}
                  onValueChange={(value) => setNewSlot({ ...newSlot, endTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlotOptions.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={newSlot.isRecurring}
                onChange={(e) => setNewSlot({ ...newSlot, isRecurring: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="recurring">Repeat weekly</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSlotDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Slot
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
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Patient</span>
                <span className="font-medium">{selectedAppointment.patient?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">
                  {new Date(selectedAppointment.scheduledAt).toLocaleDateString()} at {formatTime(selectedAppointment.scheduledAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{selectedAppointment.duration} mins</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{selectedAppointment.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
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
            {selectedAppointment?.status === 'CONFIRMED' && (
              <>
                <Button>
                  <Video className="h-4 w-4 mr-2" />
                  Start Consultation
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

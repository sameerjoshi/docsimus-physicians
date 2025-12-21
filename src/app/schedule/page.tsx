'use client';

import { useState } from 'react';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  Calendar, Clock, ChevronLeft, ChevronRight,
  Plus, Video, Users, CheckCircle, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${i + 9}:00`);

  // Mock appointments
  const appointments = [
    { id: 1, patient: 'Rajesh Kumar', time: '10:00', duration: 30, type: 'video', status: 'confirmed', day: 2 },
    { id: 2, patient: 'Priya Sharma', time: '11:30', duration: 30, type: 'video', status: 'confirmed', day: 2 },
    { id: 3, patient: 'Amit Patel', time: '14:00', duration: 30, type: 'video', status: 'pending', day: 3 },
  ];

  const todayAppointments = [
    { id: 1, patient: 'Rajesh Kumar', time: '10:00 AM', type: 'Video Call', status: 'confirmed' },
    { id: 2, patient: 'Priya Sharma', time: '11:30 AM', type: 'Video Call', status: 'confirmed' },
    { id: 3, patient: 'Amit Patel', time: '02:00 PM', type: 'Video Call', status: 'pending' },
  ];

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
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Schedule</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your appointments and availability</p>
          </motion.div>

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

                {/* Calendar Grid - Desktop */}
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

                    {/* Time Slots */}
                    <div className="space-y-2">
                      {timeSlots.map((time, timeIndex) => (
                        <div key={time} className="grid grid-cols-8 gap-2">
                          <div className="text-xs text-muted-foreground pt-2">{time}</div>
                          {weekDates.map((date, dayIndex) => (
                            <div
                              key={`${time}-${dayIndex}`}
                              className="border border-border rounded-lg p-2 min-h-[60px] hover:bg-accent/50 transition-colors cursor-pointer relative"
                            >
                              {appointments
                                .filter(apt => apt.day === dayIndex && apt.time.startsWith(time.split(':')[0]))
                                .map(apt => (
                                  <div
                                    key={apt.id}
                                    className={`text-xs p-2 rounded ${apt.status === 'confirmed'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-amber-600 text-white'
                                      }`}
                                  >
                                    <p className="font-medium truncate">{apt.patient}</p>
                                    <p className="text-xs">{apt.time}</p>
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

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

                <Button className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Availability
                </Button>
              </Card>
            </motion.div>

            {/* Today's Appointments Sidebar */}
            <motion.div variants={staggerItem}>
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Appointments
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
                        className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{apt.patient}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {apt.time}
                            </p>
                          </div>
                          {apt.status === 'confirmed' ? (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-600 text-white">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1">
                            <Video className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                          <Button size="sm" variant="outline">
                            <X className="h-4 w-4" />
                          </Button>
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
                      <span className="text-muted-foreground">Appointments</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-3/4"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-semibold">9</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-2/3"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

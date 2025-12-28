'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Loader2, AlertCircle, Video, Calendar, Clock, User,
  Stethoscope, FileText, CheckCircle2, ChevronLeft,
} from 'lucide-react';

import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { appointmentsService } from '@/src/services/appointments.service';
import { consultationsService } from '@/src/services/consultations.service';
import { Appointment } from '@/src/types/appointments';

export default function JoinConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Fetch appointment and check for existing consultation
  useEffect(() => {
    async function loadData() {
      if (!appointmentId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch appointment details
        const appointmentData = await appointmentsService.getAppointmentById(appointmentId);
        setAppointment(appointmentData);
      } catch (err: any) {
        console.error('Failed to load appointment:', err);
        setError(err.message || 'Failed to load appointment');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [appointmentId]);

  // Handle starting the consultation
  const handleStartConsultation = useCallback(async () => {
    if (!appointment) return;

    setIsCreating(true);
    setError(null);

    try {
      // Create the consultation room
      const consultation = await consultationsService.createConsultation(appointmentId);

      toast.success('Consultation room created');

      // Navigate to the consultation room
      router.push(`/consultation/${consultation.id}`);
    } catch (err: any) {
      console.error('Failed to create consultation:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start consultation';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsCreating(false);
    }
  }, [appointment, appointmentId, router]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading appointment...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !appointment) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to Load Appointment</h2>
            <p className="text-muted-foreground mb-4">{error || 'Appointment not found'}</p>
            <Button onClick={() => router.push('/dashboard')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </>
    );
  }

  // Check if appointment can be joined
  const canJoin = ['CONFIRMED', 'REMINDER_SENT', 'IN_PROGRESS'].includes(appointment.status);

  if (!canJoin) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Cannot Join Consultation</h2>
            <p className="text-muted-foreground mb-4">
              This appointment has status &quot;{appointment.status}&quot; and cannot be joined.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </>
    );
  }

  // Format date
  const formattedDate = new Date(appointment.scheduledAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(appointment.scheduledAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Ready to Start Consultation</h1>
              <p className="text-muted-foreground">
                Review the details below and start the video consultation
              </p>
            </div>

            {/* Patient Details Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Patient Information
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">{appointment.patient?.name || 'Patient'}</p>
                  {appointment.patient?.email && (
                    <p className="text-sm text-muted-foreground">{appointment.patient.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </Card>

            {/* Reason / Symptoms Card */}
            {(appointment.reason || appointment.symptoms) && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Consultation Details
                </h3>
                <div className="space-y-3">
                  {appointment.reason && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reason for Visit</p>
                      <p className="text-foreground">{appointment.reason}</p>
                    </div>
                  )}
                  {appointment.symptoms && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Symptoms</p>
                      <p className="text-foreground">{appointment.symptoms}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Context Summary Card (from AI chat) */}
            {appointment.contextSummary && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  AI Context Summary
                </h3>
                <p className="text-muted-foreground text-sm">{appointment.contextSummary}</p>
              </Card>
            )}

            {/* Pre-call Checklist */}
            <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800 dark:text-green-300">
                <CheckCircle2 className="w-5 h-5" />
                Pre-Call Checklist
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Camera and microphone are working',
                  'Stable internet connection',
                  'Quiet environment for the consultation',
                  'Patient information reviewed',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={handleStartConsultation}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting Consultation...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    Start Video Consultation
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={isCreating}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

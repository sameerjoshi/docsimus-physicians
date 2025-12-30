"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Phone,
  User,
  Clock,
  FileText,
  ChevronLeft,
  Maximize,
  Minimize,
  Loader2,
  WifiOff,
  AlertCircle,
  Stethoscope,
  ClipboardList,
  Pill,
} from "lucide-react";
import {
  DailyProvider,
  DailyAudio,
  useParticipantProperty,
  useScreenShare,
} from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

import { AppHeader } from "@/src/components/layout/app-header";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { VideoTile } from "@/src/components/consultations/VideoTile";
import { ScreenShareTile } from "@/src/components/consultations/ScreenShareTile";
import { useDailyCall } from "@/src/hooks/use-daily-call";
import { useConsultations } from "@/src/hooks/use-consultations";
import { useConsultationSocket } from "@/src/hooks/use-consultation-socket";
import {
  Consultation,
  UpdateConsultationNotesDto,
  ConsultationEndedEvent,
  ParticipantJoinedEvent,
  ParticipantLeftEvent,
} from "@/src/types/consultations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";

// Format duration to mm:ss
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Media controls component
function MediaControls({
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleNotes,
  onEndCall,
  showNotesPanel,
  isScreenSharing,
  isLeaving,
  localSessionId,
}: {
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleNotes: () => void;
  onEndCall: () => void;
  showNotesPanel: boolean;
  isScreenSharing: boolean;
  isLeaving: boolean;
  localSessionId: string | null;
}) {
  const isMicEnabled =
    useParticipantProperty(localSessionId ?? "", "audio") === true;
  const isCameraEnabled =
    useParticipantProperty(localSessionId ?? "", "video") === true;

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-card rounded-full border border-border shadow-lg">
        {/* Mic Toggle */}
        <Button
          variant={isMicEnabled ? "ghost" : "destructive"}
          size="icon"
          onClick={onToggleMic}
          className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 ${isMicEnabled ? "hover:bg-accent" : ""
            }`}
          title={isMicEnabled ? "Mute" : "Unmute"}
        >
          {isMicEnabled ? (
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>

        {/* Camera Toggle */}
        <Button
          variant={isCameraEnabled ? "ghost" : "destructive"}
          size="icon"
          onClick={onToggleCamera}
          className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 ${isCameraEnabled ? "hover:bg-accent" : ""
            }`}
          title={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isCameraEnabled ? (
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>

        {/* Screen Share - Hidden on very small screens */}
        <Button
          variant={isScreenSharing ? "secondary" : "ghost"}
          size="icon"
          onClick={onToggleScreenShare}
          className={`hidden sm:flex rounded-full w-10 h-10 sm:w-12 sm:h-12 ${!isScreenSharing ? "hover:bg-accent" : ""
            }`}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <div className="w-px h-6 sm:h-8 bg-border mx-1 sm:mx-2" />

        {/* Toggle Notes Panel */}
        <Button
          variant={showNotesPanel ? "secondary" : "ghost"}
          size="icon"
          onClick={onToggleNotes}
          className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 ${!showNotesPanel ? "hover:bg-accent" : ""
            }`}
          title="Toggle notes panel"
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <div className="w-px h-6 sm:h-8 bg-border mx-1 sm:mx-2" />

        {/* End Call */}
        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
          disabled={isLeaving}
          className="rounded-full w-12 h-10 sm:w-14 sm:h-12"
          title="End consultation"
        >
          {isLeaving ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 rotate-[135deg]" />
          )}
        </Button>
      </div>
    </div>
  );
}

// Inner consultation room component
function ConsultationRoom({ consultation }: { consultation: Consultation }) {
  const router = useRouter();

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(true);
  const [patientConnected, setPatientConnected] = useState(false);
  const [hasLeftCall, setHasLeftCall] = useState(false);

  // Notes state
  const [doctorNotes, setDoctorNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const { updateNotes: updateConsultationNotes } = useConsultations();

  // Consultation socket for real-time events
  const { endConsultation: endConsultationSocket, notifyNotesUpdated } =
    useConsultationSocket({
      onConsultationEnded: useCallback(
        (data: ConsultationEndedEvent) => {
          if (data.consultationId === consultation.id) {
            toast.info("Consultation ended by patient");
            router.push("/dashboard");
          }
        },
        [consultation.id, router]
      ),
      onParticipantJoined: useCallback(
        (data: ParticipantJoinedEvent) => {
          if (data.consultationId === consultation.id) {
            setPatientConnected(true);
            toast.success("Patient joined the consultation");
          }
        },
        [consultation.id]
      ),
      onParticipantLeft: useCallback(
        (data: ParticipantLeftEvent) => {
          if (data.consultationId === consultation.id) {
            setPatientConnected(false);
            toast.info("Patient left the consultation");
          }
        },
        [consultation.id]
      ),
    });

  // Daily call hook
  const {
    isConnecting,
    isConnected,
    isReady,
    isLeaving,
    error: videoError,
    callDuration,
    isSharingScreen,
    localSessionId,
    remoteParticipantId,
    meetingEndedByOther,
    joinCall,
    leaveCall,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    clearError,
  } = useDailyCall();

  // Detect active screen shares (from any participant)
  const { screens } = useScreenShare();
  const hasActiveScreenShare = screens.length > 0;

  // Pre-fill notes when consultation is loaded
  useEffect(() => {
    if (consultation) {
      if (consultation.doctorNotes) setDoctorNotes(consultation.doctorNotes);
      if (consultation.prescription) setPrescription(consultation.prescription);
      if (consultation.followUpDate)
        setFollowUpDate(consultation.followUpDate.split("T")[0]); // Format for date input
    }
  }, [consultation]);

  // Join the video call (only if user hasn't intentionally left and call object is ready)
  useEffect(() => {
    if (
      !consultation?.roomUrl ||
      !isReady ||
      isConnecting ||
      isConnected ||
      hasLeftCall
    )
      return;
    joinCall(consultation.roomUrl, consultation.token);
  }, [consultation, isReady, isConnecting, isConnected, hasLeftCall, joinCall]);

  // Handle meeting ended by other participant
  useEffect(() => {
    if (meetingEndedByOther) {
      toast.info("The consultation has ended");
      router.push("/dashboard");
    }
  }, [meetingEndedByOther, router]);

  // Save notes
  const saveNotes = useCallback(async () => {
    if (!consultation) return;

    setIsSavingNotes(true);
    try {
      const updateData: UpdateConsultationNotesDto = {
        doctorNotes: doctorNotes || undefined,
        prescription: prescription || undefined,
        followUpDate: followUpDate
          ? new Date(followUpDate).toISOString()
          : undefined,
      };

      await updateConsultationNotes(consultation.id, updateData);
      toast.success("Notes saved successfully");

      // Notify patient in real-time if they're connected
      if (patientConnected && (doctorNotes || prescription || followUpDate)) {
        notifyNotesUpdated(consultation.id, {
          doctorNotes,
          prescription,
          followUpDate: followUpDate
            ? new Date(followUpDate).toISOString()
            : undefined,
        });
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  }, [
    consultation,
    doctorNotes,
    prescription,
    followUpDate,
    updateConsultationNotes,
    patientConnected,
    notifyNotesUpdated,
  ]);

  // Screen share with error handling
  const handleScreenShare = useCallback(async () => {
    try {
      await toggleScreenShare();
    } catch (err) {
      console.error("Screen share error:", err);
      toast.error("Could not share screen. Please check permissions.");
    }
  }, [toggleScreenShare]);

  // Handle end call (save notes, notify socket, leave call)
  const handleEndCall = useCallback(async () => {
    await saveNotes();
    // Notify via socket that consultation is ending
    try {
      await endConsultationSocket(consultation.id);
    } catch (err) {
      console.error("Failed to notify consultation end:", err);
    }
    setHasLeftCall(true);
    await leaveCall();
    setShowEndCallDialog(false);
    toast.success("Consultation ended");
    router.push("/dashboard");
  }, [saveNotes, endConsultationSocket, consultation.id, leaveCall, router]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* DailyAudio handles all remote participant audio */}
      <DailyAudio />

      {/* Top Bar - Responsive */}
      <div className="h-12 sm:h-14 bg-card border-b border-border flex items-center justify-between px-2 sm:px-4">
        {/* Left side - Connection status */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-yellow-500"
                } animate-pulse`}
            />
            <span className="text-xs sm:text-sm text-muted-foreground hidden xs:inline">
              {isConnecting
                ? "Connecting..."
                : isConnected
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Center - Timer */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-foreground">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
          <span className="font-mono text-sm sm:text-lg">
            {formatDuration(callDuration)}
          </span>
        </div>

        {/* Right side - Patient name & fullscreen */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline truncate max-w-[120px] lg:max-w-none">
            Patient: {consultation.appointment?.patient?.name || "Unknown"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground w-8 h-8 sm:w-10 sm:h-10"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Viewport-fitted layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Video Section - Takes remaining space */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${showNotesPanel ? "lg:mr-0" : ""
            }`}
        >
          {/* Connection Error - Fixed height, doesn't affect video area */}
          {videoError && (
            <div className="flex-shrink-0 mx-2 mt-2 sm:mx-4 sm:mt-4 p-2 sm:p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2 sm:gap-3 text-sm">
              <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0" />
              <span className="text-destructive flex-1 truncate">{videoError}</span>
              <Button size="sm" variant="outline" onClick={clearError} className="flex-shrink-0">
                Dismiss
              </Button>
            </div>
          )}

          {/* Video Grid Container - Fills available space */}
          <div className="flex-1 p-2 sm:p-4 flex flex-col min-h-0 relative">
            {/* Adaptive Video Grid - Side-by-side on desktop when screen sharing */}
            <div className={`flex-1 flex min-h-0 gap-2 sm:gap-3 ${hasActiveScreenShare
              ? "flex-col lg:flex-row"
              : "flex-col"
              }`}>
              {/* Screen Share - Takes main area when active */}
              {hasActiveScreenShare && (
                <div className="flex-1 min-h-0 lg:min-w-0">
                  <ScreenShareTile
                    className="w-full h-full"
                    onStopSharing={handleScreenShare}
                  />
                </div>
              )}

              {/* Participant Videos - Sidebar on desktop when screen sharing */}
              <div className={`${hasActiveScreenShare
                ? "flex-shrink-0 lg:w-[200px] xl:w-[280px] flex flex-row lg:flex-col gap-2"
                : "flex-1 flex flex-col"
                } min-h-0`}>
                {/* Remote Participant (Patient) */}
                <div className={`relative rounded-xl overflow-hidden bg-muted ${hasActiveScreenShare
                  ? "flex-1 lg:flex-none lg:aspect-video min-h-[80px]"
                  : "flex-1 min-h-[200px]"
                  }`}>
                  <VideoTile
                    sessionId={remoteParticipantId}
                    label={consultation.appointment?.patient?.name || "Patient"}
                    className="absolute inset-0 w-full h-full"
                  />

                  {/* Waiting indicator when no remote participant */}
                  {!remoteParticipantId && isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm rounded-xl">
                      <div className="text-center px-4">
                        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary mx-auto mb-2 sm:mb-3" />
                        <p className="text-foreground font-medium text-sm sm:text-base">
                          Waiting for patient to join...
                        </p>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                          The patient will appear here once connected
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Self view - Picture-in-Picture overlay (only when no screen share) */}
                  {!hasActiveScreenShare && (
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-[100px] sm:w-[140px] md:w-[180px] aspect-video rounded-lg overflow-hidden shadow-lg border-2 border-background/50 z-10">
                      <VideoTile
                        sessionId={localSessionId}
                        isLocal
                        label="You"
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>

                {/* Self view - Separate tile when screen sharing */}
                {hasActiveScreenShare && (
                  <div className="flex-1 lg:flex-none lg:aspect-video relative rounded-xl overflow-hidden bg-muted min-h-[80px]">
                    <VideoTile
                      sessionId={localSessionId}
                      isLocal
                      label="You"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Control Bar - Fixed at bottom of video area */}
            <div className="flex-shrink-0 pt-2 sm:pt-4">
              <MediaControls
                onToggleMic={toggleMic}
                onToggleCamera={toggleCamera}
                onToggleScreenShare={handleScreenShare}
                onToggleNotes={() => setShowNotesPanel(!showNotesPanel)}
                onEndCall={() => setShowEndCallDialog(true)}
                showNotesPanel={showNotesPanel}
                isScreenSharing={isSharingScreen}
                isLeaving={isLeaving}
                localSessionId={localSessionId}
              />
            </div>
          </div>
        </div>

        {/* Notes Panel - Responsive: full width overlay on mobile, side panel on desktop */}
        <AnimatePresence>
          {showNotesPanel && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed lg:relative inset-0 lg:inset-auto z-20 lg:z-auto w-full lg:w-[320px] xl:w-[380px] flex-shrink-0 border-l border-border bg-card"
            >
              <div className="w-full h-full flex flex-col overflow-hidden">
                {/* Panel Header */}
                <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base">
                    <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Consultation Notes
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden w-8 h-8"
                    onClick={() => setShowNotesPanel(false)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>

                {/* Patient Info */}
                <div className="p-3 sm:p-4 border-b border-border">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground font-medium text-sm sm:text-base truncate">
                        {consultation.appointment?.patient?.name || "Patient"}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {consultation.appointment?.patient?.email || ""}
                      </p>
                    </div>
                  </div>
                  {consultation.appointment?.reason && (
                    <div className="text-xs sm:text-sm">
                      <span className="text-muted-foreground">Reason: </span>
                      <span className="text-foreground">
                        {consultation.appointment.reason}
                      </span>
                    </div>
                  )}
                  {consultation.appointment?.symptoms && (
                    <div className="text-xs sm:text-sm mt-1">
                      <span className="text-muted-foreground">Symptoms: </span>
                      <span className="text-foreground">
                        {consultation.appointment.symptoms}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes Form */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {/* Doctor Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Doctor Notes
                    </label>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Enter clinical notes and diagnosis..."
                      className="w-full h-28 sm:h-40 px-2.5 sm:px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Prescription */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Prescription
                    </label>
                    <textarea
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="Enter prescription..."
                      className="w-full h-20 sm:h-32 px-2.5 sm:px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Follow-up Date */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="p-3 sm:p-4 border-t border-border">
                  <Button
                    className="w-full"
                    onClick={saveNotes}
                    disabled={isSavingNotes}
                  >
                    {isSavingNotes ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Notes"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* End Call Dialog */}
      <Dialog open={showEndCallDialog} onOpenChange={setShowEndCallDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              End Consultation?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to end this consultation? Your notes will be
              saved automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEndCallDialog(false)}
            >
              Continue Consultation
            </Button>
            <Button
              variant="destructive"
              onClick={handleEndCall}
              disabled={isLeaving}
            >
              {isLeaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ending...
                </>
              ) : (
                "End Consultation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Main page component with DailyProvider wrapper
export default function PhysicianConsultationRoomPage() {
  const router = useRouter();
  const params = useParams();
  const consultationId = params.id as string;

  // Consultation hook
  const {
    consultation,
    isLoading: isLoadingConsultation,
    error: consultationError,
    fetchConsultation,
  } = useConsultations();

  // Fetch consultation data
  useEffect(() => {
    if (consultationId) {
      fetchConsultation(consultationId);
    }
  }, [consultationId, fetchConsultation]);

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const callObjectCreatedRef = useRef(false);

  // Create call object only once when consultation is ready
  useEffect(() => {
    if (consultation?.roomUrl && !callObjectCreatedRef.current) {
      callObjectCreatedRef.current = true;
      const co = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: true,
      });
      setCallObject(co);
    }
  }, [consultation?.roomUrl]);

  // Cleanup call object on unmount
  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  // Loading state
  if (isLoadingConsultation) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading consultation...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (consultationError || !consultation) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Unable to Load Consultation
            </h2>
            <p className="text-muted-foreground mb-4">
              {consultationError || "Consultation not found"}
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </>
    );
  }

  // No room URL state
  if (!consultation.roomUrl) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md p-8 text-center">
            <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Video Room Not Ready</h2>
            <p className="text-muted-foreground mb-4">
              The video consultation room is being prepared. Please wait a
              moment.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        </div>
      </>
    );
  }

  // Waiting for call object
  if (!callObject) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Initializing video...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <ConsultationRoom consultation={consultation} />
    </DailyProvider>
  );
}

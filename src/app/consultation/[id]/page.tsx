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
} from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

import { AppHeader } from "@/src/components/layout/app-header";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { VideoTile } from "@/src/components/consultations/VideoTile";
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
      <div className="flex items-center gap-2 p-2 bg-card rounded-full border border-border shadow-lg">
        {/* Mic Toggle */}
        <Button
          variant={isMicEnabled ? "ghost" : "destructive"}
          size="icon"
          onClick={onToggleMic}
          className={`rounded-full w-12 h-12 ${
            isMicEnabled ? "hover:bg-accent" : ""
          }`}
          title={isMicEnabled ? "Mute" : "Unmute"}
        >
          {isMicEnabled ? (
            <Mic className="w-5 h-5" />
          ) : (
            <MicOff className="w-5 h-5" />
          )}
        </Button>

        {/* Camera Toggle */}
        <Button
          variant={isCameraEnabled ? "ghost" : "destructive"}
          size="icon"
          onClick={onToggleCamera}
          className={`rounded-full w-12 h-12 ${
            isCameraEnabled ? "hover:bg-accent" : ""
          }`}
          title={isCameraEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {isCameraEnabled ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </Button>

        {/* Screen Share */}
        <Button
          variant={isScreenSharing ? "secondary" : "ghost"}
          size="icon"
          onClick={onToggleScreenShare}
          className={`rounded-full w-12 h-12 ${
            !isScreenSharing ? "hover:bg-accent" : ""
          }`}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          <MonitorUp className="w-5 h-5" />
        </Button>

        <div className="w-px h-8 bg-border mx-2" />

        {/* Toggle Notes Panel */}
        <Button
          variant={showNotesPanel ? "secondary" : "ghost"}
          size="icon"
          onClick={onToggleNotes}
          className={`rounded-full w-12 h-12 ${
            !showNotesPanel ? "hover:bg-accent" : ""
          }`}
          title="Toggle notes panel"
        >
          <FileText className="w-5 h-5" />
        </Button>

        <div className="w-px h-8 bg-border mx-2" />

        {/* End Call */}
        <Button
          variant="destructive"
          size="icon"
          onClick={onEndCall}
          disabled={isLeaving}
          className="rounded-full w-14 h-12"
          title="End consultation"
        >
          {isLeaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Phone className="w-5 h-5 rotate-[135deg]" />
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

  // Handle exit (just leave the call without ending consultation)
  const handleExit = useCallback(async () => {
    setHasLeftCall(true);
    await leaveCall();
    router.push("/dashboard");
  }, [leaveCall, router]);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* DailyAudio handles all remote participant audio */}
      <DailyAudio />

      {/* Top Bar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleExit}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Exit
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-yellow-500"
              } animate-pulse`}
            />
            <span className="text-sm text-muted-foreground">
              {isConnecting
                ? "Connecting..."
                : isConnected
                ? "Connected"
                : "Disconnected"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-foreground">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-lg">
            {formatDuration(callDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            Patient: {consultation.patient?.name || "Unknown"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Section */}
        <div
          className={`flex-1 p-4 flex flex-col ${showNotesPanel ? "pr-2" : ""}`}
        >
          {/* Connection Error */}
          {videoError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-destructive" />
              <span className="text-destructive">{videoError}</span>
              <Button size="sm" variant="outline" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          )}

          {/* Video Grid */}
          <div className="flex-1 grid gap-4 mb-4">
            {/* Remote participant (patient) - main view */}
            <div className="relative">
              <VideoTile
                sessionId={remoteParticipantId}
                label={consultation.patient?.name || "Patient"}
              />

              {/* Waiting indicator when no remote participant */}
              {!remoteParticipantId && isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                    <p className="text-foreground font-medium">
                      Waiting for patient to join...
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      The patient will appear here once connected
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Self view - picture in picture */}
          <div className="absolute bottom-24 right-4 w-48 z-10">
            <VideoTile sessionId={localSessionId} isLocal label="You" />
          </div>

          {/* Control Bar */}
          <MediaControls
            onToggleMic={toggleMic}
            onToggleCamera={toggleCamera}
            onToggleScreenShare={toggleScreenShare}
            onToggleNotes={() => setShowNotesPanel(!showNotesPanel)}
            onEndCall={() => setShowEndCallDialog(true)}
            showNotesPanel={showNotesPanel}
            isScreenSharing={isSharingScreen}
            isLeaving={isLeaving}
            localSessionId={localSessionId}
          />
        </div>

        {/* Notes Panel */}
        <AnimatePresence>
          {showNotesPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 400, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-card overflow-hidden"
            >
              <div className="w-[400px] h-full flex flex-col">
                {/* Panel Header */}
                <div className="p-4 border-b border-border">
                  <h3 className="text-foreground font-semibold flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    Consultation Notes
                  </h3>
                </div>

                {/* Patient Info */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        {consultation.patient?.name || "Patient"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {consultation.patient?.email || ""}
                      </p>
                    </div>
                  </div>
                  {consultation.appointment?.reason && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reason: </span>
                      <span className="text-foreground">
                        {consultation.appointment.reason}
                      </span>
                    </div>
                  )}
                  {consultation.appointment?.symptoms && (
                    <div className="text-sm mt-1">
                      <span className="text-muted-foreground">Symptoms: </span>
                      <span className="text-foreground">
                        {consultation.appointment.symptoms}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes Form */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Doctor Notes */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Doctor Notes
                    </label>
                    <textarea
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Enter clinical notes and diagnosis..."
                      className="w-full h-40 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Prescription */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Pill className="w-4 h-4 text-primary" />
                      Prescription
                    </label>
                    <textarea
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="Enter prescription..."
                      className="w-full h-32 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Follow-up Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="p-4 border-t border-border">
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

"use client";

import React, { useState } from "react";
import { AppHeader } from "@/src/components/layout/app-header";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Users,
  Search,
  Mail,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/src/lib/animations";
import {
  usePatients,
  usePatientsStats,
  usePatientAppointments,
} from "@/src/hooks/use-patients";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { PatientAppointment } from "@/src/types/patients";
import { RouteGuard } from "@/src/components/RouteGuard";

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(
    null
  );
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<
    PatientAppointment["consultation"] | null
  >(null);

  const { data: patients = [], isLoading: loadingPatients } = usePatients();
  const { data: stats, isLoading: loadingStats } = usePatientsStats();
  const { data: patientAppointments = [], isLoading: loadingAppointments } =
    usePatientAppointments(expandedPatientId || "", !!expandedPatientId);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastAppointment?.reason
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const togglePatientHistory = (patientId: string) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  const openNotesDialog = (
    consultation: PatientAppointment["consultation"]
  ) => {
    setSelectedConsultation(consultation);
    setNotesDialogOpen(true);
  };

  const statsData = [
    {
      id: "total-patients",
      label: "Total Patients",
      value: stats?.totalPatients || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "total-appointments",
      label: "Total Appointments",
      value: stats?.totalAppointments || 0,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      id: "new-month",
      label: "New This Month",
      value: stats?.newPatientsThisMonth || 0,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <RouteGuard>
      <AppHeader />
      <div className="min-h-screen bg-background">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl"
        >
          {/* Header */}
          <motion.div variants={staggerItem} className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Patients</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your patient records and history
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            {statsData.map((stat) => (
              <Card key={stat.id} className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {loadingStats ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </p>
              </Card>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div variants={staggerItem}>
            <Card className="p-4 sm:p-6 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Card>
          </motion.div>

          {/* Patients List - Desktop */}
          <motion.div variants={staggerItem} className="hidden md:block">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loadingPatients ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                        </td>
                      </tr>
                    ) : filteredPatients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          No patients found
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((patient) => (
                        <React.Fragment key={patient.id}>
                          <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">
                                  {patient.name || "N/A"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {patient.totalAppointments || 0} appointment
                                  {patient.totalAppointments !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {patient.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {patient.lastAppointment
                                  ? new Date(
                                    patient.lastAppointment.scheduledAt
                                  ).toLocaleDateString()
                                  : "No visits"}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {patient.lastAppointment?.reason ? (
                                <Badge variant="outline">
                                  {patient.lastAppointment.reason}
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    togglePatientHistory(patient.id)
                                  }
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  History
                                  {expandedPatientId === patient.id ? (
                                    <ChevronUp className="h-4 w-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Row - Appointment History */}
                          <AnimatePresence>
                            {expandedPatientId === patient.id && (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <td
                                  colSpan={5}
                                  className="px-6 py-4 bg-muted/20"
                                >
                                  {loadingAppointments ? (
                                    <div className="flex justify-center py-4">
                                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                    </div>
                                  ) : patientAppointments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                      No appointment history available
                                    </p>
                                  ) : (
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm mb-3">
                                        Appointment History
                                      </h4>
                                      <div className="space-y-2">
                                        {patientAppointments.map(
                                          (appointment) => (
                                            <div
                                              key={appointment.id}
                                              className="flex items-center justify-between p-3 bg-background rounded-lg border"
                                            >
                                              <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                                  <div>
                                                    <p className="text-sm font-medium">
                                                      {new Date(
                                                        appointment.scheduledAt
                                                      ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }
                                                      )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                      {appointment.reason ||
                                                        "No reason provided"}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <Badge
                                                  className={
                                                    appointment.status ===
                                                      "COMPLETED"
                                                      ? "bg-green-600 text-white"
                                                      : appointment.status ===
                                                        "CANCELLED"
                                                        ? "bg-red-600 text-white"
                                                        : "bg-blue-600 text-white"
                                                  }
                                                >
                                                  {appointment.status}
                                                </Badge>
                                                {appointment.consultation && (
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                      openNotesDialog(
                                                        appointment.consultation
                                                      )
                                                    }
                                                  >
                                                    <FileText className="h-4 w-4 mr-1" />
                                                    Consultation Notes
                                                  </Button>
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Patients List - Mobile */}
          <motion.div variants={staggerItem} className="md:hidden space-y-4">
            {loadingPatients ? (
              <Card className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              </Card>
            ) : filteredPatients.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">No patients found</p>
              </Card>
            ) : (
              filteredPatients.map((patient) => (
                <Card key={patient.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{patient.name || "N/A"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.totalAppointments || 0} appointment
                        {patient.totalAppointments !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Last visit:{" "}
                      {patient.lastAppointment
                        ? new Date(
                          patient.lastAppointment.scheduledAt
                        ).toLocaleDateString()
                        : "No visits"}
                    </p>
                    {patient.lastAppointment?.reason && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <Badge variant="outline" className="text-xs">
                          {patient.lastAppointment.reason}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => togglePatientHistory(patient.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {expandedPatientId === patient.id
                      ? "Hide History"
                      : "View History"}
                    {expandedPatientId === patient.id ? (
                      <ChevronUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </Button>

                  {/* Mobile Expanded View */}
                  <AnimatePresence>
                    {expandedPatientId === patient.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t space-y-3">
                          <h4 className="font-semibold text-sm">
                            Appointment History
                          </h4>
                          {loadingAppointments ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                          ) : patientAppointments.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No appointment history available
                            </p>
                          ) : (
                            patientAppointments.map((appointment) => (
                              <Card key={appointment.id} className="p-3">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                      {new Date(
                                        appointment.scheduledAt
                                      ).toLocaleDateString()}
                                    </p>
                                    <Badge
                                      className={
                                        appointment.status === "COMPLETED"
                                          ? "bg-green-600 text-white"
                                          : appointment.status === "CANCELLED"
                                            ? "bg-red-600 text-white"
                                            : "bg-blue-600 text-white"
                                      }
                                    >
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {appointment.reason || "No reason provided"}
                                  </p>
                                  {appointment.consultation && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="w-full mt-2"
                                      onClick={() =>
                                        openNotesDialog(
                                          appointment.consultation
                                        )
                                      }
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      View Consultation Notes
                                    </Button>
                                  )}
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Consultation Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consultation Notes</DialogTitle>
            <DialogDescription>
              Details from the consultation session
            </DialogDescription>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-4 mt-4">
              {selectedConsultation.doctorNotes && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Doctor Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedConsultation.doctorNotes}
                  </p>
                </div>
              )}

              {selectedConsultation.prescription && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Prescription</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedConsultation.prescription}
                  </p>
                </div>
              )}

              {selectedConsultation.followUpDate && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Follow-up Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      selectedConsultation.followUpDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}

              {!selectedConsultation.doctorNotes &&
                !selectedConsultation.prescription &&
                !selectedConsultation.followUpDate && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No consultation notes available for this appointment
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Consultation ID: {selectedConsultation.id}
                    </p>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </RouteGuard>
  );
}

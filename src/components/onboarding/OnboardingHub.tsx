"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Avatar } from "@/src/components/ui";
import { User, MapPin, Briefcase, FileText, Calendar, CheckCircle2, Clock3, ArrowRight } from "lucide-react";
import { useOnboardingAPI } from "@/src/hooks/useOnboardingAPI";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/src/lib/animations";

interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  fields: string[];
}

export function OnboardingHub() {
  const router = useRouter();
  const { state, isAuthenticated } = useOnboardingAPI();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // If onboarding is submitted, redirect to dashboard
    if (state.status === "pending" || state.status === "submitted") {
      router.push("/onboarding/review");
    }
  }, [isHydrated, state.status, router]);

  if (!isHydrated) {
    return null;
  }

  const fullName = `${state.profile.firstName || ""} ${state.profile.lastName || ""}`.trim() || "Doctor";

  // Calculate completion for each section - using proper API data structure  
  const sectionCompletion = {
    personal:
      !!(state.profile.firstName && state.profile.lastName && state.profile.phone && state.profile.dob),
    address:
      !!(state.profile.addressLine1 && state.profile.city && state.profile.state && state.profile.postalCode),
    medical:
      !!(state.professional.registrationNumber && state.professional.council && state.professional.specialization),
    documents:
      Object.values(state.documents).filter((doc) => (doc as any)?.status === "uploaded").length >= 3,
    availability:
      !!(state.availability.fee && state.availability.languages.length > 0),
  };

  const totalCompleted = Object.values(sectionCompletion).filter(Boolean).length;
  const completionPercentage = Math.round((totalCompleted / 5) * 100);

  const sections: Section[] = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Your name, contact, and personal details",
      icon: <User className="h-6 w-6" />,
      href: "/onboarding/personal",
      color: "from-blue-500 to-blue-600",
      fields: ["First Name", "Last Name", "Phone", "Date of Birth"],
    },
    {
      id: "address",
      title: "Address Information",
      description: "Your clinic or practice location",
      icon: <MapPin className="h-6 w-6" />,
      href: "/onboarding/address",
      color: "from-green-500 to-green-600",
      fields: ["Street", "City", "State", "PIN Code"],
    },
    {
      id: "medical",
      title: "Medical Information",
      description: "Your qualifications and registration",
      icon: <Briefcase className="h-6 w-6" />,
      href: "/onboarding/medical",
      color: "from-purple-500 to-purple-600",
      fields: ["Specialization", "Experience", "Council", "Registration #"],
    },
    {
      id: "documents",
      title: "Documents & Verification",
      description: "Your credentials and identification",
      icon: <FileText className="h-6 w-6" />,
      href: "/onboarding/documents",
      color: "from-orange-500 to-orange-600",
      fields: ["Government ID", "MBBS Certificate", "Registration", "Photo", "Video"],
    },
    {
      id: "availability",
      title: "Availability & Preferences",
      description: "Your consultation schedule and fees",
      icon: <Calendar className="h-6 w-6" />,
      href: "/onboarding/availability",
      color: "from-red-500 to-red-600",
      fields: ["Weekly Schedule", "Consultation Fee", "Languages"],
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <Avatar src={state.profile.photo} fallback={fullName} size="lg" />
            <div>
              <h1 className="text-4xl font-bold">Complete Your Registration</h1>
              <p className="text-muted-foreground mt-1">
                Complete all sections to submit your application for review
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{totalCompleted} of 5 sections</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-primary/80"
              />
            </div>
            <p className="text-sm text-muted-foreground">{completionPercentage}% complete</p>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sections.map((section) => {
            const isComplete = sectionCompletion[section.id as keyof typeof sectionCompletion];
            return (
              <motion.div key={section.id} variants={staggerItem}>
                <Link href={section.href}>
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} text-white`}>
                          {section.icon}
                        </div>
                        {isComplete ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock3 className="h-3 w-3" />
                            Not Started
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-3">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground space-y-1">
                        {section.fields.map((field) => (
                          <div key={field} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                            {field}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full group">
                        {isComplete ? "Edit" : "Fill"} Details
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex justify-center gap-4 pt-4 flex-wrap"
        >
          {totalCompleted === 5 ? (
            <Link href="/onboarding/review">
              <Button size="lg" variant="gradient" className="gap-2">
                Review & Submit Application
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" disabled className="gap-2">
              Complete all sections to submit ({totalCompleted}/5)
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="gap-2"
          >
            Skip for Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

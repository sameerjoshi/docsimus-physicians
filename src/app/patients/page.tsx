"use client";

import { useEffect, useState } from "react";
import { DoctorDashboard } from "@/src/components/dashboard/DoctorDashboard";

export default function PatientsPage() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  return <DoctorDashboard />;
}

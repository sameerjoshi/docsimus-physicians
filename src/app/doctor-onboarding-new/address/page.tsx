"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui";
import { useDoctorOnboarding } from "../../doctor-onboarding/hooks/useDoctorOnboarding";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { ArrowLeft, Save } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AddressInformationPage() {
  const router = useRouter();
  const { state, updateProfile } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state_field, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setAddressLine1(state.profile.addressLine1 || "");
    setAddressLine2(state.profile.addressLine2 || "");
    setCity(state.profile.city || "");
    setState(state.profile.state || "");
    setPostalCode(state.profile.postalCode || "");
    setIsHydrated(true);
  }, [state.profile]);

  if (!isHydrated) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    updateProfile({ addressLine1, addressLine2, city, state: state_field, postalCode });

    setTimeout(() => {
      setIsSaving(false);
      router.push("/doctor-onboarding-new");
    }, 500);
  };

  const isValid = !!(addressLine1.trim() && city.trim() && state_field && postalCode.trim());

  return (
    <div className="min-h-screen bg-secondary/60 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/doctor-onboarding-new")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Address Information</h1>
              <p className="text-muted-foreground mt-1">Your clinic or practice location</p>
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Clinic Address</CardTitle>
              <CardDescription>
                Where you practice or consult patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Street / Area *</label>
                  <Input
                    placeholder="e.g., Flat 12, ABC Building"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Landmark (Optional)</label>
                  <Input
                    placeholder="e.g., Near Main Gate Hospital"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City *</label>
                    <Input
                      placeholder="e.g., Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">PIN Code *</label>
                    <Input
                      placeholder="e.g., 110001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">State *</label>
                  <select
                    value={state_field}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a state</option>
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={!isValid || isSaving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save & Continue"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/doctor-onboarding-new")}
                  >
                    Discard
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

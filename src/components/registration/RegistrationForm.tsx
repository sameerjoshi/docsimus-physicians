"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/src/components/ui";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { Plus } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

export function RegistrationForm() {
  const router = useRouter();
  const { state, updateProfile } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1 (US)");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    setFirstName(state.profile.firstName || "");
    setLastName(state.profile.lastName || "");
    setPhone(state.profile.phone || "");
    setDob(state.profile.dob || "");
    setEmail(state.profile.email || "");
  }, [state.profile]);

  const steps: Step[] = [
    { number: 1, label: "Profile" },
    { number: 2, label: "Credentials" },
    { number: 3, label: "Documents" },
    { number: 4, label: "Availability" },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      updateProfile({
        firstName,
        lastName,
        phone,
        dob,
        email,
      });
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/registration/review");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black">Provider Registration</h1>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center items-center gap-16 px-4">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex items-center gap-16">
            <button
              onClick={() => setCurrentStep(step.number)}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base transition-all border-2 ${
                  currentStep >= step.number
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm font-medium text-center ${
                  currentStep >= step.number ? "text-teal-500" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 transition-all ${
                  currentStep > step.number ? "bg-teal-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-10 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Step Title */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 1: Personal Profile
              </h2>
              <p className="text-gray-500 text-sm">
                Provide your basic personal information and a profile photo.
              </p>
            </div>

            {/* Profile Photo */}
            <div className="flex justify-center py-4">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32 rounded-full bg-pink-200 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 shadow-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Upload your professional photo</p>
              </div>
            </div>

            {/* Full Name & Email */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Full Name
                </label>
                <Input
                  placeholder="Dr. Jane Doe"
                  value={`${firstName} ${lastName}`.trim()}
                  onChange={(e) => {
                    const parts = e.target.value.split(" ");
                    setFirstName(parts[0] || "");
                    setLastName(parts.slice(1).join(" ") || "");
                  }}
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Email Address
                </label>
                <Input
                  placeholder="jane.doe@example.com"
                  value={email}
                  disabled
                  className="border border-gray-300 bg-gray-50"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>+1 (US)</option>
                  <option>+91 (IN)</option>
                  <option>+44 (UK)</option>
                  <option>+61 (AU)</option>
                </select>
                <Input
                  placeholder="e.g., 555-123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 border border-gray-300"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Gender</label>
              <div className="flex gap-2">
                {["Male", "Female", "Non-binary", "Prefer not to say"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGender(option)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        gender === option
                          ? "bg-teal-500 text-white border-teal-500"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Date of Birth Year
              </label>
              <select
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="">Select year</option>
                {Array.from(
                  { length: 50 },
                  (_, i) => new Date().getFullYear() - 25 - i
                ).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="text-gray-600"
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="px-8 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Credentials */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 2: Credentials
              </h2>
              <p className="text-gray-500 text-sm">
                Provide your medical qualifications and registration details.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Specialization
                </label>
                <Input
                  placeholder="e.g., Cardiology"
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Years of Experience
                </label>
                <Input
                  placeholder="e.g., 10"
                  type="number"
                  className="border border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Medical Council
                </label>
                <Input
                  placeholder="e.g., Indian Medical Association"
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Registration Number
                </label>
                <Input
                  placeholder="e.g., MCI123456"
                  className="border border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                License Number
              </label>
              <Input
                placeholder="e.g., LIC789456"
                className="border border-gray-300"
              />
            </div>

            <div className="flex gap-3 pt-4 justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="text-gray-600"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 3: Documents & Verification
              </h2>
              <p className="text-gray-500 text-sm">
                Upload your credentials and identification documents.
              </p>
            </div>

            <div className="space-y-4">
              {["Government ID", "MBBS Certificate", "Medical Registration", "Professional Photo", "Video Introduction"].map(
                (doc) => (
                  <div key={doc} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-3xl">📄</div>
                      <p className="text-sm font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-500">Click to upload or drag & drop</p>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="flex gap-3 pt-4 justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="text-gray-600"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 4: Availability & Preferences
              </h2>
              <p className="text-gray-500 text-sm">
                Set your consultation schedule, fees, and language preferences.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Consultation Fee (per session)
              </label>
              <div className="flex gap-2">
                <span className="flex items-center text-gray-600 font-medium">$</span>
                <Input
                  placeholder="e.g., 50"
                  type="number"
                  className="flex-1 border border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Available Days
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <button
                      key={day}
                      type="button"
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-teal-500 hover:text-teal-500 transition-all"
                    >
                      {day}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {["English", "Spanish", "French", "Hindi", "Mandarin"].map(
                  (lang) => (
                    <button
                      key={lang}
                      type="button"
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-teal-500 hover:text-teal-500 transition-all"
                    >
                      {lang}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Bio / About You
              </label>
              <textarea
                placeholder="Tell patients about your expertise and experience..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4 justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="text-gray-600"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="px-8 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Submit & Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

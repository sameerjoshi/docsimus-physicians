"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/src/components/ui";
import { useOnboarding } from "@/src/hooks/useOnboarding";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { Plus } from "lucide-react";
import { DocumentType } from "@/src/types/onboarding";

interface Step {
  number: number;
  label: string;
}

export function RegistrationForm() {
  const router = useRouter();
  const { state, updateProfile, updateDocument } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1 (US)");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<DocumentType, string>>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [medicalCouncil, setMedicalCouncil] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const documentConfigs: {
    key: DocumentType;
    label: string;
    description: string;
    accept: string;
    allowedMime: string[];
    allowedExtensions: string[];
    showPreview: boolean;
  }[] = [
    {
      key: "governmentId",
      label: "Government ID",
      description: "PNG, JPG, or PDF",
      accept: ".png,.jpg,.jpeg,.pdf",
      allowedMime: ["image/png", "image/jpeg", "application/pdf"],
      allowedExtensions: ["png", "jpg", "jpeg", "pdf"],
      showPreview: true,
    },
    {
      key: "medicalDegree",
      label: "MBBS Certificate",
      description: "PDF only",
      accept: ".pdf",
      allowedMime: ["application/pdf"],
      allowedExtensions: ["pdf"],
      showPreview: false,
    },
    {
      key: "registrationCertificate",
      label: "Medical Registration",
      description: "PDF only",
      accept: ".pdf",
      allowedMime: ["application/pdf"],
      allowedExtensions: ["pdf"],
      showPreview: false,
    },
    {
      key: "profilePhoto",
      label: "Professional Photo",
      description: "PNG or JPG",
      accept: ".png,.jpg,.jpeg",
      allowedMime: ["image/png", "image/jpeg"],
      allowedExtensions: ["png", "jpg", "jpeg"],
      showPreview: true,
    },
    {
      key: "introVideo",
      label: "Video Introduction",
      description: "Video formats (mp4, mov, webm)",
      accept: "video/mp4,video/quicktime,video/webm",
      allowedMime: ["video/mp4", "video/quicktime", "video/webm"],
      allowedExtensions: ["mp4", "mov", "webm"],
      showPreview: false,
    },
  ];

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

  const validateFile = (file: File, config: (typeof documentConfigs)[number]) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    return config.allowedMime.includes(file.type) || config.allowedExtensions.includes(ext);
  };

  const handleFileChange = (config: (typeof documentConfigs)[number]) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file, config)) {
      setUploadErrors((prev) => ({ ...prev, [config.key]: `Invalid file type. Allowed: ${config.description}.` }));
      return;
    }

    const previewUrl = config.showPreview ? URL.createObjectURL(file) : undefined;
    updateDocument(config.key, { fileName: file.name, previewUrl });
    setUploadErrors((prev) => ({ ...prev, [config.key]: "" }));
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!firstName.trim() || !lastName.trim()) errors.fullName = "Full name is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    if (!gender) errors.gender = "Gender is required";
    if (!dob) errors.dob = "Date of birth is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!medicalCouncil.trim()) errors.medicalCouncil = "Medical council is required";
    if (!registrationNumber.trim()) errors.registrationNumber = "Registration number is required";
    if (!licenseNumber.trim()) errors.licenseNumber = "License number is required";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredDocs = ["governmentId", "medicalDegree", "registrationCertificate", "profilePhoto", "introVideo"] as DocumentType[];
    
    requiredDocs.forEach((doc) => {
      if (!state.documents[doc]?.fileName) {
        errors[doc] = `${documentConfigs.find(d => d.key === doc)?.label} is required`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!validateStep1()) return;
      updateProfile({
        firstName,
        lastName,
        phone,
        dob,
        email,
      });
    }

    if (currentStep === 2) {
      if (!validateStep2()) return;
    }

    if (currentStep === 3) {
      if (!validateStep3()) return;
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
      setValidationErrors({});
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
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Dr. Jane Doe"
                  value={`${firstName} ${lastName}`.trim()}
                  onChange={(e) => {
                    const parts = e.target.value.split(" ");
                    setFirstName(parts[0] || "");
                    setLastName(parts.slice(1).join(" ") || "");
                  }}
                  className={`border ${validationErrors.fullName ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.fullName && (
                  <p className="text-xs text-red-500">{validationErrors.fullName}</p>
                )}
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
                Phone Number <span className="text-red-500">*</span>
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
                  className={`flex-1 border ${validationErrors.phone ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-xs text-red-500">{validationErrors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Gender <span className="text-red-500">*</span></label>
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
              {validationErrors.gender && (
                <p className="text-xs text-red-500">{validationErrors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Date of Birth Year <span className="text-red-500">*</span>
              </label>
              <select
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full border ${validationErrors.dob ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 text-sm bg-white`}
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
              {validationErrors.dob && (
                <p className="text-xs text-red-500">{validationErrors.dob}</p>
              )}
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
                  Medical Council <span className="text-red-500">*</span>
                </label>
                <select
                  value={medicalCouncil}
                  onChange={(e) => setMedicalCouncil(e.target.value)}
                  className={`w-full border ${validationErrors.medicalCouncil ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 text-sm bg-white`}
                >
                  <option value="">Select Medical Council</option>
                  <option value="National Medical Commission">National Medical Commission (NMC)</option>
                  <option value="Andhra Pradesh Medical Council">Andhra Pradesh Medical Council</option>
                  <option value="Arunachal Pradesh Medical Council">Arunachal Pradesh Medical Council</option>
                  <option value="Assam Medical Council">Assam Medical Council</option>
                  <option value="Bihar Medical Council">Bihar Medical Council</option>
                  <option value="Chhattisgarh Medical Council">Chhattisgarh Medical Council</option>
                  <option value="Delhi Medical Council">Delhi Medical Council (for NCT of Delhi)</option>
                  <option value="Goa Medical Council">Goa Medical Council</option>
                  <option value="Gujarat Medical Council">Gujarat Medical Council</option>
                  <option value="Haryana Medical Council">Haryana Medical Council</option>
                  <option value="Himachal Pradesh Medical Council">Himachal Pradesh Medical Council</option>
                  <option value="Jammu & Kashmir Medical Council">Jammu & Kashmir Medical Council</option>
                  <option value="Jharkhand Medical Council">Jharkhand Medical Council</option>
                  <option value="Karnataka Medical Council">Karnataka Medical Council</option>
                  <option value="Kerala State Medical Council">Kerala State Medical Council</option>
                  <option value="Madhya Pradesh Medical Council">Madhya Pradesh Medical Council</option>
                  <option value="Maharashtra Medical Council">Maharashtra Medical Council</option>
                  <option value="Nagaland Medical Council">Nagaland Medical Council</option>
                  <option value="Odisha Medical Council">Odisha (Orissa) Medical Council</option>
                  <option value="Punjab Medical Council">Punjab Medical Council</option>
                  <option value="Rajasthan Medical Council">Rajasthan Medical Council</option>
                  <option value="Sikkim Medical Council">Sikkim Medical Council</option>
                  <option value="Tamil Nadu Medical Council">Tamil Nadu Medical Council</option>
                  <option value="Telangana State Medical Council">Telangana State Medical Council</option>
                  <option value="Uttar Pradesh Medical Council">Uttar Pradesh Medical Council</option>
                  <option value="Uttarakhand Medical Council">Uttarakhand Medical Council</option>
                  <option value="West Bengal Medical Council">West Bengal Medical Council</option>
                </select>
                {validationErrors.medicalCouncil && (
                  <p className="text-xs text-red-500">{validationErrors.medicalCouncil}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., MCI123456"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className={`border ${validationErrors.registrationNumber ? "border-red-500" : "border-gray-300"}`}
                />
                {validationErrors.registrationNumber && (
                  <p className="text-xs text-red-500">{validationErrors.registrationNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                License Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., LIC789456"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className={`border ${validationErrors.licenseNumber ? "border-red-500" : "border-gray-300"}`}
              />
              {validationErrors.licenseNumber && (
                <p className="text-xs text-red-500">{validationErrors.licenseNumber}</p>
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
              {documentConfigs.map((doc) => {
                const documentState = state.documents[doc.key];
                const hasError = validationErrors[doc.key];

                return (
                  <div
                    key={doc.key}
                    className={`border-2 border-dashed rounded-lg p-6 hover:border-teal-500 transition-colors ${
                      hasError ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <label htmlFor={`upload-${doc.key}`} className="flex flex-col items-center gap-2 cursor-pointer text-center">
                      <div className="text-3xl">📄</div>
                      <p className="text-sm font-medium text-gray-900">
                        {doc.label} <span className="text-red-500">*</span>
                      </p>
                      <p className="text-xs text-gray-500">{doc.description}</p>
                      <p className="text-xs text-gray-500">
                        {documentState?.fileName
                          ? `✓ Selected: ${documentState.fileName}`
                          : "Click to upload or drag & drop"}
                      </p>
                    </label>
                    <input
                      id={`upload-${doc.key}`}
                      type="file"
                      accept={doc.accept}
                      className="hidden"
                      onChange={handleFileChange(doc)}
                    />
                    {uploadErrors[doc.key] && (
                      <p className="mt-2 text-xs text-red-500">{uploadErrors[doc.key]}</p>
                    )}
                    {hasError && (
                      <p className="mt-2 text-xs text-red-500">{hasError}</p>
                    )}
                  </div>
                );
              })}
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

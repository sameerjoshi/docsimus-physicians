"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/src/components/ui";
import { useOnboardingAPI } from "@/src/hooks/useOnboardingAPI";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { Plus, Upload, CheckCircle } from "lucide-react";
import { doctorService } from "@/src/services/doctor.service";

interface Step {
  number: number;
  label: string;
}

export function RegistrationForm() {
  const router = useRouter();
  const { state, updateProfile, updateProfessional, updateAvailability, loading } = useOnboardingAPI();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91 (IN)");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  // Clinic Address
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Step 2: Credentials
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [council, setCouncil] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Step 4: Availability
  const [consultationFee, setConsultationFee] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [bio, setBio] = useState("");

  // Step 3: Document uploads
  const [documentUploads, setDocumentUploads] = useState<Record<string, { file: File | null; uploading: boolean; uploaded: boolean }>>({});
  const fileInputRefs = useState<Record<string, HTMLInputElement | null>>({});

  const documentTypes = [
    { key: "governmentId", label: "Government ID" },
    { key: "medicalDegree", label: "MBBS Certificate" },
    { key: "registrationCertificate", label: "Medical Registration" },
    { key: "profilePhoto", label: "Professional Photo" },
    { key: "introVideo", label: "Video Introduction" },
  ];

  const handleFileClick = (docType: string) => {
    const input = document.getElementById(`file-${docType}`) as HTMLInputElement;
    if (input) input.click();
  };

  const handleFileChange = async (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocumentUploads(prev => ({
      ...prev,
      [docType]: { file, uploading: true, uploaded: false }
    }));

    try {
      await doctorService.uploadDocument(file, docType);
      setDocumentUploads(prev => ({
        ...prev,
        [docType]: { file, uploading: false, uploaded: true }
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setDocumentUploads(prev => ({
        ...prev,
        [docType]: { file: null, uploading: false, uploaded: false }
      }));
    }
  };

  useEffect(() => {
    // Load personal info
    setFirstName(state.profile.firstName || "");
    setLastName(state.profile.lastName || "");
    setPhone(state.profile.phone || "");
    setEmail(state.profile.email || state.auth.email || "");

    // Format DOB for date input (YYYY-MM-DD)
    if (state.profile.dob) {
      const dobDate = new Date(state.profile.dob);
      const year = dobDate.getFullYear();
      if (year > 1900) {
        setDob(state.profile.dob.split('T')[0]);
      }
    }

    // Load address
    setAddressLine1(state.profile.addressLine1 || "");
    setAddressLine2(state.profile.addressLine2 || "");
    setCity(state.profile.city || "");
    setAddressState(state.profile.state || "");
    setPostalCode(state.profile.postalCode || "");

    // Load professional info
    setSpecialization(state.professional.specialization || "");
    setExperience(state.professional.experience || "");
    setCouncil(state.professional.council || "");
    setRegistrationNumber(state.professional.registrationNumber || "");

    // Load availability info
    setConsultationFee(state.availability.fee || "");
    setSelectedLanguages(state.availability.languages || ["English"]);
    setBio(state.availability.bio || "");
  }, [state]);

  // Fetch uploaded documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await doctorService.getDocuments();
        const uploads: Record<string, { file: File | null; uploading: boolean; uploaded: boolean }> = {};

        docs.forEach((doc: any) => {
          uploads[doc.type] = {
            file: new File([], doc.originalName), // Placeholder file object
            uploading: false,
            uploaded: true
          };
        });

        setDocumentUploads(uploads);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const steps: Step[] = [
    { number: 1, label: "Profile" },
    { number: 2, label: "Credentials" },
    { number: 3, label: "Documents" },
    { number: 4, label: "Availability" },
  ];

  const handleNext = async () => {
    // Save data based on current step
    if (currentStep === 1) {
      await updateProfile({
        firstName,
        lastName,
        phone,
        dob,
        email,
        gender,
        addressLine1,
        addressLine2,
        city,
        state: addressState,
        postalCode
      });
    } else if (currentStep === 2) {
      await updateProfessional({
        specialization,
        experience,
        council,
        registrationNumber,
      });
    } else if (currentStep === 4) {
      await updateAvailability({
        fee: consultationFee,
        languages: selectedLanguages,
        bio,
      });
    }

    // Navigate to next step or review
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
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-base transition-all border-2 ${currentStep >= step.number
                  ? "bg-teal-500 text-white border-teal-500"
                  : "bg-white text-gray-600 border-gray-300"
                  }`}
              >
                {step.number}
              </div>
              <span
                className={`text-sm font-medium text-center ${currentStep >= step.number ? "text-teal-500" : "text-gray-400"
                  }`}
              >
                {step.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 transition-all ${currentStep > step.number ? "bg-teal-500" : "bg-gray-300"
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
                  <input
                    type="file"
                    id="profile-photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          await doctorService.uploadDocument(file, "profilePhoto");
                        } catch (error) {
                          console.error("Upload failed:", error);
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("profile-photo-upload")?.click()}
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
                  First Name
                </label>
                <Input
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Last Name
                </label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-gray-300"
                />
              </div>
            </div>

            {/* Email */}
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
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${gender === option
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
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString().split('T')[0]}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Clinic Address Section */}
            <div className="col-span-2 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Address</h3>
            </div>

            {/* Address Line 1 */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Street address, clinic name"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="border border-gray-300"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Address Line 2
              </label>
              <Input
                placeholder="Apartment, suite, floor (optional)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="border border-gray-300"
              />
            </div>

            {/* City, State, Postal Code */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                State <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Maharashtra"
                value={addressState}
                onChange={(e) => setAddressState(e.target.value)}
                className="border border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="400001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="border border-gray-300"
                required
              />
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
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
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
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
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
                  value={council}
                  onChange={(e) => setCouncil(e.target.value)}
                  className="border border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Registration Number
                </label>
                <Input
                  placeholder="e.g., MCI123456"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="border border-gray-300"
                />
              </div>
            </div>

            {/* Removed License Number - not in backend schema */}

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
              {documentTypes.map((docType) => {
                const docState = documentUploads[docType.key];
                const isUploaded = docState?.uploaded;
                const isUploading = docState?.uploading;

                return (
                  <div key={docType.key}>
                    <input
                      type="file"
                      id={`file-${docType.key}`}
                      className="hidden"
                      accept="image/*,application/pdf,video/*"
                      onChange={(e) => handleFileChange(docType.key, e)}
                    />
                    <div
                      onClick={() => !isUploading && handleFileClick(docType.key)}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isUploaded
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-300 hover:border-teal-500"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {isUploaded ? (
                          <CheckCircle className="w-8 h-8 text-teal-500" />
                        ) : isUploading ? (
                          <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {docType.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isUploaded
                            ? `✓ ${docState.file?.name}`
                            : isUploading
                              ? "Uploading..."
                              : "Click to upload or drag & drop"}
                        </p>
                      </div>
                    </div>
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
                <span className="flex items-center text-gray-600 font-medium">₹</span>
                <Input
                  placeholder="e.g., 1200"
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
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
                      onClick={() => {
                        setSelectedDays(prev =>
                          prev.includes(day)
                            ? prev.filter(d => d !== day)
                            : [...prev, day]
                        );
                      }}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${selectedDays.includes(day)
                        ? "bg-teal-500 text-white border-teal-500"
                        : "border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-500"
                        }`}
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
                {["English", "Spanish", "French", "Hindi", "Marathi"].map(
                  (lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setSelectedLanguages(prev =>
                          prev.includes(lang)
                            ? prev.filter(l => l !== lang)
                            : [...prev, lang]
                        );
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedLanguages.includes(lang)
                        ? "bg-teal-500 text-white border-teal-500"
                        : "border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-500"
                        }`}
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
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

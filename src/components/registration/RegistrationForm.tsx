"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/src/components/ui";
import { useOnboarding } from "@/src/hooks/use-onboarding";
import { motion } from "framer-motion";
import { fadeInUp } from "@/src/lib/animations";
import { Plus, Upload, CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";
import { useProfile } from "@/src/hooks/use-profile";

interface Step {
  number: number;
  label: string;
}

const MEDICAL_COUNCILS = [
  "National Medical Commission (NMC)",
  "Andhra Pradesh Medical Council",
  "Arunachal Pradesh Medical Council",
  "Assam Medical Council",
  "Bihar Medical Council",
  "Chhattisgarh Medical Council",
  "Delhi Medical Council",
  "Goa Medical Council",
  "Gujarat Medical Council",
  "Haryana Medical Council",
  "Himachal Pradesh Medical Council",
  "Jharkhand Medical Council",
  "Karnataka Medical Council",
  "Kerala Medical Council",
  "Madhya Pradesh Medical Council",
  "Maharashtra Medical Council",
  "Manipur Medical Council",
  "Meghalaya Medical Council",
  "Mizoram Medical Council",
  "Nagaland Medical Council",
  "Odisha Medical Council",
  "Punjab Medical Council",
  "Rajasthan Medical Council",
  "Sikkim Medical Council",
  "Tamil Nadu Medical Council",
  "Telangana Medical Council",
  "Tripura Medical Council",
  "Uttar Pradesh Medical Council",
  "Uttarakhand Medical Council",
  "West Bengal Medical Council",
];

const FILE_TYPE_REQUIREMENTS: Record<string, string[]> = {
  governmentId: ["image/png", "image/jpeg", "application/pdf"],
  medicalDegree: ["application/pdf"],
  registrationCertificate: ["application/pdf"],
  profilePhoto: ["image/png", "image/jpeg"],
  introVideo: ["video/mp4", "video/quicktime", "video/webm"],
};

const FILE_TYPE_LABELS: Record<string, string> = {
  governmentId: "PNG, JPG, or PDF",
  medicalDegree: "PDF only",
  registrationCertificate: "PDF only",
  profilePhoto: "PNG or JPG",
  introVideo: "Video formats (mp4, mov, webm)",
};

export function RegistrationForm() {
  const router = useRouter();
  const { state, updateProfile, updateAddress, updateProfessional, updateAvailability, loading } = useOnboarding();
  const { profile, documents, fetchProfile, uploadDocument, fetchDocuments } = useProfile();
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
  const [licenseNumber, setLicenseNumber] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 4: Availability
  const [consultationFee, setConsultationFee] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [bio, setBio] = useState("");

  // Step 3: Document uploads
  const [documentUploads, setDocumentUploads] = useState<Record<string, { file: File | null; uploading: boolean; uploaded: boolean; error?: string }>>({});
  const fileInputRefs = useState<Record<string, HTMLInputElement | null>>({});

  // Application status (for rejected applications)
  const [applicationStatus, setApplicationStatus] = useState<{
    status: 'DRAFT' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    rejectionReason?: string;
    documents: Array<{
      id: string;
      type: string;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
      originalName: string;
    }>;
  } | null>(null);

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

    // Validate file type
    const allowedTypes = FILE_TYPE_REQUIREMENTS[docType] || [];
    if (!allowedTypes.includes(file.type)) {
      setDocumentUploads(prev => ({
        ...prev,
        [docType]: { file: null, uploading: false, uploaded: false, error: `Invalid file type. Only ${FILE_TYPE_LABELS[docType] || "supported formats"} are allowed.` }
      }));
      // Reset the input
      event.target.value = "";
      return;
    }

    setDocumentUploads(prev => ({
      ...prev,
      [docType]: { file, uploading: true, uploaded: false, error: undefined }
    }));

    try {
      await uploadDocument(file, docType);
      setDocumentUploads(prev => ({
        ...prev,
        [docType]: { file, uploading: false, uploaded: true, error: undefined }
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setDocumentUploads(prev => ({
        ...prev,
        [docType]: { file: null, uploading: false, uploaded: false, error: "Upload failed. Please try again." }
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
    setAddressLine1(state.address.addressLine1 || "");
    setAddressLine2(state.address.addressLine2 || "");
    setCity(state.address.city || "");
    setAddressState(state.address.state || "");
    setPostalCode(state.address.postalCode || "");

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
  // Fetch uploaded documents and application status on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both documents and profile (which includes status and rejectionReason)
        await Promise.all([
          fetchDocuments(),
          fetchProfile(),
        ]);

        // Set application status from profile
        if (profile) {
          setApplicationStatus({
            status: profile.status as any,
            rejectionReason: profile.rejectionReason,
            documents: documents.map((doc: any) => ({
              id: doc.id,
              type: doc.type,
              status: doc.status,
              rejectionReason: doc.rejectionReason,
              originalName: doc.originalName,
            })),
          });
        }

        const uploads: Record<string, { file: File | null; uploading: boolean; uploaded: boolean }> = {};

        documents.forEach((doc: any) => {
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

    fetchData();
  }, []);

  const steps: Step[] = [
    { number: 1, label: "Profile" },
    { number: 2, label: "Clinic Address" },
    { number: 3, label: "Credentials" },
    { number: 4, label: "Documents" },
    { number: 5, label: "Availability" },
  ];

  // Validation functions
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!dob) newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressLine1.trim()) newErrors.addressLine1 = "Address line 1 is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!addressState.trim()) newErrors.addressState = "State is required";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!council) newErrors.council = "Medical council is required";
    if (!registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
    if (!licenseNumber.trim()) newErrors.licenseNumber = "License number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};
    let allUploaded = true;

    documentTypes.forEach((docType) => {
      const docState = documentUploads[docType.key];
      const existingDoc = applicationStatus?.documents.find(d => d.type === docType.key);

      // Check if approved or has been uploaded in current session
      if (!(docState?.uploaded || existingDoc?.status === 'APPROVED' || existingDoc?.status === 'PENDING')) {
        allUploaded = false;
        newErrors[docType.key] = `${docType.label} is required`;
      }
    });

    setErrors(newErrors);
    return allUploaded;
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
      if (isValid) {
        await updateProfile({
          firstName,
          lastName,
          phone,
          dob,
          email,
          gender,
        });
      }
    } else if (currentStep === 2) {
      isValid = validateStep2();
      if (isValid) {
        await updateAddress({
          addressLine1,
          addressLine2,
          city,
          state: addressState,
          postalCode
        });
      }
    } else if (currentStep === 3) {
      isValid = validateStep3();
      if (isValid) {
        await updateProfessional({
          specialization,
          experience,
          council,
          registrationNumber,
        });
      }
    } else if (currentStep === 4) {
      isValid = validateStep4();
    } else if (currentStep === 5) {
      await updateAvailability({
        fee: consultationFee,
        languages: selectedLanguages,
        bio,
      });
      isValid = true;
    }

    // Navigate to next step if valid
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setErrors({}); // Clear errors when moving to next step
    } else if (isValid && currentStep === 5) {
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

      {/* Rejection Alert Banner */}
      {applicationStatus?.status === 'REJECTED' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Application Rejected
              </h3>
              <p className="text-sm text-red-700 mb-2">
                {applicationStatus.rejectionReason || 'Your application has been rejected. Please review the feedback below and make necessary corrections.'}
              </p>
              <p className="text-sm text-red-600 font-medium">
                Please fix the rejected documents and resubmit your application.
              </p>
              <p className="text-xs text-red-600 mt-2">
                Verified documents are locked and don't need changes.
              </p>
            </div>
          </div>
        </div>
      )}

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
                          await uploadDocument(file, "profilePhoto");
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
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`border ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs font-medium">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`border ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs font-medium">{errors.lastName}</p>
                )}
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
                  className={`flex-1 border ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Gender <span className="text-red-500">*</span>
              </label>
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
              {errors.gender && (
                <p className="text-red-500 text-xs font-medium">{errors.gender}</p>
              )}
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
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.dob ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.dob && (
                <p className="text-red-500 text-xs font-medium">{errors.dob}</p>
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

        {/* Step 2: Clinic Address */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 2: Clinic Address
              </h2>
              <p className="text-gray-500 text-sm">
                Provide your clinic location and contact details.
              </p>
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Street address, clinic name"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className={`border ${errors.addressLine1 ? "border-red-500" : "border-gray-300"}`}
                required
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-xs font-medium">{errors.addressLine1}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
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
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`border ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-xs font-medium">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Maharashtra"
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value)}
                  className={`border ${errors.addressState ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.addressState && (
                  <p className="text-red-500 text-xs font-medium">{errors.addressState}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="400001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={`border ${errors.postalCode ? "border-red-500" : "border-gray-300"}`}
                  required
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-xs font-medium">{errors.postalCode}</p>
                )}
              </div>
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

        {/* Step 3: Credentials */}
        {currentStep === 3 && (
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
                  Medical Council <span className="text-red-500">*</span>
                </label>
                <select
                  value={council}
                  onChange={(e) => setCouncil(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.council ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select a medical council</option>
                  {MEDICAL_COUNCILS.map((councilName) => (
                    <option key={councilName} value={councilName}>
                      {councilName}
                    </option>
                  ))}
                </select>
                {errors.council && (
                  <p className="text-red-500 text-xs font-medium">{errors.council}</p>
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
                  className={`border ${errors.registrationNumber ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.registrationNumber && (
                  <p className="text-red-500 text-xs font-medium">{errors.registrationNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                License Number <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., LIC123456"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className={`border ${errors.licenseNumber ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.licenseNumber && (
                <p className="text-red-500 text-xs font-medium">{errors.licenseNumber}</p>
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

        {/* Step 4: Documents */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 4: Documents & Verification
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
                const uploadError = docState?.error;

                // Get document status from application status
                const existingDoc = applicationStatus?.documents.find(d => d.type === docType.key);
                const isApproved = existingDoc?.status === 'APPROVED';
                const isRejected = existingDoc?.status === 'REJECTED';
                const isPending = existingDoc?.status === 'PENDING';

                return (
                  <div key={docType.key}>
                    <div className="space-y-2 mb-3">
                      <label className="text-sm font-semibold text-gray-900">
                        {docType.label} <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 font-normal ml-2">
                          ({FILE_TYPE_LABELS[docType.key]})
                        </span>
                      </label>
                    </div>
                    <input
                      type="file"
                      id={`file-${docType.key}`}
                      className="hidden"
                      accept={FILE_TYPE_REQUIREMENTS[docType.key]?.join(",")}
                      onChange={(e) => handleFileChange(docType.key, e)}
                      disabled={isApproved}
                    />
                    <div
                      onClick={() => !isUploading && !isApproved && document.getElementById(`file-${docType.key}`)?.click()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isApproved
                        ? "border-green-300 bg-green-50 cursor-not-allowed opacity-75"
                        : isRejected
                          ? "border-red-300 bg-red-50 cursor-pointer hover:border-red-400"
                          : isUploaded
                            ? "border-teal-500 bg-teal-50 cursor-pointer"
                            : uploadError
                              ? "border-orange-300 bg-orange-50 cursor-pointer hover:border-orange-400"
                              : "border-gray-300 hover:border-teal-500 cursor-pointer"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {/* Icon based on status */}
                        {isApproved ? (
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        ) : isRejected ? (
                          <XCircle className="w-8 h-8 text-red-600" />
                        ) : uploadError ? (
                          <AlertCircle className="w-8 h-8 text-orange-600" />
                        ) : isUploaded ? (
                          <CheckCircle className="w-8 h-8 text-teal-500" />
                        ) : isUploading ? (
                          <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}

                        {/* Document label */}
                        <p className="text-sm font-medium text-gray-900">
                          {docType.label}
                        </p>

                        {/* Status message */}
                        {isApproved ? (
                          <div className="space-y-1">
                            <p className="text-xs text-green-700 font-medium">
                              ✓ Verified - No changes needed
                            </p>
                            <p className="text-xs text-green-600">
                              {existingDoc?.originalName}
                            </p>
                          </div>
                        ) : isRejected ? (
                          <div className="space-y-1">
                            <p className="text-xs text-red-700 font-semibold">
                              Rejected - Please re-upload
                            </p>
                            <p className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                              {existingDoc?.rejectionReason || 'Document needs correction'}
                            </p>
                            <p className="text-xs text-blue-600 font-medium mt-1">
                              Click to upload new document
                            </p>
                          </div>
                        ) : uploadError ? (
                          <div className="space-y-1">
                            <p className="text-xs text-orange-700 font-semibold">
                              Upload Error
                            </p>
                            <p className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                              {uploadError}
                            </p>
                          </div>
                        ) : isPending ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 justify-center">
                              <Clock className="w-3 h-3 text-yellow-600" />
                              <p className="text-xs text-yellow-700 font-medium">
                                Under Review
                              </p>
                            </div>
                            <p className="text-xs text-yellow-600">
                              {existingDoc?.originalName}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">
                            {isUploaded
                              ? `✓ ${docState.file?.name || 'Document uploaded'}`
                              : isUploading
                                ? "Uploading..."
                                : "Click to upload or drag & drop"}
                          </p>
                        )}
                      </div>
                    </div>
                    {errors[docType.key] && (
                      <p className="text-red-500 text-xs font-medium mt-2">{errors[docType.key]}</p>
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

        {/* Step 5: Availability */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Step 5: Availability & Preferences
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
                Review and Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

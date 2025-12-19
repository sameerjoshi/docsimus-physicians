"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoctorOnboarding } from "../../doctor-onboarding/hooks/useDoctorOnboarding";
import { Home, Calendar, Users, DollarSign, Settings, Bell, Video } from "lucide-react";
export default function DoctorRegistrationPage() {
  const router = useRouter();
  const {
    state,
    updateProfile,
    updateProfessional,
    updateDocument,
    updateAvailability,
    setStatus,
  } = useDoctorOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form Data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1 (US)");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthYear, setBirthYear] = useState("");

  // Step 2 Form Data
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [council, setCouncil] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Step 3 Form Data
  const [uploadedCount, setUploadedCount] = useState(0);

  // Step 4 Form Data
  const [fee, setFee] = useState("");
  const [languages, setLanguages] = useState("");
  const [bio, setBio] = useState("");
  const [availableNow, setAvailableNow] = useState(false);
  const [weeklyAvailability, setWeeklyAvailability] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });

  useEffect(() => {
    // Load Step 1 data
    setEmail(state.profile.email || state.auth.email);
    const firstName = state.profile.firstName || "";
    const lastName = state.profile.lastName || "";
    setFullName(firstName + (lastName ? " " + lastName : ""));
    setPhone(state.profile.phone || "");

    // Load Step 2 data
    setSpecialization(state.professional.specialization || "");
    setExperience(state.professional.experience || "");
    setCouncil(state.professional.council || "");
    setRegistrationNumber(state.professional.registrationNumber || "");

    // Load Step 3 data
    setUploadedCount(
      Object.values(state.documents).filter(
        (doc) => (doc as any)?.status === "uploaded"
      ).length
    );

    // Load Step 4 data
    setFee(state.availability.fee?.toString() || "");
    setLanguages(state.availability.languages?.join(", ") || "");
    setBio(state.availability.bio || "");
    setAvailableNow(state.availability.availableNow || false);
    if (state.availability.weeklyAvailability) {
      setWeeklyAvailability(state.availability.weeklyAvailability as any);
    }

    setIsHydrated(true);
  }, [state.profile, state.auth, state.professional, state.documents, state.availability]);

  if (!isHydrated) {
    return null;
  }

  // Step validation
  const isStep1Valid = fullName && email && phone && gender && birthYear;
  const isStep2Valid = specialization && experience && council && registrationNumber;
  const isStep3Valid = uploadedCount >= 4;
  const isStep4Valid = fee && languages;

  // Step handlers
  const handleStepClick = (stepNum: number) => {
    // Allow clicking on any step
    setCurrentStep(stepNum);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";
      updateProfile({
        firstName,
        lastName,
        phone,
        email,
      });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      updateProfessional({
        specialization,
        experience,
        council,
        registrationNumber,
      });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      updateAvailability({
        fee: fee as any,
        languages: languages.split(",").map((l) => l.trim()),
        bio,
        availableNow,
        weeklyAvailability: weeklyAvailability as any,
      });
      setStatus("pending");
      router.push("/doctor/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push("/doctor/dashboard");
  };

  const handleDocumentUpload = (key: string) => {
    updateDocument(key as any, {
      fileName: `${key}_file.pdf`,
      previewUrl: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`,
    });
    setUploadedCount(uploadedCount + 1);
  };

  const stepTitles = [
    { title: "Step 1: Personal Profile", description: "Provide your basic personal information and a profile photo." },
    { title: "Step 2: Professional Credentials", description: "Tell us about your medical qualifications and experience." },
    { title: "Step 3: Documents", description: "Upload required documents for verification." },
    { title: "Step 4: Availability & Fee", description: "Set your availability and consultation fee." },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Step Indicator */}
      <div style={styles.stepIndicatorContainer}>
        <div style={styles.stepIndicator}>
          {[
            { num: 1, label: "Profile" },
            { num: 2, label: "Credentials" },
            { num: 3, label: "Documents" },
            { num: 4, label: "Availability" },
          ].map((step, idx) => (
            <div key={step.num} style={styles.stepItem}>
              <button
                type="button"
                onClick={() => handleStepClick(step.num)}
                style={{
                  ...styles.stepNumber,
                  ...(step.num === currentStep ? styles.stepNumberActive : {}),
                  cursor: "pointer",
                }}
              >
                {step.num}
              </button>
              <span
                onClick={() => handleStepClick(step.num)}
                style={{
                  ...styles.stepLabel,
                  ...(step.num === currentStep ? styles.stepLabelActive : {}),
                  cursor: "pointer",
                }}
              >
                {step.label}
              </span>
              {idx < 3 && <div style={styles.stepLine}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.stepTitle}>{stepTitles[currentStep - 1].title}</h1>
          <p style={styles.stepDescription}>{stepTitles[currentStep - 1].description}</p>
        </div>

        {/* STEP 1: Personal Profile */}
        {currentStep === 1 && (
          <>
            {/* Photo Upload Section */}
            <div style={styles.photoSection}>
              <div style={styles.photoPlaceholder}>
                <div style={styles.photoInitials}>
                  {fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "JD"}
                </div>
                <div style={styles.photoEditIcon}>📷</div>
              </div>
              <p style={styles.photoText}>Upload your professional photo</p>
            </div>

            {/* Form */}
            <form style={styles.form}>
              {/* Full Name and Email */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    placeholder="jane.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.inputDisabled}
                    disabled
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <div style={styles.phoneInput}>
                    <select
                      style={styles.phoneCode}
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                    >
                      <option>+1 (US)</option>
                      <option>+44 (UK)</option>
                      <option>+91 (India)</option>
                      <option>+86 (China)</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="e.g., 555-123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={styles.phoneInputField}
                    />
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <div style={styles.genderButtons}>
                  {["Male", "Female", "Non-binary", "Prefer not to say"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setGender(option)}
                      style={{
                        ...styles.genderButton,
                        ...(gender === option
                          ? styles.genderButtonActive
                          : styles.genderButtonInactive),
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of Birth Year */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Date of Birth Year</label>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 76 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handleSkip}
                  style={styles.buttonSecondary}
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  style={styles.buttonPrimary}
                >
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 2: Professional Credentials */}
        {currentStep === 2 && (
          <>
            <form style={styles.form}>
              {/* Specialization and Experience */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select specialization</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Years of Experience</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select experience</option>
                    <option value="0-5">0-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10-15">10-15 years</option>
                    <option value="15+">15+ years</option>
                  </select>
                </div>
              </div>

              {/* Medical Council and Registration */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Medical Council</label>
                  <select
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select medical council</option>
                    <option value="USMLE">USMLE</option>
                    <option value="GMC">GMC</option>
                    <option value="MCI">MCI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g., REG-123456"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handlePrevious}
                  style={styles.buttonSecondary}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  style={styles.buttonPrimary}
                >
                  Next
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 3: Documents */}
        {currentStep === 3 && (
          <>
            <div style={styles.form}>
              <p style={{ fontSize: "14px", color: "#666", margin: "0 0 24px 0" }}>
                Upload the following documents for verification (all required):
              </p>
              {[
                { key: "medical_degree", label: "Medical Degree Certificate" },
                { key: "license", label: "Medical License" },
                { key: "id_proof", label: "ID Proof" },
                { key: "registration_proof", label: "Registration Proof" },
              ].map((doc) => (
                <div
                  key={doc.key}
                  style={{
                    padding: "16px",
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "500", margin: "0", color: "#1A1A1A" }}>
                      {doc.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDocumentUpload(doc.key)}
                    style={{
                      padding: "8px 16px",
                      background: "#00B368",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Upload
                  </button>
                </div>
              ))}

              <p style={{ fontSize: "13px", color: "#999", margin: "24px 0 0 0" }}>
                Uploaded: {uploadedCount}/4
              </p>

              {/* Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handlePrevious}
                  style={styles.buttonSecondary}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  style={styles.buttonPrimary}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 4: Availability & Fee */}
        {currentStep === 4 && (
          <>
            <form style={styles.form}>
              {/* Fee and Languages */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Consultation Fee (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Languages</label>
                  <input
                    type="text"
                    placeholder="e.g., English, Spanish"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Bio */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{
                    ...styles.input,
                    minHeight: "100px",
                    fontFamily: "inherit",
                  } as React.CSSProperties}
                />
              </div>

              {/* Availability */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Available Now?</label>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAvailableNow(true)}
                    style={{
                      ...styles.genderButton,
                      ...(availableNow
                        ? styles.genderButtonActive
                        : styles.genderButtonInactive),
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvailableNow(false)}
                    style={{
                      ...styles.genderButton,
                      ...(!availableNow
                        ? styles.genderButtonActive
                        : styles.genderButtonInactive),
                    }}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Weekly Availability */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Weekly Availability</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                  }}
                >
                  {Object.keys(weeklyAvailability).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        setWeeklyAvailability({
                          ...weeklyAvailability,
                          [day]: !weeklyAvailability[day as keyof typeof weeklyAvailability],
                        })
                      }
                      style={{
                        ...styles.genderButton,
                        ...(weeklyAvailability[day as keyof typeof weeklyAvailability]
                          ? styles.genderButtonActive
                          : styles.genderButtonInactive),
                      }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={handlePrevious}
                  style={styles.buttonSecondary}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  style={styles.buttonPrimary}
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: "100vh",
    background: "#F5F5F5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    position: "relative",
    width: "896px",
    background: "#FFFFFF",
    borderRadius: "14px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.07)",
    padding: "48px",
  },
  header: {
    marginBottom: "32px",
  },
  stepTitle: {
    fontSize: "32px",
    fontWeight: "600",
    lineHeight: "1.2",
    color: "#000000",
    margin: "0 0 8px 0",
  },
  stepDescription: {
    fontSize: "14px",
    color: "#808080",
    margin: "0",
  },
  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "40px",
  },
  photoPlaceholder: {
    position: "relative",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#F0E6F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  },
  photoInitials: {
    fontSize: "48px",
    fontWeight: "600",
    color: "#9C7FB8",
  },
  photoEditIcon: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "32px",
    height: "32px",
    background: "#00B368",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
  },
  photoText: {
    fontSize: "14px",
    color: "#B0B0B0",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1A1A1A",
    margin: "0",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1A1A1A",
    outline: "none",
  },
  inputDisabled: {
    padding: "12px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#B0B0B0",
    background: "#F9F9F9",
    outline: "none",
  },
  phoneInput: {
    display: "flex",
    gap: "8px",
  },
  phoneCode: {
    padding: "12px 10px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    color: "#1A1A1A",
    width: "140px",
    outline: "none",
  },
  phoneInputField: {
    flex: 1,
    padding: "12px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1A1A1A",
    outline: "none",
  },
  genderButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  genderButton: {
    padding: "10px 16px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    background: "transparent",
  },
  genderButtonActive: {
    background: "#00B368",
    color: "#FFFFFF",
    border: "1px solid #00B368",
  },
  genderButtonInactive: {
    color: "#1A1A1A",
  },
  select: {
    padding: "12px 14px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#1A1A1A",
    background: "#FFFFFF",
    outline: "none",
  },
  buttonContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  buttonSecondary: {
    padding: "12px 24px",
    border: "1px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    background: "#FFFFFF",
    color: "#1A1A1A",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  buttonPrimary: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    background: "#00B368",
    color: "#FFFFFF",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  buttonDisabled: {
    background: "#D0D0D0",
    cursor: "not-allowed",
  },
  stepIndicatorContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
  },
  stepIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
  },
  stepNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #D0D0D0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "600",
    color: "#999999",
  },
  stepNumberActive: {
    borderColor: "#00B368",
    backgroundColor: "#00B368",
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: "14px",
    color: "#999999",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: "#00B368",
    fontWeight: "600",
  },
  stepLine: {
    position: "absolute",
    left: "60px",
    width: "60px",
    height: "2px",
    background: "#D0D0D0",
  },
};

'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/src/hooks/use-onboarding';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '@/src/lib/animations';
import { CheckCircle, Edit, MapPin, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewPage() {
  const router = useRouter();
  const { state, submitApplication, loading } = useOnboarding();

  const handleSubmit = async () => {
    const success = await submitApplication();
    if (success) {
      toast.success('Application submitted successfully!');
      router.push('/dashboard');
    } else {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleEdit = (step: number) => {
    router.push(`/registration?step=${step}`);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Review Your Application
          </h1>
          <p className="text-muted-foreground">
            Please review all information before submitting
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Personal Information */}
          <motion.div variants={staggerItem}>
            <Card className="p-6 border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(1)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">{state.profile.firstName} {state.profile.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{state.profile.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{state.profile.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date of Birth</p>
                  <p className="font-medium">{state.profile.dob ? new Date(state.profile.dob).toLocaleDateString() : 'Not provided'}</p>
                </div>
                {state.address.addressLine1 && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="font-medium">
                      {state.address.addressLine1}
                      {state.address.addressLine2 && `, ${state.address.addressLine2}`}
                      <br />
                      {state.address.city}, {state.address.state} {state.address.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Professional Credentials */}
          <motion.div variants={staggerItem}>
            <Card className="p-6 border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Professional Credentials</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(2)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Specialization</p>
                  <p className="font-medium">{state.professional.specialization || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Experience</p>
                  <p className="font-medium">{state.professional.experience || 'Not provided'} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Medical Council</p>
                  <p className="font-medium">{state.professional.council || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Registration Number</p>
                  <p className="font-medium">{state.professional.registrationNumber || 'Not provided'}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Availability & Preferences */}
          <motion.div variants={staggerItem}>
            <Card className="p-6 border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Availability & Preferences</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(4)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Consultation Fee:</p>
                  <p className="font-medium">₹{state.availability.fee || '0'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {state.availability.languages?.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                {state.availability.bio && (
                  <div>
                    <p className="text-muted-foreground mb-2">Bio</p>
                    <p className="font-medium text-foreground/90">{state.availability.bio}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={staggerItem} className="flex gap-4 justify-center pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="min-w-[150px]"
            >
              Go Back
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[150px] bg-primary hover:bg-primary/90"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </motion.div>

          {/* Info Note */}
          <motion.div variants={staggerItem}>
            <Card className="p-4 bg-muted/50 border-primary/20">
              <p className="text-sm text-center text-muted-foreground">
                By submitting, you confirm that all information provided is accurate and complete.
                Your application will be reviewed within 24-48 hours.
              </p>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

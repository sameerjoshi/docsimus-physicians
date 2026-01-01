'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { LoadingSpinner } from '@/src/components/loading-spinner';
import {
  User, Mail, Phone, MapPin, Briefcase, DollarSign, Globe,
  FileText, CheckCircle, Clock, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';
import { toast } from 'sonner';
import { useProfile } from '@/src/hooks/use-profile';
import { RouteGuard } from '@/src/components/RouteGuard';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

  const { profile, fetchProfile, updateProfile } = useProfile();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchProfile();
      setForm(data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <RouteGuard>
        <AppHeader />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </RouteGuard>
    );
  }

  const isPending = profile?.status === 'PENDING';

  return (
    <RouteGuard>
      <AppHeader />
      <div className="min-h-screen bg-background">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl"
        >
          {/* Profile Under Review Banner */}
          {isPending && (
            <motion.div variants={staggerItem} className="mb-6">
              <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Profile is Under Review</h2>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                      Thank you for completing your registration. We are reviewing your information.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full max-w-3xl mt-4">
                    {[
                      { label: 'Personal Info', verified: true },
                      { label: 'Medical License', verified: false },
                      { label: 'Identity', verified: true },
                      { label: 'Credentials', verified: false },
                      { label: 'Availability', verified: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 p-2 bg-background rounded-lg border">
                        {item.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-600" />
                        )}
                        <span className="text-xs font-medium truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Expected review time: 24-48 hours</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Header */}
          <motion.div variants={staggerItem}>
            <Card className="p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      Dr. {profile?.firstName} {profile?.lastName}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                      {profile?.specialization || 'General Physician'}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 mt-2 rounded-full text-xs font-medium ${isPending
                      ? 'bg-amber-600 text-white'
                      : 'bg-green-600 text-white'
                      }`}>
                      {isPending ? <><Clock className="h-3 w-3" /> Under Review</> : <><CheckCircle className="h-3 w-3" /> Verified</>}
                    </span>
                  </div>
                </div>
                {/* <Button
                  variant={editing ? 'default' : 'outline'}
                  onClick={() => (editing ? handleSave() : setEditing(true))}
                  className="w-full sm:w-auto"
                >
                  {editing ? <><Save className="h-4 w-4 mr-2" /> Save</> : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
                </Button> */}
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2">First Name</Label>
                    {editing ? (
                      <Input value={form.firstName || ''} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm mb-2">Last Name</Label>
                    {editing ? (
                      <Input value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.lastName}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm mb-2 flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                    <p className="text-sm text-muted-foreground">{profile?.user?.email}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm mb-2 flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</Label>
                    {editing ? (
                      <Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.phone}</p>
                    )}
                  </div>
                  {profile?.addressLine1 && (
                    <div className="sm:col-span-2">
                      <Label className="text-sm mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</Label>
                      <p className="text-sm text-muted-foreground">
                        {profile.addressLine1}{profile.addressLine2 && `, ${profile.addressLine2}`}<br />
                        {profile.city}, {profile.state} {profile.postalCode}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Professional Information */}
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">Professional Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2">Specialization</Label>
                    {editing ? (
                      <Input value={form.specialization || ''} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.specialization}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm mb-2">Experience</Label>
                    {editing ? (
                      <Input value={form.experience || ''} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile?.experience} years</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm mb-2">Registration Number</Label>
                    <p className="text-sm text-muted-foreground">{profile?.registrationNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm mb-2">Medical Council</Label>
                    <p className="text-sm text-muted-foreground">{profile?.council}</p>
                  </div>
                </div>
              </Card>

              {/* Bio */}
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold">About</h2>
                </div>
                {editing ? (
                  <textarea
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
                    value={form.bio || ''}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell patients about yourself..."
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{profile?.bio || 'No bio provided'}</p>
                )}
              </Card>
            </motion.div>

            {/* Right Column */}
            <motion.div variants={staggerItem} className="space-y-6">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Consultation Fee</h2>
                </div>
                <p className="text-3xl font-bold text-primary">₹{profile?.consultationFee ? profile.consultationFee / 100 : 0}</p>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-lg font-semibold">Languages</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile?.languages?.map((lang: string) => (
                    <span key={lang} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </RouteGuard>
  );
}

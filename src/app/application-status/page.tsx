'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { LoadingSpinner } from '@/src/components/loading-spinner';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '@/src/hooks/use-profile';
import { RouteGuard } from '@/src/components/RouteGuard';

export default function ApplicationStatusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const status = profile?.status;

  const getStatusInfo = () => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          iconColor: 'text-amber-600',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          title: 'Application Under Review',
          message: 'Your application is currently being reviewed by our team.',
          subMessage: 'This typically takes 24-48 hours. We\'ll notify you via email once completed.',
        };
      case 'VERIFIED':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          title: 'Application Approved!',
          message: 'Congratulations! Your application has been approved.',
          subMessage: 'You can now access your dashboard and start consultations.',
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          title: 'Application Rejected',
          message: 'Unfortunately, your application was not approved.',
          subMessage: profile?.rejectionReason || 'Please review the feedback and resubmit your application.',
        };
      default:
        return {
          icon: AlertCircle,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          title: 'Application Status Unknown',
          message: 'Unable to determine application status.',
          subMessage: 'Please contact support for assistance.',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`p-6 sm:p-8 ${statusInfo.bgColor} border-2 ${statusInfo.borderColor}`}>
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${statusInfo.bgColor} flex items-center justify-center mb-4`}>
                  <StatusIcon className={`h-8 w-8 sm:h-10 sm:w-10 ${statusInfo.iconColor}`} />
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {statusInfo.title}
                </h1>

                {/* Message */}
                <p className="text-base sm:text-lg text-muted-foreground mb-4">
                  {statusInfo.message}
                </p>

                {/* Sub Message */}
                <p className="text-sm text-muted-foreground mb-6">
                  {statusInfo.subMessage}
                </p>

                {/* Submission Date */}
                {profile?.submittedAt && (
                  <div className="text-sm text-muted-foreground mb-6">
                    <p>
                      Submitted on:{' '}
                      {new Date(profile.submittedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Verification Date (if approved) */}
                {status === 'VERIFIED' && profile?.verifiedAt && (
                  <div className="text-sm text-muted-foreground mb-6">
                    <p>
                      Approved on:{' '}
                      {new Date(profile.verifiedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
                  {status === 'VERIFIED' && (
                    <Button
                      onClick={() => router.push('/dashboard')}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Go to Dashboard
                    </Button>
                  )}

                  {status === 'REJECTED' && (
                    <Button
                      onClick={() => router.push('/registration')}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Resubmit Application
                    </Button>
                  )}

                  {status === 'PENDING' && (
                    <Button
                      onClick={() => router.push('/profile')}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      View Profile
                    </Button>
                  )}
                </div>

                {/* Contact Support */}
                <div className="mt-8 pt-6 border-t border-border w-full">
                  <p className="text-sm text-muted-foreground">
                    Have questions?{' '}
                    <a href="mailto:support@docsimus.com" className="text-primary hover:underline">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </RouteGuard>
  );
}

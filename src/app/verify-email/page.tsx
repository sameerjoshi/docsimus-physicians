'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { LoadingSpinner } from '@/src/components/loading-spinner';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/src/lib/animations';
import { useAuth } from '@/src/hooks/use-auth';
import { GuardLevel, RouteGuard } from '@/src/components/RouteGuard';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleVerifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      try {
        // Call the verification API via hook
        const success = await verifyEmail(token);

        if (success) {
          setStatus('success');
          setMessage('Your email has been successfully verified!');

          // Redirect to registration after 2 seconds
          setTimeout(() => {
            router.push('/registration');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Failed to verify email. The link may have expired.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may have expired.');
      }
    };

    handleVerifyEmail();
  }, [searchParams, router, verifyEmail]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-md"
      >
        <Card className="p-8 text-center">
          {status === 'loading' && (
            <>
              <LoadingSpinner size="lg" className="mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Verifying your email...</h2>
              <p className="text-muted-foreground">Please wait while we confirm your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <p className="text-sm text-muted-foreground">Redirecting to registration...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Verification Failed</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/signup')}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Verification Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <RouteGuard level={GuardLevel.AUTHENTICATED}>
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </RouteGuard>
  );
}

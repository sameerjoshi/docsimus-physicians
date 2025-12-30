"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { FileText, MapPin, Phone, User, ArrowRight, Calendar, Check, X, Download } from "lucide-react";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { SectionCard } from "@/src/components/admin/SectionCard";
import { Button, Card } from "@/src/components/ui";
import { formatDate } from "@/src/lib/utils";
import { reviewerService, type ReviewerApplication } from "@/src/services/reviewer.service";
import { LoadingSpinner } from "@/src/components/loading-spinner";
import { API_CONFIG } from "@/src/lib/api-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ applicationId: string }>;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    'PENDING': { label: 'Under Review', className: 'bg-blue-100 text-blue-700' },
    'VERIFIED': { label: 'Verified', className: 'bg-green-100 text-green-700' },
    'REJECTED': { label: 'Rejected', className: 'bg-red-100 text-red-700' },
    'APPROVED': { label: 'Approved', className: 'bg-green-100 text-green-700' },
  };

  const config = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${config.className}`}>
      {config.label}
    </span>
  );
};

export default function ApplicationDetailPage({ params }: PageProps) {
  // Unwrap the Promise using React.use() - required in Next.js 15+
  const { applicationId } = use(params);

  const [application, setApplication] = useState<ReviewerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Rejection modal state
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    type: 'document' | 'application';
    documentId?: string;
    documentName?: string;
    reason: string;
  }>({
    isOpen: false,
    type: 'document',
    reason: '',
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    variant?: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const data = await reviewerService.getApplicationDetails(applicationId);
      setApplication(data);
    } catch (err: any) {
      console.error('Failed to load application:', err);
      setError(err.message || 'Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!application || actionLoading) return;

    // Check if all documents are approved
    const pendingDocs = application.documents.filter(doc => doc.status === 'PENDING');
    const rejectedDocs = application.documents.filter(doc => doc.status === 'REJECTED');

    if (pendingDocs.length > 0) {
      setConfirmModal({
        isOpen: true,
        title: 'Cannot Approve Yet',
        message: 'All documents must be reviewed before approving the application.',
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
      });
      return;
    }

    if (rejectedDocs.length > 0) {
      setConfirmModal({
        isOpen: true,
        title: 'Cannot Approve',
        message: 'Cannot approve application with rejected documents. Please reject the rejected documents first or have the doctor resubmit.',
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
        confirmText: 'OK',
        variant: 'destructive',
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Approve Application',
      message: `Are you sure you want to approve ${application.firstName} ${application.lastName}'s application? This will grant them access to start consultations.`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        try {
          setActionLoading(true);
          await reviewerService.approveApplication(applicationId);
          await loadApplication();
          setConfirmModal({
            isOpen: true,
            title: 'Success!',
            message: 'Application approved successfully! The doctor can now start consultations.',
            onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
          });
        } catch (err: any) {
          setConfirmModal({
            isOpen: true,
            title: 'Error',
            message: err.message || 'Failed to approve application',
            onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
            confirmText: 'OK',
            variant: 'destructive',
          });
        } finally {
          setActionLoading(false);
        }
      },
      confirmText: 'Yes, Approve',
    });
  };

  const handleReject = () => {
    if (!application || actionLoading) return;

    // Open rejection modal for application
    setRejectionModal({
      isOpen: true,
      type: 'application',
      documentName: `${application.firstName} ${application.lastName}'s Application`,
      reason: '',
    });
  };

  const handleDocumentStatusUpdate = async (documentId: string, documentName: string, status: 'APPROVED' | 'REJECTED') => {
    if (actionLoading) return;

    if (status === 'REJECTED') {
      // Open rejection modal for document
      setRejectionModal({
        isOpen: true,
        type: 'document',
        documentId,
        documentName,
        reason: '',
      });
    } else {
      // Approve document - show confirmation
      setConfirmModal({
        isOpen: true,
        title: 'Approve Document',
        message: `Are you sure you want to approve "${documentName}"?`,
        onConfirm: async () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          try {
            setActionLoading(true);
            await reviewerService.updateDocumentStatus(applicationId, documentId, {
              status: 'APPROVED',
            });
            await loadApplication();
          } catch (err: any) {
            setConfirmModal({
              isOpen: true,
              title: 'Error',
              message: err.message || 'Failed to approve document',
              onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
              confirmText: 'OK',
              variant: 'destructive',
            });
          } finally {
            setActionLoading(false);
          }
        },
        confirmText: 'Yes, Approve',
      });
    }
  };

  const handleRejectionSubmit = async () => {
    const { type, documentId, reason } = rejectionModal;

    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);

      if (type === 'document' && documentId) {
        // Reject document
        await reviewerService.updateDocumentStatus(applicationId, documentId, {
          status: 'REJECTED',
          rejectionReason: reason,
        });
      } else if (type === 'application') {
        // Reject application
        await reviewerService.rejectApplication(applicationId, {
          rejectionReason: reason,
        });
      }

      await loadApplication();
      setRejectionModal({ isOpen: false, type: 'document', reason: '' });
      toast.success(`${type === 'document' ? 'Document' : 'Application'} rejected successfully`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDocument = async (docId: string) => {
    try {
      // Get the auth token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to view documents');
        return;
      }

      // Fetch the document with authentication
      const documentUrl = `${API_CONFIG.baseURL}/reviewer/applications/${applicationId}/documents/${docId}/file`;
      const response = await fetch(documentUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.statusText}`);
      }

      // Create a blob from the response
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Open in new tab
      window.open(blobUrl, '_blank');

      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error: any) {
      console.error('Error viewing document:', error);
      toast.error(error.message || 'Failed to load document');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8">
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700">{error || 'Application not found'}</p>
          <Button onClick={loadApplication} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  // Extract data from application
  const doctorName = `${application.firstName} ${application.lastName}`;
  const applicationStatus = application.status;
  const documents = application.documents;

  return (
    <div className="space-y-6 pb-32">
      {/* Back Button - Mobile */}
      <div className="md:hidden">
        <Link href="/review/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Applications
        </Link>
      </div>

      <ApplicationHeader
        title={`${doctorName}'s Application`}
        description="Review submission details, verify documents, and approve or reject the application."
        actions={<StatusBadge status={applicationStatus} />}
      />

      {/* Application Summary Card */}
      <SectionCard
        title="Application Summary"
        description="High-level details provided by the physician."
      >
        <div className="space-y-4">
          {/* Doctor Info Card */}
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{doctorName}</p>
              <p className="text-sm text-muted-foreground truncate">{application.email}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">{application.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">Registration: {application.registrationNumber}</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">Submitted {formatDate(application.submittedAt)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">Status:</span>
              <StatusBadge status={applicationStatus} />
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <div className="p-3 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Council</p>
              <p className="text-sm font-medium">{application.council}</p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Specialization</p>
              <p className="text-sm font-medium">{application.specialization}</p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Experience</p>
              <p className="text-sm font-medium">{application.experience} years</p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
              <p className="text-sm font-medium">{formatDate(application.dob)}</p>
            </div>
          </div>

          {/* Address Section */}
          {(application.addressLine1 || application.city || application.state) && (
            <div className="p-4 border border-border rounded-lg bg-secondary/30 mt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Address</p>
              <div className="space-y-1">
                {application.addressLine1 && (
                  <p className="text-sm">{application.addressLine1}</p>
                )}
                {application.addressLine2 && (
                  <p className="text-sm">{application.addressLine2}</p>
                )}
                {(application.city || application.state || application.postalCode) && (
                  <p className="text-sm">
                    {[application.city, application.state, application.postalCode].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Documents Section */}
      <SectionCard
        title="Documents"
        description="Review and verify uploaded documents."
      >
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No documents uploaded
          </div>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{doc.originalName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={doc.status} />
                      <span className="text-xs text-muted-foreground">• {doc.type}</span>
                    </div>
                    {doc.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">Reason: {doc.rejectionReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.status === 'PENDING' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDocumentStatusUpdate(doc.id, doc.originalName, 'APPROVED')}
                        disabled={actionLoading}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDocumentStatusUpdate(doc.id, doc.originalName, 'REJECTED')}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocument(doc.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground">Application Actions</p>
              <p className="text-xs text-muted-foreground">
                {applicationStatus === 'PENDING'
                  ? 'Review all documents before making a final decision'
                  : `Application ${String(applicationStatus).toLowerCase()}`
                }
              </p>
            </div>

            {/* Action Buttons */}
            {applicationStatus === 'PENDING' && (
              <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : 'Approve Application'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 md:flex-none"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : 'Reject Application'}
                </Button>
              </div>
            )}
            {applicationStatus !== 'PENDING' && (
              <div className="flex items-center gap-2">
                <StatusBadge status={applicationStatus} />
                <span className="text-sm text-muted-foreground">
                  This application has been finalized
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <Dialog open={rejectionModal.isOpen} onOpenChange={(open) => {
        if (!open) {
          setRejectionModal({ isOpen: false, type: 'document', reason: '' });
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {rejectionModal.type === 'document' ? 'Reject Document' : 'Reject Application'}
            </DialogTitle>
            <DialogDescription>
              You are rejecting: <strong>{rejectionModal.documentName}</strong>
              <br />
              Please provide a detailed reason so the doctor knows what needs to be corrected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="rejectionReason"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter detailed reason for rejection..."
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                disabled={actionLoading}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what needs to be corrected or re-submitted.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionModal({ isOpen: false, type: 'document', reason: '' })}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectionSubmit}
              disabled={actionLoading || !rejectionModal.reason.trim()}
            >
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={confirmModal.isOpen} onOpenChange={(open) => {
        if (!open) {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{confirmModal.title}</DialogTitle>
            <DialogDescription>
              {confirmModal.message}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            {confirmModal.confirmText !== 'OK' && (
              <Button
                variant="outline"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              variant={confirmModal.variant || 'default'}
              onClick={confirmModal.onConfirm}
              disabled={actionLoading}
            >
              {confirmModal.confirmText || 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

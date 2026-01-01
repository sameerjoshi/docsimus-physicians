'use client';

import { useState, useEffect } from "react";
import { ApplicationHeader } from "@/src/components/admin/ApplicationHeader";
import { Card, Button } from "@/src/components/ui";
import { UserPlus, Mail, FileText, MoreVertical, CheckCircle, Clock } from "lucide-react";
import { adminService, type Reviewer } from "@/src/services/admin.service";
import { LoadingSpinner } from "@/src/components/loading-spinner";
import { AddReviewerModal } from "@/src/components/admin/AddReviewerModal";
import { GuardLevel, Role, RouteGuard } from "@/src/components/RouteGuard";

export default function ReviewersPage() {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadReviewers();
  }, []);

  const loadReviewers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReviewers();
      setReviewers(data);
    } catch (err: any) {
      console.error('Failed to load reviewers:', err);
      setError(err.message || 'Failed to load reviewers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RouteGuard level={GuardLevel.EMAIL_VERIFIED} role={Role.ADMIN}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard level={GuardLevel.EMAIL_VERIFIED} role={Role.ADMIN}>
        <div className="p-8">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
            <Button onClick={loadReviewers} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </RouteGuard>
    );
  }

  const activeReviewers = reviewers.filter(r => (r._count?.reviewingApplications || 0) > 0);
  const totalActiveReviews = reviewers.reduce((sum, r) => sum + (r._count?.reviewingApplications || 0), 0);

  return (
    <RouteGuard level={GuardLevel.EMAIL_VERIFIED} role={Role.ADMIN}>
      <div className="space-y-6">
        {/* Header */}
        <ApplicationHeader
          title="Reviewers Management"
          description="Manage review team members and track their workload."
        />

        {/* Stats Summary - More compact on mobile */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">{reviewers.length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{activeReviewers.length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Active</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalActiveReviews}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Reviews</p>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold">{reviewers.length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Team</p>
          </Card>
        </div>

        {/* Reviewers List Header with Add Button */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">All Reviewers</h3>
          <Button size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Reviewer</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-muted-foreground">Reviewer</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Active</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Completed</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-muted-foreground">Last Active</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviewers.map((reviewer) => (
                  <tr key={reviewer.id} className="hover:bg-secondary/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {reviewer.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{reviewer.name || reviewer.email}</p>
                          <p className="text-xs text-muted-foreground">{reviewer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${(reviewer._count?.reviewingApplications || 0) > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {(reviewer._count?.reviewingApplications || 0) > 0 ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {(reviewer._count?.reviewingApplications || 0) > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-semibold text-primary">{reviewer._count?.reviewingApplications || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-medium">—</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                      {new Date(reviewer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {reviewers.map((reviewer) => {
            // Compute properties that don't exist on the Reviewer type
            const initials = reviewer.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || reviewer.email.slice(0, 2).toUpperCase();
            const activeReviews = reviewer._count?.reviewingApplications || 0;
            const status = activeReviews > 0 ? 'Active' : 'Inactive';
            const lastActive = new Date(reviewer.createdAt).toLocaleDateString();

            return (
              <Card key={reviewer.id} className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{reviewer.name || reviewer.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{reviewer.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {status}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 bg-secondary/50 rounded-lg text-center">
                    <p className="text-lg font-bold text-primary">{activeReviews}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Active</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg text-center">
                    <p className="text-lg font-bold">—</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Completed</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded-lg text-center">
                    <p className="text-xs font-medium text-muted-foreground">{lastActive}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Last Active</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                    <FileText className="h-4 w-4" />
                    Work
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add Reviewer Modal */}
        <AddReviewerModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadReviewers}
        />
      </div>
    </RouteGuard>
  );
}

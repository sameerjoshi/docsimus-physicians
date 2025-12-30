'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { Button, Input } from '@/src/components/ui';
import { adminService } from '@/src/services/admin.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddReviewerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddReviewerModal({ open, onClose, onSuccess }: AddReviewerModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        setLoading(true);
        try {
            await adminService.addReviewer(email.trim());
            toast.success('Reviewer added successfully!');
            setEmail('');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to add reviewer:', error);
            toast.error(error.message || 'Failed to add reviewer');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setEmail('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Reviewer</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the user you want to promote to reviewer role.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                            The user with this email will be promoted to reviewer role.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className="gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Add Reviewer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

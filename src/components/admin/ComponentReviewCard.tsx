"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { StatusBadge } from "./StatusBadge";
import { Checklist } from "./Checklist";
import { CommentBox } from "./CommentBox";
import { ApplicationComponent, ComponentStatus } from "@/src/types/admin";
import { formatDate } from "@/src/lib/utils";

interface ComponentReviewCardProps {
  component: ApplicationComponent;
  onDecision: (componentId: string, status: ComponentStatus, comment: string) => void;
}

export function ComponentReviewCard({ component, onDecision }: ComponentReviewCardProps) {
  const [comment, setComment] = useState("");

  const handleDecision = (status: ComponentStatus) => {
    if (!comment.trim()) return;
    onDecision(component.id, status, comment.trim());
    setComment("");
  };

  const isActionDisabled = !comment.trim();

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-semibold">{component.title}</CardTitle>
            <StatusBadge status={component.status} />
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Component verification checklist
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
        <div className="space-y-6">
          <Checklist items={component.checklist} />

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Comment History</p>
            <div className="space-y-3 rounded-[var(--radius)] border border-card-border bg-secondary/60 p-3">
              {component.comments.map((entry) => (
                <div key={entry.id} className="rounded-[var(--radius-sm)] bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{entry.author}</span>
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{entry.text}</p>
                </div>
              ))}
              {component.comments.length === 0 && (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[var(--radius)] border border-card-border bg-secondary/50 p-4">
          <CommentBox
            label="Add a required review comment"
            required
            placeholder="Leave a note for verification"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <Button
              variant="success"
              className="flex-1 min-w-[140px]"
              disabled={isActionDisabled}
              onClick={() => handleDecision("Verified")}
            >
              <CheckCircle className="h-4 w-4" />
              Verify Component
            </Button>
            <Button
              variant="destructive"
              className="flex-1 min-w-[140px]"
              disabled={isActionDisabled}
              onClick={() => handleDecision("Rejected")}
            >
              <XCircle className="h-4 w-4" />
              Reject Component
            </Button>
          </div>
          {isActionDisabled && (
            <p className="text-xs text-warning">
              A comment is required before verifying or rejecting this component.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

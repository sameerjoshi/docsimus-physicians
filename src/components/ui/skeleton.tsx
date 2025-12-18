import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted-foreground/20",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 rounded",
        variant === "default" && "rounded-[var(--radius)]",
        className
      )}
      {...props}
    />
  );
}

// Pre-built skeleton patterns for common use cases
export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius)] border border-card-border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function AvatarSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" | "xl" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-card-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

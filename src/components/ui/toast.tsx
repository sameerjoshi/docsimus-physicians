"use client";

import { cn } from "@/src/lib/utils";
import { X } from "lucide-react";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  default: "bg-card border-card-border",
  success: "bg-success-light border-success text-success",
  warning: "bg-warning-light border-warning text-warning",
  danger: "bg-danger-light border-danger text-danger",
  info: "bg-info-light border-info text-info",
};

export function Toast({ title, description, variant = "default", onClose, className }: ToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-[var(--radius)] border shadow-lg",
        variantStyles[variant],
        className
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            {title && <p className="text-sm font-medium">{title}</p>}
            {description && (
              <p className={cn("mt-1 text-sm", variant === "default" ? "text-muted-foreground" : "opacity-90")}>
                {description}
              </p>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 inline-flex shrink-0 rounded-[var(--radius-sm)] p-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { getInitials } from "@/src/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  default: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusColors = {
  online: "bg-success",
  offline: "bg-muted-foreground",
  busy: "bg-danger",
  away: "bg-warning",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "default",
  status,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);
  const initials = fallback ? getInitials(fallback) : "?";

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-medium",
          sizeClasses[size]
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            statusColors[status],
            size === "sm" ? "h-2 w-2" : size === "xl" ? "h-4 w-4" : "h-3 w-3"
          )}
        />
      )}
    </div>
  );
}

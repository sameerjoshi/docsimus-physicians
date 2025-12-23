import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ApplicationHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backHref?: string;
  className?: string;
}

export function ApplicationHeader({
  title,
  description,
  actions,
  backHref,
  className,
}: ApplicationHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

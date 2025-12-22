import { TextareaHTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

interface CommentBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  helperText?: string;
}

export function CommentBox({
  label,
  required,
  helperText,
  className,
  ...props
}: CommentBoxProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          "min-h-[96px] w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition",
          className
        )}
        {...props}
      />
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

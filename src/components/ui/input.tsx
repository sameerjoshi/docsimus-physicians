import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, onClick, ...props }, ref) => {
    const isDateOrTime = type === 'date' || type === 'time' || type === 'datetime-local';

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      // Trigger the native picker when clicking anywhere on the input
      if (isDateOrTime) {
        (e.target as HTMLInputElement).showPicker?.();
      }
      onClick?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-danger focus-visible:ring-danger",
          // Date/time picker specific styles
          isDateOrTime && [
            "cursor-pointer",
            // Style the calendar/clock icon
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
            "[&::-webkit-calendar-picker-indicator]:p-0",
            "[&::-webkit-calendar-picker-indicator]:m-0",
            "[&::-webkit-calendar-picker-indicator]:opacity-0",
            // Invert icon in dark mode for visibility
            "dark:[&::-webkit-calendar-picker-indicator]:invert",
          ],
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

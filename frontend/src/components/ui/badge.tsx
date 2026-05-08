import * as React from "react";
import { cn } from "./utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
       default: "bg-black text-white dark:bg-white dark:text-black",
       secondary: "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
       destructive: "bg-red-600 text-white dark:bg-red-700 dark:text-white",
       outline: "border border-gray-300 text-gray-900 dark:border-gray-700 dark:text-gray-100",
    };

    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium w-fit", variants[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
export { Badge };

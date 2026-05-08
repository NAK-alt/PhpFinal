import * as React from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-20 px-3 py-2 border rounded-md text-sm resize-none transition-colors",
        "bg-white text-black border-gray-300 placeholder-gray-600",
        "dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-300",
        "focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:focus:ring-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

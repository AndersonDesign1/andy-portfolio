import React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-light-mini/20 bg-light-bg px-3 py-2 text-light-text text-sm transition-colors duration-300 placeholder:text-light-mini focus:border-light-heading focus:outline-none focus:ring-2 focus:ring-light-heading/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-mini/20 dark:bg-dark-bg dark:text-dark-text dark:focus:border-dark-heading dark:focus:ring-dark-heading/20 dark:placeholder:text-dark-mini",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

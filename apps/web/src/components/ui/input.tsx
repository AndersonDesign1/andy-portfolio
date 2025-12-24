import React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-light-mini/20 bg-light-bg px-3 py-2 text-light-text text-sm transition-colors duration-300 placeholder:text-light-mini focus:border-light-heading focus:outline-none focus:ring-2 focus:ring-light-heading/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-mini/20 dark:bg-dark-bg dark:text-dark-text dark:focus:border-dark-heading dark:focus:ring-dark-heading/20 dark:placeholder:text-dark-mini",
          className
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

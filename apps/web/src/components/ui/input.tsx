import React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentPropsWithRef<"input">;

const Input = ({ className, type, ref, ...props }: InputProps) => (
  <input
    className={cn(
      "border-light-mini/20 bg-light-bg text-light-text placeholder:text-light-mini focus:border-light-heading focus:ring-light-heading/20 dark:border-dark-mini/20 dark:bg-dark-bg dark:text-dark-text dark:focus:border-dark-heading dark:focus:ring-dark-heading/20 dark:placeholder:text-dark-mini flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors duration-300 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    type={type}
    {...props}
  />
);
Input.displayName = "Input";

export { Input };

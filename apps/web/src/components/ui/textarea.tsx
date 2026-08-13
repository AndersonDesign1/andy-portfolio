import React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentPropsWithRef<"textarea">;

const Textarea = ({ className, ref, ...props }: TextareaProps) => (
  <textarea
    className={cn(
      "border-light-mini/20 bg-light-bg text-light-text placeholder:text-light-mini focus:border-light-heading focus:ring-light-heading/20 dark:border-dark-mini/20 dark:bg-dark-bg dark:text-dark-text dark:focus:border-dark-heading dark:focus:ring-dark-heading/20 dark:placeholder:text-dark-mini flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
);
Textarea.displayName = "Textarea";

export { Textarea };

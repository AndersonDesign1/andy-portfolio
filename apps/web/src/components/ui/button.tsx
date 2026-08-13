import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-none text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity,transform,box-shadow,backdrop-filter] duration-150 ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 px-6 py-3",
        icon: "size-10",
        lg: "h-12 px-8 text-base",
        sm: "h-9 px-4",
      },
      variant: {
        default: "bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90",
        destructive: "bg-red-500 text-white hover:bg-red-500/90",
        ghost: "hover:bg-secondary/50 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border-subtle text-primary hover:border-primary hover:bg-secondary/50 border bg-transparent hover:backdrop-blur-lg",
        secondary: "bg-secondary text-primary hover:bg-secondary/80",
      },
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const classes = cn(buttonVariants({ className, size, variant }));

  if (asChild) {
    return <Slot className={classes} {...props} />;
  }

  return <button className={classes} type="button" {...props} />;
};

export { Button };

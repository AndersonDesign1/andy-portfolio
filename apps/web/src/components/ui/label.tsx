"use client";

import { Root as LabelPrimitiveRoot } from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

type LabelProps = React.ComponentPropsWithRef<typeof LabelPrimitiveRoot> &
  VariantProps<typeof labelVariants>;

const Label = ({ className, ref, ...props }: LabelProps) => (
  <LabelPrimitiveRoot
    className={cn(labelVariants(), className)}
    ref={ref}
    {...props}
  />
);
Label.displayName = LabelPrimitiveRoot.displayName;

export { Label };

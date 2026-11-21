"use client";

import { RecordIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Indicator, Item, Root } from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root className={cn("grid gap-2", className)} {...props} ref={ref} />
));
RadioGroup.displayName = Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item
    className={cn(
      "border-primary text-primary focus-visible:ring-ring aspect-square size-4 rounded-full border shadow focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    <Indicator className="flex items-center justify-center">
      <HugeiconsIcon
        className="fill-primary"
        color="currentColor"
        icon={RecordIcon}
        size={14}
      />
    </Indicator>
  </Item>
));
RadioGroupItem.displayName = Item.displayName;

export { RadioGroup, RadioGroupItem };

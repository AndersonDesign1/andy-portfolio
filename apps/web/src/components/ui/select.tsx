"use client";

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Content as SelectContentPrimitive,
  Group as SelectGroupPrimitive,
  Icon as SelectIconPrimitive,
  ItemIndicator as SelectItemIndicatorPrimitive,
  Item as SelectItemPrimitive,
  ItemText as SelectItemTextPrimitive,
  Label as SelectLabelPrimitive,
  Portal as SelectPortalPrimitive,
  Root as SelectRoot,
  ScrollDownButton as SelectScrollDownButtonPrimitive,
  ScrollUpButton as SelectScrollUpButtonPrimitive,
  Separator as SelectSeparatorPrimitive,
  Trigger as SelectTriggerPrimitive,
  Value as SelectValuePrimitive,
  Viewport as SelectViewportPrimitive,
} from "@radix-ui/react-select";
import React from "react";

import { cn } from "@/lib/utils";

const Select = SelectRoot;

const SelectGroup = SelectGroupPrimitive;

const SelectValue = SelectValuePrimitive;

const SelectTrigger = ({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectTriggerPrimitive>) => (
  <SelectTriggerPrimitive
    className={cn(
      "border-input ring-offset-background focus:ring-ring data-[placeholder]:text-muted-foreground flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
    <SelectIconPrimitive asChild>
      <HugeiconsIcon
        className="opacity-50"
        color="currentColor"
        icon={ArrowDown01Icon}
        size={16}
        strokeWidth={1.5}
      />
    </SelectIconPrimitive>
  </SelectTriggerPrimitive>
);
SelectTrigger.displayName = SelectTriggerPrimitive.displayName;

const SelectScrollUpButton = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectScrollUpButtonPrimitive>) => (
  <SelectScrollUpButtonPrimitive
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    ref={ref}
    {...props}
  >
    <HugeiconsIcon
      color="currentColor"
      icon={ArrowUp01Icon}
      size={16}
      strokeWidth={1.5}
    />
  </SelectScrollUpButtonPrimitive>
);
SelectScrollUpButton.displayName = SelectScrollUpButtonPrimitive.displayName;

const SelectScrollDownButton = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectScrollDownButtonPrimitive>) => (
  <SelectScrollDownButtonPrimitive
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    ref={ref}
    {...props}
  >
    <HugeiconsIcon
      color="currentColor"
      icon={ArrowDown01Icon}
      size={16}
      strokeWidth={1.5}
    />
  </SelectScrollDownButtonPrimitive>
);
SelectScrollDownButton.displayName =
  SelectScrollDownButtonPrimitive.displayName;

const SelectContent = ({
  className,
  children,
  position = "popper",
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectContentPrimitive>) => (
  <SelectPortalPrimitive>
    <SelectContentPrimitive
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=open]:animate-in relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] origin-[--radix-select-content-transform-origin] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      ref={ref}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectViewportPrimitive
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectViewportPrimitive>
      <SelectScrollDownButton />
    </SelectContentPrimitive>
  </SelectPortalPrimitive>
);
SelectContent.displayName = SelectContentPrimitive.displayName;

const SelectLabel = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectLabelPrimitive>) => (
  <SelectLabelPrimitive
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    ref={ref}
    {...props}
  />
);
SelectLabel.displayName = SelectLabelPrimitive.displayName;

const SelectItem = ({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectItemPrimitive>) => (
  <SelectItemPrimitive
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectItemIndicatorPrimitive>
        <HugeiconsIcon
          color="currentColor"
          icon={Tick01Icon}
          size={16}
          strokeWidth={1.5}
        />
      </SelectItemIndicatorPrimitive>
    </span>
    <SelectItemTextPrimitive>{children}</SelectItemTextPrimitive>
  </SelectItemPrimitive>
);
SelectItem.displayName = SelectItemPrimitive.displayName;

const SelectSeparator = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SelectSeparatorPrimitive>) => (
  <SelectSeparatorPrimitive
    className={cn("bg-muted -mx-1 my-1 h-px", className)}
    ref={ref}
    {...props}
  />
);
SelectSeparator.displayName = SelectSeparatorPrimitive.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};

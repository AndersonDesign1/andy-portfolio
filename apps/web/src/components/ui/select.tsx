"use client";

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
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const Select = SelectRoot;

const SelectGroup = SelectGroupPrimitive;

const SelectValue = SelectValuePrimitive;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTriggerPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectTriggerPrimitive>
>(({ className, children, ...props }, ref) => (
  <SelectTriggerPrimitive
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
    <SelectIconPrimitive asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectIconPrimitive>
  </SelectTriggerPrimitive>
));
SelectTrigger.displayName = SelectTriggerPrimitive.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectScrollUpButtonPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectScrollUpButtonPrimitive>
>(({ className, ...props }, ref) => (
  <SelectScrollUpButtonPrimitive
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    ref={ref}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectScrollUpButtonPrimitive>
));
SelectScrollUpButton.displayName = SelectScrollUpButtonPrimitive.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectScrollDownButtonPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectScrollDownButtonPrimitive>
>(({ className, ...props }, ref) => (
  <SelectScrollDownButtonPrimitive
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    ref={ref}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectScrollDownButtonPrimitive>
));
SelectScrollDownButton.displayName =
  SelectScrollDownButtonPrimitive.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectContentPrimitive>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPortalPrimitive>
    <SelectContentPrimitive
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] origin-[--radix-select-content-transform-origin] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
        position === "popper" &&
          "data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
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
));
SelectContent.displayName = SelectContentPrimitive.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectLabelPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectLabelPrimitive>
>(({ className, ...props }, ref) => (
  <SelectLabelPrimitive
    className={cn("px-2 py-1.5 font-semibold text-sm", className)}
    ref={ref}
    {...props}
  />
));
SelectLabel.displayName = SelectLabelPrimitive.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItemPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectItemPrimitive>
>(({ className, children, ...props }, ref) => (
  <SelectItemPrimitive
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicatorPrimitive>
        <Check className="h-4 w-4" />
      </SelectItemIndicatorPrimitive>
    </span>
    <SelectItemTextPrimitive>{children}</SelectItemTextPrimitive>
  </SelectItemPrimitive>
));
SelectItem.displayName = SelectItemPrimitive.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectSeparatorPrimitive>,
  React.ComponentPropsWithoutRef<typeof SelectSeparatorPrimitive>
>(({ className, ...props }, ref) => (
  <SelectSeparatorPrimitive
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    ref={ref}
    {...props}
  />
));
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

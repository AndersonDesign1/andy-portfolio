"use client";

import { Slot } from "@radix-ui/react-slot";
import React from "react";

import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(
  undefined
);
const AccordionItemContext = React.createContext<string | undefined>(undefined);

const createAccordionContextValue = (
  openItems: string[],
  toggleItem: (value: string) => void
): AccordionContextType => ({ openItems, toggleItem });

const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  onValueChange?: (value: string) => void;
  type?: "single" | "multiple";
  value?: string;
}

const Accordion = ({
  children,
  type = "single",
  collapsible = false,
  value,
  onValueChange,
  className,
  ref,
  ...props
}: AccordionProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [internalOpenItems, setInternalOpenItems] = React.useState<string[]>(
    value ? [value] : []
  );

  let openItems = internalOpenItems;
  if (value !== undefined) {
    openItems = value ? [value] : [];
  }

  const toggleItem = (itemValue: string) => {
    let newValue: string;
    let newItems: string[];

    if (type === "single") {
      if (collapsible && openItems.includes(itemValue)) {
        newItems = openItems.filter((item) => item !== itemValue);
        newValue = "";
      } else {
        newItems = [itemValue];
        newValue = itemValue;
      }
    } else if (openItems.includes(itemValue)) {
      newItems = openItems.filter((item) => item !== itemValue);
      newValue = newItems.join(",");
    } else {
      newItems = [...openItems, itemValue];
      newValue = newItems.join(",");
    }

    onValueChange?.(newValue);

    if (value === undefined) {
      setInternalOpenItems(newItems);
    }
  };
  const contextValue = createAccordionContextValue(openItems, toggleItem);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};
Accordion.displayName = "Accordion";

interface AccordionItemProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  value: string;
}

const AccordionItem = ({
  children,
  value,
  className,
  asChild = false,
  ref,
  ...props
}: AccordionItemProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <AccordionItemContext.Provider value={value}>
      <Comp className={cn("border-b", className)} ref={ref} {...props}>
        {children}
      </Comp>
    </AccordionItemContext.Provider>
  );
};
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  value?: string;
}

const AccordionTrigger = ({
  children,
  value,
  className,
  asChild = false,
  ref,
  ...props
}: AccordionTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { openItems, toggleItem } = useAccordion();
  const itemValue = React.useContext(AccordionItemContext);
  const resolvedValue = value ?? itemValue;
  if (!resolvedValue) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }
  const isOpen = openItems.includes(resolvedValue);
  const triggerClassName = cn(
    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
    className
  );
  const handleClick = () => toggleItem(resolvedValue);

  if (asChild) {
    return (
      <Slot
        className={triggerClassName}
        data-state={isOpen ? "open" : "closed"}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={triggerClassName}
      data-state={isOpen ? "open" : "closed"}
      onClick={handleClick}
      ref={ref}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  value?: string;
}

const AccordionContent = ({
  children,
  value,
  className,
  asChild = false,
  ref,
  ...props
}: AccordionContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { openItems } = useAccordion();
  const itemValue = React.useContext(AccordionItemContext);
  const resolvedValue = value ?? itemValue;
  if (!resolvedValue) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }
  const isOpen = openItems.includes(resolvedValue);

  if (!isOpen) {
    return null;
  }

  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "overflow-hidden text-sm transition-all",
        "animate-accordion-down",
        className
      )}
      data-state="open"
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  );
};
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

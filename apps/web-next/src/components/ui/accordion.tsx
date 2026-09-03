"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(
  undefined
);

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

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      type = "single",
      collapsible = false,
      value,
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpenItems, setInternalOpenItems] = React.useState<string[]>(
      value ? [value] : []
    );

    let openItems = internalOpenItems;
    if (value !== undefined) {
      openItems = value ? [value] : [];
    }

    const toggleItem = React.useCallback(
      (itemValue: string) => {
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

        if (onValueChange) {
          onValueChange(newValue);
        }

        if (value === undefined) {
          setInternalOpenItems(newItems);
        }
      },
      [type, collapsible, openItems, onValueChange, value]
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem }}>
        <div className={cn("w-full", className)} ref={ref} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "div";
    const itemProps = asChild
      ? {}
      : { className: cn("border-b", className), ref, ...props };

    return (
      <Comp {...itemProps}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value } as React.Attributes & {
              value: string;
            });
          }
          return child;
        })}
      </Comp>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  value: string;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, value, className, asChild = false, ...props }, ref) => {
  const { openItems, toggleItem } = useAccordion();
  const isOpen = openItems.includes(value);

  const Comp = asChild ? React.Fragment : "button";
  const triggerProps = asChild
    ? {}
    : {
        className: cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        ),
        "data-state": isOpen ? "open" : "closed",
        onClick: () => toggleItem(value),
        ref,
        type: "button",
        ...props,
      };

  return <Comp {...triggerProps}>{children}</Comp>;
});
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  value: string;
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, value, className, asChild = false, ...props }, ref) => {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(value);

  const Comp = asChild ? React.Fragment : "div";
  const contentProps = asChild
    ? {}
    : {
        className: cn(
          "overflow-hidden text-sm transition-all",
          isOpen ? "animate-accordion-down" : "animate-accordion-up",
          className
        ),
        "data-state": isOpen ? "open" : "closed",
        ref,
        ...props,
      };

  if (!isOpen) {
    return null;
  }

  return <Comp {...contentProps}>{children}</Comp>;
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

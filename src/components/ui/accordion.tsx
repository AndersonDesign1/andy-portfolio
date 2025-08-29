"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, type = "single", collapsible = false, value, onValueChange, className, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(value ? [value] : []);

    const toggleItem = React.useCallback((itemValue: string) => {
      setOpenItems(prev => {
        if (type === "single") {
          if (collapsible && prev.includes(itemValue)) {
            const newItems = prev.filter(item => item !== itemValue);
            onValueChange?.("");
            return newItems;
          } else {
            const newItems = [itemValue];
            onValueChange?.(itemValue);
            return newItems;
          }
        } else {
          // multiple type
          if (prev.includes(itemValue)) {
            const newItems = prev.filter(item => item !== itemValue);
            onValueChange?.(newItems.join(","));
            return newItems;
          } else {
            const newItems = [...prev, itemValue];
            onValueChange?.(newItems.join(","));
            return newItems;
          }
        }
      });
    }, [type, collapsible, onValueChange]);

    // Sync with external value
    React.useEffect(() => {
      if (value !== undefined) {
        setOpenItems(value ? [value] : []);
      }
    }, [value]);

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  asChild?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "div";
    const itemProps = asChild ? {} : { ref, className: cn("border-b", className), ...props };

    return (
      <Comp {...itemProps}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value } as any);
          }
          return child;
        })}
      </Comp>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  asChild?: boolean;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, value, className, asChild = false, ...props }, ref) => {
    const { openItems, toggleItem } = useAccordion();
    const isOpen = openItems.includes(value);

    const Comp = asChild ? React.Fragment : "button";
    const triggerProps = asChild ? {} : {
      ref,
      type: "button",
      className: cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      ),
      onClick: () => toggleItem(value),
      "data-state": isOpen ? "open" : "closed",
      ...props
    };

    return (
      <Comp {...triggerProps}>
        {children}
      </Comp>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  asChild?: boolean;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, value, className, asChild = false, ...props }, ref) => {
    const { openItems } = useAccordion();
    const isOpen = openItems.includes(value);

    const Comp = asChild ? React.Fragment : "div";
    const contentProps = asChild ? {} : {
      ref,
      className: cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up",
        className
      ),
      "data-state": isOpen ? "open" : "closed",
      ...props
    };

    if (!isOpen) {
      return null;
    }

    return (
      <Comp {...contentProps}>
        {children}
      </Comp>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

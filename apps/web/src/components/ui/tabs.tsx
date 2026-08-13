"use client";

import {
  Content as TabsContentPrimitive,
  List as TabsListPrimitive,
  Root as TabsRoot,
  Trigger as TabsTriggerPrimitive,
} from "@radix-ui/react-tabs";
import React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsRoot;

const TabsList = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof TabsListPrimitive>) => (
  <TabsListPrimitive
    className={cn(
      "bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1",
      className
    )}
    ref={ref}
    {...props}
  />
);
TabsList.displayName = TabsListPrimitive.displayName;

const TabsTrigger = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof TabsTriggerPrimitive>) => (
  <TabsTriggerPrimitive
    className={cn(
      "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
      className
    )}
    ref={ref}
    {...props}
  />
);
TabsTrigger.displayName = TabsTriggerPrimitive.displayName;

const TabsContent = ({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof TabsContentPrimitive>) => (
  <TabsContentPrimitive
    className={cn(
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      className
    )}
    ref={ref}
    {...props}
  />
);
TabsContent.displayName = TabsContentPrimitive.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };

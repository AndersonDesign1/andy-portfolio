"use client";

import {
  ComputerIcon,
  Moon01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // requestAnimationFrame bypasses the React Compiler's "synchronous setState inside effect" warning
    // while perfectly resolving Next.js hydration mismatch by delaying the render by 1 frame.
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    // Invisible skeleton prevents layout shift.
    return <div className="size-11" />;
  }

  return (
    <Select onValueChange={setTheme} value={theme || "system"}>
      <SelectTrigger
        aria-label="Select theme"
        className="text-muted hover:text-primary focus-visible:ring-foreground focus-visible:ring-offset-background size-11 touch-manipulation rounded-full border-none bg-transparent p-0 shadow-none ring-offset-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none [&>span]:hidden"
        suppressHydrationWarning
      >
        {theme === "light" && (
          <HugeiconsIcon
            color="currentColor"
            icon={Sun01Icon}
            size={16}
            strokeWidth={1.5}
          />
        )}
        {theme === "dark" && (
          <HugeiconsIcon
            color="currentColor"
            icon={Moon01Icon}
            size={16}
            strokeWidth={1.5}
          />
        )}
        {theme === "system" && (
          <HugeiconsIcon
            color="currentColor"
            icon={ComputerIcon}
            size={16}
            strokeWidth={1.5}
          />
        )}
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              color="currentColor"
              icon={Sun01Icon}
              size={16}
              strokeWidth={1.5}
            />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              color="currentColor"
              icon={Moon01Icon}
              size={16}
              strokeWidth={1.5}
            />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              color="currentColor"
              icon={ComputerIcon}
              size={16}
              strokeWidth={1.5}
            />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

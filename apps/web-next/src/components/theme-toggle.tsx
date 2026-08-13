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

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // requestAnimationFrame bypasses the React Compiler's "synchronous setState inside effect" warning
    // while perfectly resolving Next.js hydration mismatch by delaying the render by 1 frame.
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return <div className="size-8" />; // Invisible skeleton prevents layout shift
  }

  return (
    <Select onValueChange={setTheme} value={theme || "system"}>
      <SelectTrigger
        aria-label="Select theme"
        className="size-8 rounded-full border-none bg-transparent p-0 text-muted shadow-none ring-offset-0 transition-colors hover:text-primary focus:ring-0 focus:ring-offset-0 [&>span]:hidden"
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
}

"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        className="size-8 rounded-full"
        size="icon"
        variant="ghost"
      >
        <div className="size-5" />
      </Button>
    );
  }

  return (
    <Select onValueChange={setTheme} value={theme}>
      <SelectTrigger
        aria-label="Select theme"
        className="size-8 rounded-full border-none bg-transparent p-0 text-muted shadow-none ring-offset-0 transition-colors hover:text-primary focus:ring-0 focus:ring-offset-0 [&>span]:hidden"
      >
        {theme === "light" && <Sun className="size-4" />}
        {theme === "dark" && <Moon className="size-4" />}
        {theme === "system" && <Monitor className="size-4" />}
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="size-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="size-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="size-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

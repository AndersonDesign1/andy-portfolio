"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

interface ToasterStyle extends CSSProperties {
  "--normal-bg": string;
  "--normal-border": string;
  "--normal-text": string;
}

const toasterStyle: ToasterStyle = {
  "--normal-bg": "var(--muted)",
  "--normal-border": "var(--border)",
  "--normal-text": "var(--foreground)",
};

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const sonnerTheme = theme === "light" || theme === "dark" ? theme : "system";

  return (
    <Sonner
      className="toaster group"
      style={toasterStyle}
      theme={sonnerTheme}
      {...props}
    />
  );
};

export { Toaster };

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAnimationDelay(index: number, baseDelay = 100): string {
  return `${index * baseDelay}ms`;
}

export function getStaggeredAnimation(index: number, stagger = 0.1): string {
  return `${index * stagger}s`;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validateRequired(value: string): string | null {
  return value.trim() ? null : "This field is required";
}

export function validateMinLength(
  value: string,
  minLength: number
): string | null {
  return value.trim().length >= minLength
    ? null
    : `Must be at least ${minLength} characters`;
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("en-US", defaultOptions);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

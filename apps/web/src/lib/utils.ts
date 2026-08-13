import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getAnimationDelay = (index: number, baseDelay = 100): string =>
  `${index * baseDelay}ms`;

export const getStaggeredAnimation = (index: number, stagger = 0.1): string =>
  `${index * stagger}s`;

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);

export const validateRequired = (value: string): string | null =>
  value.trim() ? null : "This field is required";

export const validateMinLength = (
  value: string,
  minLength: number
): string | null =>
  value.trim().length >= minLength
    ? null
    : `Must be at least ${minLength} characters`;

export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("en-US", defaultOptions);
};

export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: never[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

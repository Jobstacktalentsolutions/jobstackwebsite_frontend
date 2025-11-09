import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAccessToken } from "./cookies";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get authentication token from cookies
 */
export function getAuthToken(): string | undefined {
  return getAccessToken();
}

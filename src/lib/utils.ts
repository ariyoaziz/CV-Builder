import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a URL for display in CV templates.
 * - If showFullLinks is true: returns clean domain/path without http://, https://, or trailing slash (e.g. "linkedin.com/in/ariyoaziz", "ariyoaziz.github.io").
 * - If showFullLinks is false: returns the provided default label (e.g. "LinkedIn", "GitHub", "Portofolio").
 */
export function formatDisplayUrl(
  url: string | undefined | null,
  defaultLabel: string,
  showFullLinks: boolean = false
): string {
  if (!url || !url.trim()) return "";
  if (!showFullLinks) return defaultLabel;

  let clean = url.trim().replace(/^https?:\/\//i, "");
  clean = clean.replace(/\/+$/, "");
  return clean || defaultLabel;
}


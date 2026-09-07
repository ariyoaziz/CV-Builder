import type { CVData } from "@/types/cv.types";
import { toast } from "sonner";

/**
 * Sanitizes a person's name for safe use as a filename.
 * Removes characters invalid on Windows/POSIX filesystems.
 */
export function sanitizeFilename(name?: string): string {
  if (!name) return "Resume";
  const sanitized = name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "") // Remove illegal characters
    .replace(/\s+/g, "_"); // Replace whitespace with underscore

  return sanitized || "Resume";
}

/**
 * Generates standardized export filename: CV_[SanitizedName]_[YYYY-MM-DD].json
 */
export function generateExportFilename(fullName?: string): string {
  const safeName = sanitizeFilename(fullName);
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  return `CV_${safeName}_${dateStr}.json`;
}

/**
 * Serializes canonical CVData into a formatted JSON string,
 * wraps it in a UTF-8 Blob, and triggers browser-native file download.
 */
export function exportCVToJSON(cvData: CVData): void {
  try {
    const jsonString = JSON.stringify(cvData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const filename = generateExportFilename(cvData.personalInfo?.fullName);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    toast.success("Data CV berhasil diekspor.");
  } catch (error) {
    console.error("Gagal mengekspor CV:", error);
    toast.error("Terjadi kesalahan saat mengekspor data CV.");
  }
}

import { format, parse } from "date-fns";
import { id as idLocale, enUS as enLocale } from "date-fns/locale";
import type { Language } from "@/i18n/types";

/**
 * Formats a YYYY-MM date string to "MMM yyyy" according to language (e.g., "Jan 2022" or "Aug 2020").
 * Returns an empty string for invalid/empty input.
 */
export function formatMonthYear(dateStr: string, lang: Language = "id"): string {
  if (!dateStr || !/^\d{4}-\d{2}$/.test(dateStr)) return "";
  try {
    const parsed = parse(dateStr, "yyyy-MM", new Date());
    const locale = lang === "en" ? enLocale : idLocale;
    return format(parsed, "MMM yyyy", { locale });
  } catch {
    return "";
  }
}

/**
 * Formats a date range for display on a CV.
 *
 * @param startDate - YYYY-MM string
 * @param endDate   - YYYY-MM string (ignored when current=true)
 * @param current   - Whether the position is ongoing ("Sekarang" / "Present")
 * @param lang      - Target language ("id" | "en")
 * @returns Formatted string, e.g. "Jan 2022 – Sekarang" or "Jan 2022 – Present"
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  current: boolean,
  lang: Language = "id"
): string {
  const start = formatMonthYear(startDate, lang);
  if (!start) return "";

  if (current) {
    const presentLabel = lang === "en" ? "Present" : "Sekarang";
    return `${start} – ${presentLabel}`;
  }

  const end = formatMonthYear(endDate, lang);
  if (!end) return start;

  return `${start} – ${end}`;
}

/**
 * Full Indonesian month definitions with 2-digit zero-padded string values.
 */
export const INDONESIAN_MONTHS = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

/**
 * Full English month definitions with 2-digit zero-padded string values.
 */
export const ENGLISH_MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

/**
 * Returns month options based on language.
 */
export function getMonthOptions(lang: Language = "id"): Array<{ value: string; label: string }> {
  return lang === "en" ? ENGLISH_MONTHS : INDONESIAN_MONTHS;
}

/**
 * Generates an ordered array of years (e.g., currentYear + 10 down to startYear), most recent/future first.
 */
export function getYearOptions(
  futureYears = 10,
  startYear = 1960
): string[] {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear + futureYears;
  const years: string[] = [];
  for (let year = maxYear; year >= startYear; year--) {
    years.push(String(year));
  }
  return years;
}

/**
 * Generates an ordered array of YYYY-MM strings for month/year select dropdowns.
 * Covers the range from Jan 1960 to the current month (inclusive), most recent first.
 */
export function monthYearOptions(lang: Language = "id"): Array<{ value: string; label: string }> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  const options: Array<{ value: string; label: string }> = [];

  for (let year = currentYear; year >= 1960; year--) {
    const maxMonth = year === currentYear ? currentMonth : 12;
    for (let month = maxMonth; month >= 1; month--) {
      const mm = String(month).padStart(2, "0");
      const value = `${year}-${mm}`;
      const label = formatMonthYear(value, lang);
      options.push({ value, label });
    }
  }

  return options;
}

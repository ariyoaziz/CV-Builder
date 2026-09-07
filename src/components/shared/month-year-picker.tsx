"use client";

import { useState, useMemo } from "react";
import { getMonthOptions, getYearOptions } from "@/utils/date.utils";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface MonthYearPickerProps {
  /** Controlled value in YYYY-MM format, or empty string. */
  value?: string;
  onChange: (val: string) => void;
  label?: string;
  id?: string;
  error?: string;
  /** If true, renders a disabled "Sekarang" / "Present" indicator instead of selects. */
  disabled?: boolean;
  required?: boolean;
}

/**
 * Two-select (Month + Year) date picker that outputs values in YYYY-MM format.
 * Uses native <select> elements for maximum browser compatibility and accessibility.
 *
 * Maintains internal state for partial selections (e.g. Month chosen before Year)
 * and emits valid YYYY-MM to onChange once both are selected.
 */
export function MonthYearPicker({
  value = "",
  onChange,
  label,
  id,
  error,
  disabled = false,
  required = false,
}: MonthYearPickerProps) {
  const { t, language } = useTranslation();

  // Parse incoming value
  const [valYear, valMonth] = useMemo(() => {
    return value && /^\d{4}-\d{2}$/.test(value) ? value.split("-") : ["", ""];
  }, [value]);

  // Local state to hold partial selections (e.g. Month chosen before Year, or vice versa)
  const [prevValue, setPrevValue] = useState<string>(value);
  const [selectedMonth, setSelectedMonth] = useState<string>(valMonth);
  const [selectedYear, setSelectedYear] = useState<string>(valYear);

  // Adjust state during render when prop changes (React recommended pattern)
  if (value !== prevValue) {
    setPrevValue(value);
    setSelectedMonth(valMonth);
    setSelectedYear(valYear);
  }

  const years = useMemo(() => getYearOptions(10, 1960), []);
  const monthOptions = useMemo(() => getMonthOptions(language), [language]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMonth = e.target.value;
    setSelectedMonth(nextMonth);
    if (nextMonth && selectedYear) {
      onChange(`${selectedYear}-${nextMonth}`);
    } else {
      onChange("");
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextYear = e.target.value;
    setSelectedYear(nextYear);
    if (nextYear && selectedMonth) {
      onChange(`${nextYear}-${selectedMonth}`);
    } else {
      onChange("");
    }
  };

  const selectClass = cn(
    "h-8 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-900",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
    "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
    error && "border-red-400 focus:ring-red-400/20"
  );

  // Label element (shared between both disabled and enabled renders)
  const labelEl = label ? (
    <Label
      htmlFor={disabled ? undefined : id}
      className="text-xs font-medium text-slate-600 mb-1 block"
    >
      {label}
      {required && (
        <span className="text-red-500 ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  ) : null;

  if (disabled) {
    return (
      <div>
        {labelEl}
        <div className="h-8 flex items-center px-2 rounded-md border border-slate-200 bg-slate-100 text-sm text-slate-500">
          {t.date.present}
        </div>
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <div className="flex gap-2">
        {/* Month select */}
        <select
          aria-label={label ? `${label} — ${t.date.monthPlaceholder.toLowerCase()}` : t.date.monthPlaceholder}
          className={cn(selectClass, "flex-1")}
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="">{t.date.monthPlaceholder}</option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Year select */}
        <select
          id={id}
          aria-label={label ? `${label} — ${t.date.yearPlaceholder.toLowerCase()}` : t.date.yearPlaceholder}
          className={cn(selectClass, "flex-1")}
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">{t.date.yearPlaceholder}</option>
          {years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p role="alert" className="mt-1 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

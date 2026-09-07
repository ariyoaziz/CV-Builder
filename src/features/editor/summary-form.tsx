"use client";

import { useCallback, useDeferredValue, useRef } from "react";
import { useCVStore } from "@/store/useCVStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/i18n";

const MAX_CHARS = 2000;

/**
 * Professional Summary section form.
 *
 * Architecture:
 * - Zustand is the source of truth for the summary text.
 * - The textarea reads directly from the store value (controlled).
 * - onChange debounces Zustand updates (100ms) for performance.
 * - useDeferredValue defers charCount recalculation to avoid blocking
 *   the user's typing with expensive re-renders.
 *
 * This fully-controlled approach avoids:
 * - useState-in-effect (React Compiler violation)
 * - ref access during render (React Compiler violation)
 */
export function SummaryForm() {
  const { t, language } = useTranslation();
  const summary = useCVStore((state) => state.cvData.summary.summary ?? "");
  const updateSummary = useCVStore((state) => state.updateSummary);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Deferred charCount so typing stays snappy
  const deferredSummary = useDeferredValue(summary);
  const charCount = deferredSummary.length;

  const dispatchUpdate = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateSummary({ summary: value });
      }, 100);
    },
    [updateSummary]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length > MAX_CHARS) return;
    dispatchUpdate(val);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateSummary({ summary: e.target.value });
  };

  const isNearLimit = charCount >= MAX_CHARS * 0.9;
  const isAtLimit = charCount >= MAX_CHARS;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="summary-text" className="text-xs font-medium text-slate-600">
            {t.editor.summary.title}
          </Label>
          <span
            className={`text-[11px] tabular-nums ${
              isAtLimit
                ? "text-red-500 font-semibold"
                : isNearLimit
                ? "text-amber-500"
                : "text-slate-400"
            }`}
            aria-live="polite"
            aria-label={`${charCount} / ${MAX_CHARS}`}
          >
            {charCount} / {MAX_CHARS}
          </span>
        </div>

        <Textarea
          id="summary-text"
          value={summary}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
          maxLength={MAX_CHARS}
          placeholder={t.editor.summary.placeholder}
          aria-describedby="summary-tip"
          className="resize-none leading-relaxed"
        />
      </div>

      {/* ATS guidance */}
      <div
        id="summary-tip"
        className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2"
        role="note"
      >
        <p className="text-[11px] text-blue-700 font-medium mb-0.5">
          {language === "en" ? "ATS Tips" : "Tips ATS"}
        </p>
        <ul className="text-[11px] text-blue-600 space-y-0.5 list-disc list-inside">
          {language === "en" ? (
            <>
              <li>Use relevant keywords tailored to target job descriptions.</li>
              <li>Write 3–5 sentences highlighting experience, top skills, and impact.</li>
              <li>Avoid uncommon acronyms or excessive jargon.</li>
            </>
          ) : (
            <>
              <li>Gunakan kata kunci yang relevan dari deskripsi pekerjaan.</li>
              <li>Tulis 3–5 kalimat yang mencakup pengalaman, keahlian, dan tujuan karier.</li>
              <li>Hindari jargon atau singkatan yang tidak umum.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

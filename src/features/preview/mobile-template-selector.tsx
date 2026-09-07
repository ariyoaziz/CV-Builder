"use client";

import React from "react";
import { Check } from "lucide-react";
import { useCVStore } from "@/store/useCVStore";
import {
  TEMPLATES_CONFIG,
  ACCENT_COLORS,
} from "@/features/preview/template-registry";
import type { TemplateId } from "@/types/cv.types";
import { cn } from "@/lib/utils";

export function MobileTemplateSelector() {
  const currentTemplate = useCVStore((state) => state.cvData.metadata.templateId || "modern");
  const currentAccent = useCVStore((state) => state.cvData.metadata.accentColor || "#2563eb");
  const setTemplate = useCVStore((state) => state.setTemplate);
  const setAccentColor = useCVStore((state) => state.setAccentColor);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Pilih Template CV
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ganti tata letak CV secara instan tanpa kehilangan data Anda.
        </p>
      </div>

      {/* Templates List */}
      <div className="space-y-3" role="radiogroup" aria-label="Pilihan template CV">
        {TEMPLATES_CONFIG.map((tpl) => {
          const isSelected = currentTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setTemplate(tpl.id as TemplateId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setTemplate(tpl.id as TemplateId);
                }
              }}
              className={cn(
                "p-4 rounded-xl border-2 transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent",
                isSelected
                  ? "border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-950">
                    {tpl.name}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700">
                    {tpl.badge}
                  </span>
                </div>
                {isSelected && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white">
                    <Check className="h-3 w-3 stroke-3" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {tpl.description}
              </p>
              <div className="text-[11px] font-mono text-slate-500 mt-2">
                Tipografi: {tpl.font}
              </div>
            </div>
          );
        })}
      </div>

      {/* Accent Color Section */}
      <div className="pt-2 border-t border-slate-200">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
          Warna Aksen Dokumen
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Warna aksen diterapkan secara semantis ke tajuk dan garis divider.
        </p>

        <div className="flex items-center gap-2" role="radiogroup" aria-label="Warna aksen">
          {ACCENT_COLORS.map((color) => {
            const isSelected = currentAccent.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Pilih warna ${color.name}`}
                onClick={() => setAccentColor(color.hex)}
                className="min-w-11 min-h-11 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span
                  className={cn(
                    "relative w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                    isSelected && "ring-2 ring-offset-2 ring-slate-900"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check className="h-4 w-4 text-white stroke-2 drop-shadow-xs" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

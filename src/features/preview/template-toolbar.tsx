"use client";

import React from "react";
import { ZoomIn, ZoomOut, Palette, Check } from "lucide-react";
import { useCVStore } from "@/store/useCVStore";
import {
  ACCENT_COLORS,
  TEMPLATES_CONFIG,
} from "@/features/preview/template-registry";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import type { TemplateId } from "@/types/cv.types";
import { cn } from "@/lib/utils";

interface TemplateToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitZoom: () => void;
  isFit: boolean;
}

export function TemplateToolbar({
  zoom,
  onZoomChange,
  onFitZoom,
  isFit,
}: TemplateToolbarProps) {
  const { t, language } = useTranslation();
  const currentTemplate = useCVStore((state) => state.cvData.metadata.templateId || "modern");
  const currentAccent = useCVStore((state) => state.cvData.metadata.accentColor || "#2563eb");
  const setTemplate = useCVStore((state) => state.setTemplate);
  const setAccentColor = useCVStore((state) => state.setAccentColor);

  const zoomPercent = Math.round(zoom * 100);

  const handleZoomStep = (delta: number) => {
    const next = Math.min(Math.max(zoom + delta, 0.4), 1.5);
    onZoomChange(Math.round(next * 20) / 20); // Round to nearest 0.05
  };

  return (
    <div
      id="template-toolbar"
      className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 bg-white shrink-0 overflow-x-visible select-none no-print"
      role="toolbar"
      aria-label={language === "en" ? "Template and preview toolbar" : "Toolbar kontrol template dan pratinjau"}
    >
      {/* Left: Template Switcher */}
      <div
        className="flex flex-1 items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/60 shrink-0"
        role="tablist"
        aria-label={t.preview.templateSelect}
      >
        {TEMPLATES_CONFIG.map((tpl) => {
          const isActive = currentTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="cv-preview-viewport"
              onClick={() => setTemplate(tpl.id as TemplateId)}
              className={cn(
                "flex-1 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                isActive
                  ? "bg-white text-slate-950 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {tpl.name}
            </button>
          );
        })}
      </div>

      {/* Right: Controls */}
      <div className="flex w-full items-center justify-end gap-1 shrink-0 sm:w-auto">
        {/* Accent Color Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-9 px-2.5 bg-white border-slate-200 text-slate-700"
              aria-label={language === "en" ? "Change accent color" : "Ubah warna aksen CV"}
            >
              <span
                className="w-3.5 h-3.5 rounded-full inline-block border border-black/10 shrink-0"
                style={{ backgroundColor: currentAccent }}
                aria-hidden="true"
              />
              <span className="hidden sm:inline text-slate-700 font-medium">{language === "en" ? "Color" : "Warna"}</span>
              <Palette className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            <p className="text-xs font-semibold text-slate-900 mb-2">
              {language === "en" ? "Document Accent Color" : "Warna Aksen Dokumen"}
            </p>
            <div className="flex items-center justify-between gap-1" role="radiogroup" aria-label="Palet warna aksen">
              {ACCENT_COLORS.map((color) => {
                const isSelected = currentAccent.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Warna aksen ${color.name}`}
                    onClick={() => setAccentColor(color.hex)}
                    className="min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    title={color.name}
                  >
                    <span
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-105",
                        isSelected && "ring-2 ring-offset-2 ring-slate-900"
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white stroke-3 drop-shadow-xs" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2.5 leading-tight">
              {language === "en"
                ? "Accent color is semantically applied to headings and visual highlights."
                : "Warna aksen diterapkan secara semantis pada tajuk dan aksen visual."}
            </p>
          </PopoverContent>
        </Popover>

        {/* Zoom Controls Divider */}
        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Zoom Out (44x44px touch target) */}
        <button
          type="button"
          onClick={() => handleZoomStep(-0.1)}
          disabled={zoom <= 0.4}
          className="min-w-11 min-h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label={t.preview.zoomOut}
          title={t.preview.zoomOut}
        >
          <span className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100">
            <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </button>

        {/* Zoom percentage display / preset cycle (44x44px touch target) */}
        <button
          type="button"
          onClick={onFitZoom}
          className={cn(
            "min-w-11 min-h-11 px-2 text-xs font-mono rounded flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
            isFit
              ? "text-blue-700 font-semibold bg-blue-50"
              : "text-slate-700 hover:bg-slate-100"
          )}
          title={t.preview.fitPage}
          aria-label={`${language === "en" ? "Current zoom" : "Zoom saat ini"}: ${zoomPercent}%. ${t.preview.fitPage}.`}
        >
          {isFit ? (
            <>
              <span className="hidden sm:inline">{t.preview.fitPage}</span>
              <span className="sm:hidden">Fit</span>
            </>
          ) : `${zoomPercent}%`}
        </button>

        {/* Zoom In (44x44px touch target) */}
        <button
          type="button"
          onClick={() => handleZoomStep(0.1)}
          disabled={zoom >= 1.5}
          className="min-w-11 min-h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label={t.preview.zoomIn}
          title={t.preview.zoomIn}
        >
          <span className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100">
            <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </button>

      </div>
    </div>
  );
}

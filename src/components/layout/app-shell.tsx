"use client";

import { useState, useRef, useCallback } from "react";
import { PenLine, Eye, Layers } from "lucide-react";
import { Header } from "@/components/layout/header";
import { EditorPanel } from "../../features/editor/editor-panel";
import { PreviewPanel } from "../../features/preview/preview-panel";
import { MobileTemplateSelector } from "../../features/preview/mobile-template-selector";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

type MobileTab = "editor" | "preview" | "templates";

const STORAGE_KEY = "cv_editor_preview_split_ratio";
const DEFAULT_SPLIT_PERCENT = 45;
const MIN_EDITOR_PX = 320;
const MIN_PREVIEW_PX = 400;
const MIN_SPLIT_PERCENT = 25;
const MAX_SPLIT_PERCENT = 65;

const getInitialSplitPercent = (): number => {
  if (typeof window === "undefined") return DEFAULT_SPLIT_PERCENT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= MIN_SPLIT_PERCENT && parsed <= MAX_SPLIT_PERCENT) {
        return parsed;
      }
    }
  } catch {
    // Ignored
  }
  return DEFAULT_SPLIT_PERCENT;
};

/**
 * Root application shell.
 *
 * Desktop (≥ 1024px): Resizable horizontal split — Editor | Divider | Preview.
 * Tablet (768–1023px): Resizable split maintained with boundary clamps.
 * Mobile (< 768px): Full-screen panels with bottom tab navigation.
 *
 * Panel split ratio and mobile tab state are UI state (not in CVData).
 */
export function AppShell() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<MobileTab>("editor");
  const [splitPercent, setSplitPercent] = useState<number>(getInitialSplitPercent);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const mobileTabs: Array<{ id: MobileTab; label: string; icon: React.ElementType }> = [
    { id: "editor", label: t.mobileNav.edit, icon: PenLine },
    { id: "preview", label: t.mobileNav.preview, icon: Eye },
    { id: "templates", label: t.mobileNav.templates, icon: Layers },
  ];

  // Save split ratio preference when updated
  const updateSplitPercent = useCallback((newPercent: number) => {
    const clamped = Math.min(Math.max(newPercent, MIN_SPLIT_PERCENT), MAX_SPLIT_PERCENT);
    setSplitPercent(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, clamped.toString());
    } catch {
      // Ignored
    }
  }, []);

  // Pointer drag handling for divider
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    e.preventDefault();
    setIsDragging(true);

    const container = containerRef.current;
    if (!container) return;

    const pointerId = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(pointerId);
    } catch {
      // Ignored
    }

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;

      const rawX = moveEvent.clientX - rect.left;
      const minX = Math.max(MIN_EDITOR_PX, (MIN_SPLIT_PERCENT / 100) * rect.width);
      const maxX = Math.min(rect.width - MIN_PREVIEW_PX, (MAX_SPLIT_PERCENT / 100) * rect.width);
      const clampedX = Math.min(Math.max(rawX, minX), Math.max(minX, maxX));
      const nextPercent = (clampedX / rect.width) * 100;

      updateSplitPercent(nextPercent);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  // Keyboard accessibility for divider
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const STEP = 2; // 2% step per arrow key
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      updateSplitPercent(splitPercent - STEP);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      updateSplitPercent(splitPercent + STEP);
    } else if (e.key === "Home") {
      e.preventDefault();
      updateSplitPercent(MIN_SPLIT_PERCENT);
    } else if (e.key === "End") {
      e.preventDefault();
      updateSplitPercent(MAX_SPLIT_PERCENT);
    }
  };

  const dividerAriaLabel =
    language === "en"
      ? "Adjust Editor and Preview panel width"
      : "Pengatur lebar panel Editor dan Preview";
  const dividerAriaText =
    language === "en"
      ? `${Math.round(splitPercent)}% editor width`
      : `${Math.round(splitPercent)}% lebar editor`;
  const dividerTitle =
    language === "en"
      ? "Drag to resize panels (Left/Right arrow keys for keyboard)"
      : "Tarik untuk mengubah lebar panel (Panah Kiri/Kanan untuk keyboard)";
  const skipLinkText =
    language === "en" ? "Skip to main content" : "Lewati ke konten utama";

  return (
    <div
      className={cn(
        "flex flex-col h-screen overflow-hidden bg-slate-100 print:h-auto print:overflow-visible print:bg-white",
        isDragging && "select-none cursor-col-resize"
      )}
    >
      {/* Skip to Content for Keyboard Users (WCAG 2.2 SC 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:text-xs focus:font-semibold focus:rounded-md focus:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      >
        {skipLinkText}
      </a>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Header />

      {/* ── Main Workspace ─────────────────────────────────────────────────── */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 min-h-0 overflow-hidden outline-none print:block print:h-auto print:overflow-visible"
      >
        {/* Desktop: side-by-side resizable split (preserved as the single canonical print source) */}
        <div
          ref={containerRef}
          className="hidden md:flex flex-1 min-h-0 overflow-hidden relative print:block print:h-auto print:overflow-visible"
        >
          {/* Editor Panel — left, scrollable (hidden in print) */}
          <div
            id="editor-panel"
            style={{ width: `${splitPercent}%` }}
            className="flex min-w-0 flex-col min-h-0 bg-white overflow-y-auto print:hidden"
          >
            <EditorPanel />
          </div>

          {/* Draggable Divider (hidden in print) */}
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={dividerAriaLabel}
            aria-valuemin={MIN_SPLIT_PERCENT}
            aria-valuemax={MAX_SPLIT_PERCENT}
            aria-valuenow={Math.round(splitPercent)}
            aria-valuetext={dividerAriaText}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            className={cn(
              "relative z-10 flex shrink-0 w-1.5 cursor-col-resize items-center justify-center bg-slate-200 hover:bg-blue-400 active:bg-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 print:hidden select-none",
              isDragging && "bg-blue-600 hover:bg-blue-600"
            )}
            title={dividerTitle}
          >
            {/* Extended touch/grab hit area (12px) */}
            <span className="absolute inset-y-0 -left-1.5 -right-1.5 cursor-col-resize" />
          </div>

          {/* Preview Panel — right, sticky (printable target) */}
          <div
            id="preview-panel"
            style={{ width: `${100 - splitPercent}%` }}
            className="flex min-w-0 flex-1 flex-col min-h-0 bg-slate-100 overflow-y-auto print:w-full print:h-auto print:bg-transparent print:overflow-visible"
          >
            <PreviewPanel />
          </div>
        </div>

        {/* Mobile: single panel based on active tab (hidden in print) */}
        <div className="flex md:hidden flex-1 flex-col min-h-0 overflow-hidden print:hidden">
          {/* Panel content */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-white">
            {activeTab === "editor" && (
              <div id="editor-panel">
                <EditorPanel />
              </div>
            )}
            {activeTab === "preview" && (
              <div id="preview-panel" className="bg-slate-100 min-h-full">
                <PreviewPanel />
              </div>
            )}
            {activeTab === "templates" && (
              <div id="templates-panel" className="bg-slate-50 min-h-full">
                <MobileTemplateSelector />
              </div>
            )}
          </div>

          {/* Mobile bottom tab bar with 48px minimum touch target (WCAG 2.2 SC 2.5.8) */}
          <nav
            className="flex shrink-0 border-t border-slate-200 bg-white no-print"
            aria-label="Navigasi utama"
          >
            {mobileTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-label={label}
                aria-current={activeTab === id ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[48px] py-1.5 text-[11px] font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600",
                  activeTab === id
                    ? "text-blue-700 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    activeTab === id ? "text-blue-700" : "text-slate-500"
                  )}
                  strokeWidth={activeTab === id ? 2.2 : 1.75}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}

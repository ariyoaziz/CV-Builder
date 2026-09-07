"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useCVStore } from "@/store/useCVStore";
import { TemplateToolbar } from "@/features/preview/template-toolbar";
import { TemplateRenderer } from "@/features/preview/template-renderer";

const A4_WIDTH_PX = 794; // 210mm at standard 96 DPI

/**
 * Preview Panel
 *
 * Sticky/scrollable preview area containing:
 * - TemplateToolbar (Template switcher, Accent color, Zoom controls)
 * - Scalable A4 canvas viewport
 * - Responsive auto-fit scaling on desktop and mobile
 */
export function PreviewPanel() {
  const cvData = useCVStore((state) => state.cvData);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<number>(0.8);
  const [isFit, setIsFit] = useState<boolean>(true);

  // Calculate fit-to-width zoom ratio
  const calculateFitZoom = useCallback(() => {
    if (!containerRef.current) return;
    const padding = 32; // Horizontal padding total
    const availableWidth = containerRef.current.clientWidth - padding;
    if (availableWidth > 0) {
      const computed = Math.min(Math.max(availableWidth / A4_WIDTH_PX, 0.35), 1.2);
      const rounded = Math.round(computed * 20) / 20;
      setZoom(rounded);
    }
  }, []);

  // Recalculate fit zoom on mount and container resize
  useEffect(() => {
    calculateFitZoom();

    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      if (isFit) {
        calculateFitZoom();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [calculateFitZoom, isFit]);

  const handleManualZoomChange = (nextZoom: number) => {
    setIsFit(false);
    setZoom(nextZoom);
  };

  const handleFitClick = () => {
    setIsFit(true);
    calculateFitZoom();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/90 overflow-hidden print:h-auto print:bg-transparent print:overflow-visible">
      {/* Interactive Controls Toolbar */}
      <TemplateToolbar
        zoom={zoom}
        onZoomChange={handleManualZoomChange}
        onFitZoom={handleFitClick}
        isFit={isFit}
      />

      {/* Scrollable Viewport */}
      <div
        ref={containerRef}
        id="cv-preview-viewport"
        className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start print:p-0 print:overflow-visible print:block print:w-auto print:h-auto"
        aria-label="Area pratinjau dokumen CV"
      >
        {/* Dimension wrapper ensuring scrollbars align with scaled dimensions */}
        <div
          style={{
            width: `${A4_WIDTH_PX * zoom}px`,
            transition: "width 150ms ease-out",
          }}
          className="print:w-auto print:max-w-none print:transform-none print:overflow-visible"
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: `${A4_WIDTH_PX}px`,
            }}
            className="print:transform-none print:w-auto print:max-w-none print:overflow-visible"
          >
            <TemplateRenderer data={cvData} />
          </div>
        </div>
      </div>
    </div>
  );
}

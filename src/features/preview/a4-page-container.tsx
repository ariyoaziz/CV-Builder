"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface A4PageContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A4 Page Container
 *
 * Physical A4 proportions: 210mm width, minimum 297mm height.
 * In the on-screen editor stage, this renders as a crisp white paper sheet
 * with standard editorial margins (18mm) and an ambient shadow.
 *
 * Multi-page content flows naturally without clipping:
 * - NO overflow: hidden
 * - NO fixed pixel heights
 * - Standard break-inside behaviors honored by browser print engine
 */
export const A4PageContainer = React.forwardRef<HTMLDivElement, A4PageContainerProps>(
  ({ children, className, style }, ref) => {
    return (
      <div
        ref={ref}
        id="printable-cv"
        role="document"
        aria-label="Dokumen CV A4"
        className={cn(
          "cv-document bg-white text-slate-900 shadow-xl transition-shadow",
          "w-[210mm] min-h-[297mm] p-[16mm]",
          "box-border print:shadow-none print:border-none print:w-[210mm] print:min-h-[297mm] print:p-[16mm]",
          className
        )}
        style={{
          width: "210mm",
          minHeight: "297mm",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);

A4PageContainer.displayName = "A4PageContainer";

"use client";

import React, { useMemo } from "react";
import type { CVData } from "@/types/cv.types";
import type { Language } from "@/i18n/types";
import { useTranslation } from "@/i18n";
import { ModernTemplate } from "@/features/preview/templates/modern-template";
import { MinimalTemplate } from "@/features/preview/templates/minimal-template";
import { ClassicTemplate } from "@/features/preview/templates/classic-template";
import { A4PageContainer } from "@/features/preview/a4-page-container";

interface TemplateRendererProps {
  data: CVData;
  language?: Language;
}

/**
 * Template Renderer
 *
 * Pluggable template dispatcher that receives canonical CVData,
 * checks metadata.templateId, dynamically selects the corresponding
 * template component, and mounts it inside the A4PageContainer.
 */
export function TemplateRenderer({ data, language }: TemplateRendererProps) {
  const { language: activeLanguage } = useTranslation();
  const lang = language ?? activeLanguage ?? "id";

  const templateId = data.metadata.templateId || "modern";
  const accentColor = data.metadata.accentColor || "#2563eb";

  const SelectedTemplate = useMemo(() => {
    switch (templateId) {
      case "minimal":
        return MinimalTemplate;
      case "classic":
        return ClassicTemplate;
      case "modern":
      default:
        return ModernTemplate;
    }
  }, [templateId]);

  return (
    <A4PageContainer
      className="template-scope"
      // Injects CSS variable for dynamic accent application
      style={
        {
          "--cv-accent": accentColor,
        } as React.CSSProperties
      }
    >
      <SelectedTemplate data={data} accentColor={accentColor} language={lang} />
    </A4PageContainer>
  );
}

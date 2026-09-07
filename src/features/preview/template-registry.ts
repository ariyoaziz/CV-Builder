import type { CVData, TemplateId } from "@/types/cv.types";
import type { Language } from "@/i18n/types";

/**
 * Curated professional accent colors ensuring high contrast (>= 4.5:1 against white).
 */
export interface AccentColorConfig {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
}

export const ACCENT_COLORS: AccentColorConfig[] = [
  {
    id: "blue",
    name: "Professional Blue",
    hex: "#2563eb",
    bgClass: "bg-blue-600",
    borderClass: "border-blue-600",
  },
  {
    id: "navy",
    name: "Deep Navy",
    hex: "#1e3a8a",
    bgClass: "bg-blue-950",
    borderClass: "border-blue-950",
  },
  {
    id: "slate",
    name: "Editorial Slate",
    hex: "#475569",
    bgClass: "bg-slate-600",
    borderClass: "border-slate-600",
  },
  {
    id: "emerald",
    name: "Emerald Green",
    hex: "#059669",
    bgClass: "bg-emerald-600",
    borderClass: "border-emerald-600",
  },
  {
    id: "burgundy",
    name: "Classic Burgundy",
    hex: "#881337",
    bgClass: "bg-rose-900",
    borderClass: "border-rose-900",
  },
];

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  badge: string;
  font: string;
}

export const TEMPLATES_CONFIG: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Layout kontemporer dengan masthead rapi, aksen vertikal, dan pill keahlian.",
    badge: "Populer",
    font: "Inter (Sans-serif)",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Desain editorial padat dengan garis tipis elegan dan teks keahlian terstruktur.",
    badge: "Teknis",
    font: "Outfit / Inter",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Format korporat/akademik formal dengan tajuk terpusat dan tipografi serif.",
    badge: "Formal",
    font: "Lora (Serif)",
  },
];

/**
 * Standard contract consumed by all CV template components.
 */
export interface CVTemplateProps {
  data: CVData;
  accentColor: string;
  language?: Language;
}

declare module "next/font/google" {
  import type { NextFontWithVariable } from "next/dist/compiled/@next/font";

  export type FontOptions = {
    subsets?: string[];
    weight?: string | string[];
    style?: string | string[];
    display?: "auto" | "block" | "swap" | "fallback" | "optional";
    variable?: string;
    preload?: boolean;
    fallback?: string[];
    adjustFontFallback?: boolean;
  };

  export function Inter(options?: FontOptions): NextFontWithVariable;
  export function Outfit(options?: FontOptions): NextFontWithVariable;
  export function Lora(options?: FontOptions): NextFontWithVariable;
  export function Merriweather(options?: FontOptions): NextFontWithVariable;
}

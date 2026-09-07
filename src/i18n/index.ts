import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Language, Translations } from "./types";
import { idTranslations } from "./id";
import { enTranslations } from "./en";

export type { Language, Translations };
export { idTranslations, enTranslations };

/**
 * Returns the translations dictionary for the given language.
 * Default is Indonesian ("id").
 */
export function getTranslations(lang: Language = "id"): Translations {
  return lang === "en" ? enTranslations : idTranslations;
}

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // Ignored
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignored
    }
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "id",
      setLanguage: (language: Language) => set({ language }),
    }),
    {
      name: "cv_app_language",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);

/**
 * Primary React hook for accessing the active translation dictionary and language setter.
 */
export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = getTranslations(language);

  return { t, language, setLanguage };
}

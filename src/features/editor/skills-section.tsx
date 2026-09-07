"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Lightbulb, Plus, Trash2, Edit3, Check, X, Tag } from "lucide-react";
import { useCVStore } from "@/store/useCVStore";
import { TagInput } from "@/components/shared/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n";

const SUGGESTED_CATEGORIES_ID = [
  "Keahlian Teknis",
  "Tools & Software",
  "Keahlian Interpersonal",
  "Bahasa",
  "Metodologi & Manajemen",
];

const SUGGESTED_CATEGORIES_EN = [
  "Technical Skills",
  "Tools & Software",
  "Interpersonal Skills",
  "Languages",
  "Methodologies & Management",
];

/**
 * Universal Industry-Neutral Skills Section.
 *
 * - Works across all professions (IT, Design, Marketing, Finance, HR, Healthcare, etc.)
 * - Categorization is completely optional and user-driven.
 * - Supports keyboard interaction (Enter, comma), paste multiple skills, delete tags.
 * - 100% semantic vector text with no progress bars or rating meters.
 */
export function SkillsSection() {
  const { t, language } = useTranslation();
  const defaultCategory = t.editor.skills.mainSkillsDefaultCategory;
  const suggestedCategories = language === "en" ? SUGGESTED_CATEGORIES_EN : SUGGESTED_CATEGORIES_ID;

  const skills = useCVStore((state) => state.cvData.skills);
  const setSkillsForCategory = useCVStore((state) => state.setSkillsForCategory);
  const removeSkillsByCategory = useCVStore((state) => state.removeSkillsByCategory);
  const renameSkillCategory = useCVStore((state) => state.renameSkillCategory);

  // Local state for newly created empty categories
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");
  const newCatInputRef = useRef<HTMLInputElement>(null);

  // Category rename state
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingCategory && newCatInputRef.current) {
      newCatInputRef.current.focus();
    }
  }, [isAddingCategory]);

  useEffect(() => {
    if (editingCategory && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [editingCategory]);

  /** Categories that actually have skills in the store */
  const populatedCategories = useMemo(() => {
    const list: string[] = [];
    for (const s of skills) {
      const cat = s.category?.trim() || defaultCategory;
      if (!list.some((c) => c.toLowerCase() === cat.toLowerCase())) {
        list.push(cat);
      }
    }
    return list;
  }, [skills, defaultCategory]);

  /** All active visible categories */
  const visibleCategories = useMemo(() => {
    const merged = [...populatedCategories];
    for (const extra of extraCategories) {
      if (!merged.some((c) => c.toLowerCase() === extra.toLowerCase())) {
        merged.push(extra);
      }
    }
    if (merged.length === 0) {
      return [defaultCategory];
    }
    return merged;
  }, [populatedCategories, extraCategories, defaultCategory]);

  const getSkillsForCategory = (cat: string): string[] => {
    const catLower = cat.trim().toLowerCase();
    return skills
      .filter((s) => (s.category?.trim() || defaultCategory).toLowerCase() === catLower)
      .map((s) => s.name);
  };

  const handleTagsChange = (cat: string, newTags: string[]) => {
    setSkillsForCategory(cat, newTags);
    // If the category is now populated, remove it from extraCategories
    setExtraCategories((prev) => prev.filter((c) => c.toLowerCase() !== cat.toLowerCase()));
  };

  const handleCreateCategory = (nameToCreate?: string) => {
    const name = (nameToCreate ?? newCatInput).trim();
    if (!name) return;

    const exists = visibleCategories.some((c) => c.toLowerCase() === name.toLowerCase());
    if (!exists) {
      setExtraCategories((prev) => [...prev, name]);
    }
    setNewCatInput("");
    setIsAddingCategory(false);
  };

  const handleDeleteCategory = (cat: string) => {
    removeSkillsByCategory(cat);
    setExtraCategories((prev) => prev.filter((c) => c.toLowerCase() !== cat.toLowerCase()));
    if (editingCategory === cat) {
      setEditingCategory(null);
    }
  };

  const handleStartRename = (cat: string) => {
    setEditingCategory(cat);
    setRenameInput(cat);
  };

  const handleSaveRename = (oldCat: string) => {
    const trimmed = renameInput.trim();
    if (trimmed && trimmed.toLowerCase() !== oldCat.toLowerCase()) {
      renameSkillCategory(oldCat, trimmed);
      setExtraCategories((prev) =>
        prev.map((c) => (c.toLowerCase() === oldCat.toLowerCase() ? trimmed : c))
      );
    }
    setEditingCategory(null);
  };

  const totalSkills = skills.length;

  return (
    <div className="space-y-4">
      {/* ATS Guidance banner */}
      <div
        className="flex items-start gap-2.5 rounded-lg bg-amber-50/90 border border-amber-200/80 p-3"
        role="note"
      >
        <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" strokeWidth={1.75} />
        <p className="text-xs text-amber-900 leading-relaxed">
          {language === "en"
            ? "Include skills relevant to your target roles. If a skill appears in the job description and you possess it, use exact matching terminology for maximum ATS recognition."
            : "Gunakan keahlian yang relevan dengan posisi yang Anda lamar. Jika suatu keahlian tercantum dalam deskripsi pekerjaan dan memang Anda kuasai, gunakan istilah yang sesuai agar lebih mudah dikenali oleh ATS dan recruiter."}
        </p>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {visibleCategories.map((cat) => {
          const currentTags = getSkillsForCategory(cat);
          const isSingleDefault = visibleCategories.length === 1 && cat === defaultCategory;
          const isEditingThis = editingCategory === cat;

          return (
            <div
              key={cat}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2.5 transition-colors focus-within:border-slate-300"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between gap-2">
                {isEditingThis ? (
                  <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                    <Input
                      ref={renameInputRef}
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(cat);
                        if (e.key === "Escape") setEditingCategory(null);
                      }}
                      className="h-7 text-xs font-semibold uppercase tracking-wider"
                      aria-label="Edit category name"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveRename(cat)}
                      className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      aria-label={t.common.save}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingCategory(null)}
                      className="h-7 w-7 text-slate-500 hover:text-slate-700"
                      aria-label={t.common.cancel}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {cat}
                    </span>
                    {currentTags.length > 0 && (
                      <span className="text-[11px] font-normal text-slate-400">
                        ({currentTags.length})
                      </span>
                    )}
                  </div>
                )}

                {/* Category Action Buttons (Hide delete if it's the only default category) */}
                {!isEditingThis && !isSingleDefault && (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartRename(cat)}
                      className="h-6 w-6 text-slate-400 hover:text-slate-700"
                      aria-label={`Edit ${cat}`}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(cat)}
                      className="h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${cat}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* TagInput */}
              <TagInput
                value={currentTags}
                onChange={(tags) => handleTagsChange(cat, tags)}
                placeholder={t.editor.skills.skillsListPlaceholder}
                aria-label={`Skills for category ${cat}`}
              />
            </div>
          );
        })}
      </div>

      {/* Add Category Section */}
      {isAddingCategory ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3 space-y-2.5">
          <p className="text-xs font-semibold text-blue-950">
            {language === "en" ? "New Category Name:" : "Nama Kategori Baru:"}
          </p>
          <div className="flex items-center gap-2">
            <Input
              ref={newCatInputRef}
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCategory();
                }
                if (e.key === "Escape") {
                  setIsAddingCategory(false);
                }
              }}
              placeholder={t.editor.skills.categoryPlaceholder}
              className="h-8 text-xs bg-white"
              aria-label={t.editor.skills.categoryName}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleCreateCategory()}
              disabled={!newCatInput.trim()}
              className="h-8 text-xs shrink-0"
            >
              {t.common.add}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAddingCategory(false);
                setNewCatInput("");
              }}
              className="h-8 text-xs text-slate-600 shrink-0"
            >
              {t.common.cancel}
            </Button>
          </div>

          {/* Neutral Suggestions */}
          <div className="space-y-1 pt-1">
            <p className="text-[11px] text-slate-500">
              {language === "en" ? "Quick suggestions:" : "Saran cepat:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedCategories.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleCreateCategory(sug)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddingCategory(true)}
          className="w-full text-xs font-medium border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 py-4 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          {t.editor.skills.addCategoryButton}
        </Button>
      )}

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
        <span>
          {language === "en"
            ? "Categories are optional and adaptable to your profession."
            : "Kategori bersifat opsional & dapat disesuaikan dengan profesi Anda."}
        </span>
        <span>
          {totalSkills} {language === "en" ? "skills saved" : "keahlian tersimpan"}
        </span>
      </div>
    </div>
  );
}


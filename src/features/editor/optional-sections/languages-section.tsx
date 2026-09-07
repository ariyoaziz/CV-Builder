"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Languages, EyeOff } from "lucide-react";
import { LanguageItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useTranslation } from "@/i18n";
import type { LanguageItem } from "@/types/cv.types";

interface LanguageItemFormProps {
  item: LanguageItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function LanguageItemForm({ item, isOpen, onToggle, onDelete }: LanguageItemFormProps) {
  const { t, language } = useTranslation();
  const updateLanguage = useCVStore((state) => state.updateLanguage);

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<LanguageItem>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(LanguageItemSchema) as any,
    defaultValues: {
      id: item.id,
      language: item.language,
      proficiency: item.proficiency || (language === "en" ? "Intermediate" : "Menengah"),
    },
    mode: "onBlur",
  });

  const dispatchUpdate = useCallback(
    (field: keyof LanguageItem, value: unknown) => {
      updateLanguage(item.id, { [field]: value });
    },
    [item.id, updateLanguage]
  );

  const handleBlur = (field: keyof LanguageItem) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const proficiencyOptions = [
    { value: language === "en" ? "Basic" : "Dasar", label: t.optionalSections.languages.proficiencies.basic },
    { value: language === "en" ? "Intermediate" : "Menengah", label: t.optionalSections.languages.proficiencies.intermediate },
    { value: language === "en" ? "Advanced" : "Mahir", label: t.optionalSections.languages.proficiencies.advanced },
    { value: language === "en" ? "Fluent" : "Fasih / Profesional", label: t.optionalSections.languages.proficiencies.fluent },
    { value: language === "en" ? "Native" : "Penutur Asli", label: t.optionalSections.languages.proficiencies.native },
  ];

  const newLanguageLabel = language === "en" ? "New Language" : "Bahasa baru";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.language || newLanguageLabel} (${item.proficiency})`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.language || newLanguageLabel}
          </p>
          <p className="text-xs text-slate-500 truncate">{item.proficiency}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={t.common.delete}
          className="flex items-center justify-center min-w-11 min-h-11 rounded text-slate-400 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-1 transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      {isOpen && (
        <div className="p-3 space-y-3 border-t border-slate-200 bg-white">
          <div>
            <Label htmlFor={`lang-name-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.languages.languageLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`lang-name-${item.id}`}
              placeholder={t.optionalSections.languages.languagePlaceholder}
              defaultValue={item.language}
              {...register("language")}
              onBlur={handleBlur("language")}
              aria-invalid={!!errors.language}
              aria-describedby={errors.language ? `lang-name-err-${item.id}` : undefined}
              aria-required
            />
            {errors.language && (
              <p id={`lang-name-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.language.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`lang-prof-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.languages.proficiencyLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <select
              id={`lang-prof-${item.id}`}
              defaultValue={item.proficiency}
              {...register("proficiency")}
              onChange={(e) => {
                dispatchUpdate("proficiency", e.target.value);
              }}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {proficiencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export function LanguagesSection() {
  const { t, language } = useTranslation();
  const languagesSection = useCVStore((state) => state.cvData.optionalSections?.languages);
  const items = languagesSection?.items ?? [];
  const addLanguage = useCVStore((state) => state.addLanguage);
  const removeLanguage = useCVStore((state) => state.removeLanguage);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: LanguageItem = {
      id: generateId(),
      language: "",
      proficiency: language === "en" ? "Intermediate" : "Menengah",
    };
    addLanguage(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeLanguage(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.languages.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("languages", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyStateCard
          icon={Languages}
          title={t.optionalSections.languages.emptyTitle}
          description={t.optionalSections.languages.emptyDesc}
          actionLabel={`+ ${t.optionalSections.languages.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <LanguageItemForm
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                onDelete={() => setDeleteTargetId(item.id)}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="w-full gap-1.5 text-xs mt-1 border-dashed"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.optionalSections.languages.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this language" : "bahasa ini"}
      />
    </div>
  );
}


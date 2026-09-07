"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ChevronUp, ChevronDown, Briefcase } from "lucide-react";
import { ExperienceItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { MonthYearPicker } from "@/components/shared/month-year-picker";
import { useTranslation } from "@/i18n";
import type { ExperienceItem } from "@/types/cv.types";
import { cn } from "@/lib/utils";

// Use full schema — id is provided in defaultValues so the resolver shape matches
type ExperienceFormData = ExperienceItem;

interface ExperienceItemFormProps {
  item: ExperienceItem;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ExperienceItemForm({
  item,
  index,
  total,
  isOpen,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ExperienceItemFormProps) {
  const { t, language } = useTranslation();
  const updateExperience = useCVStore((state) => state.updateExperience);

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ExperienceFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ExperienceItemSchema) as any,
    defaultValues: {
      id: item.id,
      company: item.company,
      position: item.position,
      location: item.location ?? "",
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      current: item.current,
      description: item.description ?? "",
    },
    mode: "onBlur",
  });

  const isCurrent = useWatch({ control, name: "current" });
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const dispatchUpdate = useCallback(
    (field: keyof ExperienceFormData, value: unknown) => {
      updateExperience(item.id, { [field]: value } as Partial<ExperienceItem>);
    },
    [item.id, updateExperience]
  );

  const handleBlur = (field: keyof ExperienceFormData) => async () => {
    await trigger(field);
    const val = getValues(field);
    dispatchUpdate(field, val);
  };

  const handleCurrentChange = (checked: boolean) => {
    setValue("current", checked);
    if (checked) {
      setValue("endDate", "");
      updateExperience(item.id, { current: true, endDate: "" });
    } else {
      updateExperience(item.id, { current: false });
    }
  };

  const newItemLabel = language === "en" ? "New Position" : "Posisi baru";
  const defaultCompanyLabel = language === "en" ? "Company" : "Perusahaan";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.position || newItemLabel} di ${item.company || defaultCompanyLabel}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        {/* Reorder buttons — visual 12px icons, but 44×44px touch targets */}
        <div className="flex flex-col gap-0 mr-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            aria-label={language === "en" ? "Move up" : "Pindah ke atas"}
            className="flex items-center justify-center min-w-11 min-h-11 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-1"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            aria-label={language === "en" ? "Move down" : "Pindah ke bawah"}
            className="flex items-center justify-center min-w-11 min-h-11 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-1"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.position || newItemLabel}
          </p>
          <p className="text-xs text-slate-500 truncate">{item.company}</p>
        </div>
        {/* Delete — 44×44px touch target */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label={t.common.delete}
          className="flex items-center justify-center min-w-11 min-h-11 rounded text-slate-400 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-1 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Expanded form */}
      {isOpen && (
        <div className="p-3 space-y-3 border-t border-slate-200 bg-white">
          {/* Company + Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`exp-company-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.experience.company} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`exp-company-${item.id}`}
                placeholder={t.editor.experience.companyPlaceholder}
                defaultValue={item.company}
                {...register("company")}
                onBlur={handleBlur("company")}
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? `exp-company-err-${item.id}` : undefined}
                aria-required
              />
              {errors.company && (
                <p id={`exp-company-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.company.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor={`exp-position-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.experience.position} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`exp-position-${item.id}`}
                placeholder={t.editor.experience.positionPlaceholder}
                defaultValue={item.position}
                {...register("position")}
                onBlur={handleBlur("position")}
                aria-invalid={!!errors.position}
                aria-describedby={errors.position ? `exp-position-err-${item.id}` : undefined}
                aria-required
              />
              {errors.position && (
                <p id={`exp-position-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.position.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor={`exp-location-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.experience.location}
            </Label>
            <Input
              id={`exp-location-${item.id}`}
              placeholder={t.editor.experience.locationPlaceholder}
              defaultValue={item.location ?? ""}
              {...register("location")}
              onBlur={handleBlur("location")}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <MonthYearPicker
              id={`exp-start-${item.id}`}
              label={t.editor.experience.startDate}
              required
              value={startDate}
              onChange={(val) => {
                setValue("startDate", val);
                dispatchUpdate("startDate", val);
              }}
              error={errors.startDate?.message}
            />
            <MonthYearPicker
              id={`exp-end-${item.id}`}
              label={t.editor.experience.endDate}
              value={isCurrent ? "" : endDate}
              disabled={isCurrent}
              onChange={(val) => {
                setValue("endDate", val);
                dispatchUpdate("endDate", val);
              }}
              error={errors.endDate?.message}
            />
          </div>

          {/* Current checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id={`exp-current-${item.id}`}
              checked={isCurrent}
              onCheckedChange={(checked) => handleCurrentChange(!!checked)}
            />
            <Label htmlFor={`exp-current-${item.id}`} className="text-xs text-slate-600 cursor-pointer">
              {t.editor.experience.currentJob}
            </Label>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor={`exp-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.experience.description}
            </Label>
            <Textarea
              id={`exp-desc-${item.id}`}
              placeholder={t.editor.experience.descriptionPlaceholder}
              defaultValue={item.description ?? ""}
              rows={4}
              {...register("description")}
              onBlur={handleBlur("description")}
              className="resize-none text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Experience section — manages the full list of work history entries.
 */
export function ExperienceSection() {
  const { t, language } = useTranslation();
  const items = useCVStore((state) => state.cvData.experience);
  const addExperience = useCVStore((state) => state.addExperience);
  const removeExperience = useCVStore((state) => state.removeExperience);
  const reorderExperience = useCVStore((state) => state.reorderExperience);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: generateId(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    addExperience(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeExperience(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <EmptyStateCard
          icon={Briefcase}
          title={t.editor.experience.emptyTitle}
          description={t.editor.experience.emptyDesc}
          actionLabel={`+ ${t.editor.experience.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item, index) => (
              <ExperienceItemForm
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                onDelete={() => setDeleteTargetId(item.id)}
                onMoveUp={() => reorderExperience(index, index - 1)}
                onMoveDown={() => reorderExperience(index, index + 1)}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className={cn("w-full gap-1.5 text-xs mt-1", items.length > 0 && "border-dashed")}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.editor.experience.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this experience entry" : "pengalaman kerja ini"}
      />
    </div>
  );
}


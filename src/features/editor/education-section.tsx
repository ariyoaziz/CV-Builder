"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ChevronUp, ChevronDown, GraduationCap } from "lucide-react";
import { EducationItemSchema } from "@/schemas/cv.schema";
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
import type { EducationItem } from "@/types/cv.types";

type EducationFormData = EducationItem;

interface EducationItemFormProps {
  item: EducationItem;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function EducationItemForm({
  item,
  index,
  total,
  isOpen,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: EducationItemFormProps) {
  const { t, language } = useTranslation();
  const updateEducation = useCVStore((state) => state.updateEducation);

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<EducationFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(EducationItemSchema) as any,
    defaultValues: {
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      field: item.field ?? "",
      location: item.location ?? "",
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      current: item.current,
      gpa: item.gpa ?? "",
      description: item.description ?? "",
    },
    mode: "onBlur",
  });

  const isCurrent = useWatch({ control, name: "current" });
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const dispatchUpdate = useCallback(
    (field: keyof EducationFormData, value: unknown) => {
      updateEducation(item.id, { [field]: value } as Partial<EducationItem>);
    },
    [item.id, updateEducation]
  );

  const handleBlur = (field: keyof EducationFormData) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const handleCurrentChange = (checked: boolean) => {
    setValue("current", checked);
    if (checked) {
      setValue("endDate", "");
      updateEducation(item.id, { current: true, endDate: "" });
    } else {
      updateEducation(item.id, { current: false });
    }
  };

  const newDegreeLabel = language === "en" ? "New Degree" : "Pendidikan baru";
  const defaultInstLabel = language === "en" ? "Institution" : "Institusi";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.degree || newDegreeLabel} di ${item.institution || defaultInstLabel}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        {/* Reorder buttons — 44×44px touch targets */}
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
            {item.degree || newDegreeLabel}
          </p>
          <p className="text-xs text-slate-500 truncate">{item.institution}</p>
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
          {/* Institution + Degree */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`edu-institution-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.education.institution} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`edu-institution-${item.id}`}
                placeholder={t.editor.education.institutionPlaceholder}
                defaultValue={item.institution}
                {...register("institution")}
                onBlur={handleBlur("institution")}
                aria-invalid={!!errors.institution}
                aria-describedby={errors.institution ? `edu-institution-err-${item.id}` : undefined}
                aria-required
              />
              {errors.institution && (
                <p id={`edu-institution-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.institution.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor={`edu-degree-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.education.degree} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`edu-degree-${item.id}`}
                placeholder={t.editor.education.degreePlaceholder}
                defaultValue={item.degree}
                {...register("degree")}
                onBlur={handleBlur("degree")}
                aria-invalid={!!errors.degree}
                aria-describedby={errors.degree ? `edu-degree-err-${item.id}` : undefined}
                aria-required
              />
              {errors.degree && (
                <p id={`edu-degree-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.degree.message}</p>
              )}
            </div>
          </div>

          {/* Field of study + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`edu-field-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.education.fieldOfStudy}
              </Label>
              <Input
                id={`edu-field-${item.id}`}
                placeholder={t.editor.education.fieldOfStudyPlaceholder}
                defaultValue={item.field ?? ""}
                {...register("field")}
                onBlur={handleBlur("field")}
              />
            </div>
            <div>
              <Label htmlFor={`edu-location-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.personalInfo.location}
              </Label>
              <Input
                id={`edu-location-${item.id}`}
                placeholder={t.editor.personalInfo.locationPlaceholder}
                defaultValue={item.location ?? ""}
                {...register("location")}
                onBlur={handleBlur("location")}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <MonthYearPicker
              id={`edu-start-${item.id}`}
              label={t.editor.education.startDate}
              required
              value={startDate}
              onChange={(val) => {
                setValue("startDate", val);
                dispatchUpdate("startDate", val);
              }}
              error={errors.startDate?.message}
            />
            <MonthYearPicker
              id={`edu-end-${item.id}`}
              label={t.editor.education.endDate}
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
              id={`edu-current-${item.id}`}
              checked={isCurrent}
              onCheckedChange={(checked) => handleCurrentChange(!!checked)}
            />
            <Label htmlFor={`edu-current-${item.id}`} className="text-xs text-slate-600 cursor-pointer">
              {t.editor.education.currentStudy}
            </Label>
          </div>

          {/* GPA — max 30 chars per schema */}
          <div>
            <Label htmlFor={`edu-gpa-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.education.gpa}
            </Label>
            <Input
              id={`edu-gpa-${item.id}`}
              placeholder={t.editor.education.gpaPlaceholder}
              maxLength={30}
              defaultValue={item.gpa ?? ""}
              {...register("gpa")}
              onBlur={handleBlur("gpa")}
            />
            {errors.gpa && (
              <p role="alert" className="mt-1 text-[11px] text-red-500">{errors.gpa.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor={`edu-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.education.description}
            </Label>
            <Textarea
              id={`edu-desc-${item.id}`}
              placeholder={t.editor.education.descriptionPlaceholder}
              defaultValue={item.description ?? ""}
              rows={3}
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
 * Education section — manages the full list of academic entries.
 */
export function EducationSection() {
  const { t, language } = useTranslation();
  const items = useCVStore((state) => state.cvData.education);
  const addEducation = useCVStore((state) => state.addEducation);
  const removeEducation = useCVStore((state) => state.removeEducation);
  const reorderEducation = useCVStore((state) => state.reorderEducation);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: EducationItem = {
      id: generateId(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    };
    addEducation(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeEducation(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <EmptyStateCard
          icon={GraduationCap}
          title={t.editor.education.emptyTitle}
          description={t.editor.education.emptyDesc}
          actionLabel={`+ ${t.editor.education.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item, index) => (
              <EducationItemForm
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                onDelete={() => setDeleteTargetId(item.id)}
                onMoveUp={() => reorderEducation(index, index - 1)}
                onMoveDown={() => reorderEducation(index, index + 1)}
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
            {t.editor.education.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this education entry" : "riwayat pendidikan ini"}
      />
    </div>
  );
}


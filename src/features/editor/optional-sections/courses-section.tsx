"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, BookOpen, EyeOff } from "lucide-react";
import { CourseItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useTranslation } from "@/i18n";
import type { CourseItem } from "@/types/cv.types";

interface CourseItemFormProps {
  item: CourseItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function CourseItemForm({ item, isOpen, onToggle, onDelete }: CourseItemFormProps) {
  const { t, language } = useTranslation();
  const updateCourse = useCVStore((state) => state.updateCourse);

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<CourseItem>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CourseItemSchema) as any,
    defaultValues: {
      id: item.id,
      title: item.title,
      provider: item.provider,
      date: item.date ?? "",
      duration: item.duration ?? "",
      description: item.description ?? "",
      url: item.url ?? "",
    },
    mode: "onBlur",
  });

  const dispatchUpdate = useCallback(
    (field: keyof CourseItem, value: unknown) => {
      updateCourse(item.id, { [field]: value });
    },
    [item.id, updateCourse]
  );

  const handleBlur = (field: keyof CourseItem) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const defaultTitle = language === "en" ? "New Course" : "Kursus baru";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.title || defaultTitle} — ${item.provider || ""}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.title || defaultTitle}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {item.provider} {item.duration ? `• ${item.duration}` : ""}
          </p>
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
            <Label htmlFor={`course-title-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.courses.nameLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`course-title-${item.id}`}
              placeholder={t.optionalSections.courses.namePlaceholder}
              defaultValue={item.title}
              {...register("title")}
              onBlur={handleBlur("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? `course-title-err-${item.id}` : undefined}
              aria-required
            />
            {errors.title && (
              <p id={`course-title-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`course-prov-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.courses.providerLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`course-prov-${item.id}`}
                placeholder={t.optionalSections.courses.providerPlaceholder}
                defaultValue={item.provider}
                {...register("provider")}
                onBlur={handleBlur("provider")}
                aria-invalid={!!errors.provider}
                aria-required
              />
              {errors.provider && (
                <p role="alert" className="mt-1 text-[11px] text-red-500">
                  {errors.provider.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`course-dur-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {language === "en" ? "Duration / Date (optional)" : "Durasi / Tanggal (opsional)"}
              </Label>
              <Input
                id={`course-dur-${item.id}`}
                placeholder={language === "en" ? "e.g. 40 Hours / 2025" : "Contoh: 40 Jam / 2025"}
                defaultValue={item.duration}
                {...register("duration")}
                onBlur={handleBlur("duration")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`course-url-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.courses.certificateUrlLabel}
            </Label>
            <Input
              id={`course-url-${item.id}`}
              type="url"
              placeholder={t.optionalSections.courses.certificateUrlPlaceholder}
              defaultValue={item.url}
              {...register("url")}
              onBlur={handleBlur("url")}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.url.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`course-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {language === "en" ? "Description / Skills (optional)" : "Deskripsi Materi / Keterampilan (opsional)"}
            </Label>
            <Textarea
              id={`course-desc-${item.id}`}
              placeholder={language === "en" ? "Key skills and takeaways..." : "Materi inti yang dipelajari..."}
              defaultValue={item.description}
              rows={2}
              {...register("description")}
              onBlur={handleBlur("description")}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function CoursesSection() {
  const { t, language } = useTranslation();
  const coursesSection = useCVStore((state) => state.cvData.optionalSections?.courses);
  const items = coursesSection?.items ?? [];
  const addCourse = useCVStore((state) => state.addCourse);
  const removeCourse = useCVStore((state) => state.removeCourse);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: CourseItem = {
      id: generateId(),
      title: "",
      provider: "",
      date: "",
      duration: "",
      description: "",
      url: "",
    };
    addCourse(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeCourse(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.courses.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("courses", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyStateCard
          icon={BookOpen}
          title={t.optionalSections.courses.emptyTitle}
          description={t.optionalSections.courses.emptyDesc}
          actionLabel={`+ ${t.optionalSections.courses.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <CourseItemForm
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
            {t.optionalSections.courses.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this course" : "kursus ini"}
      />
    </div>
  );
}

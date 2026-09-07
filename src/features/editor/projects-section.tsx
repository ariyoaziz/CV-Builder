"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ChevronUp, ChevronDown, FolderGit2 } from "lucide-react";
import { ProjectItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/tag-input";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { MonthYearPicker } from "@/components/shared/month-year-picker";
import { useTranslation } from "@/i18n";
import type { ProjectItem } from "@/types/cv.types";
import { cn } from "@/lib/utils";

type ProjectFormData = ProjectItem;

interface ProjectItemFormProps {
  item: ProjectItem;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ProjectItemForm({
  item,
  index,
  total,
  isOpen,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ProjectItemFormProps) {
  const { t, language } = useTranslation();
  const updateProject = useCVStore((state) => state.updateProject);

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ProjectFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(ProjectItemSchema) as any,
    defaultValues: {
      id: item.id,
      name: item.name,
      role: item.role ?? "",
      technologies: item.technologies ?? [],
      url: item.url ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
      description: item.description ?? "",
    },
    mode: "onBlur",
  });

  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });
  const technologies = useWatch({ control, name: "technologies" });

  const dispatchUpdate = useCallback(
    (field: keyof ProjectFormData, value: unknown) => {
      updateProject(item.id, { [field]: value } as Partial<ProjectItem>);
    },
    [item.id, updateProject]
  );

  const handleBlur = (field: keyof ProjectFormData) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const newProjectLabel = language === "en" ? "New Project" : "Proyek baru";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.name || newProjectLabel}`}
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
            {item.name || newProjectLabel}
          </p>
          <p className="text-xs text-slate-500 truncate">{item.role}</p>
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
          {/* Name + Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`proj-name-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.projects.name} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`proj-name-${item.id}`}
                placeholder={t.editor.projects.namePlaceholder}
                defaultValue={item.name}
                {...register("name")}
                onBlur={handleBlur("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `proj-name-err-${item.id}` : undefined}
                aria-required
              />
              {errors.name && (
                <p id={`proj-name-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor={`proj-role-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.projects.role}
              </Label>
              <Input
                id={`proj-role-${item.id}`}
                placeholder={t.editor.projects.rolePlaceholder}
                defaultValue={item.role ?? ""}
                {...register("role")}
                onBlur={handleBlur("role")}
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <Label className="text-xs font-medium text-slate-600 mb-1 block">
              {language === "en" ? "Technologies" : "Teknologi"}
            </Label>
            <TagInput
              value={technologies ?? []}
              onChange={(tags) => {
                setValue("technologies", tags);
                dispatchUpdate("technologies", tags);
              }}
              placeholder={language === "en" ? "Next.js, TypeScript… (Enter or comma)" : "Next.js, TypeScript… (Enter atau koma)"}
              aria-label={language === "en" ? "Technologies used" : "Teknologi yang digunakan"}
            />
          </div>

          {/* URL */}
          <div>
            <Label htmlFor={`proj-url-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.projects.url}
            </Label>
            <Input
              id={`proj-url-${item.id}`}
              type="url"
              placeholder={t.editor.projects.urlPlaceholder}
              defaultValue={item.url ?? ""}
              {...register("url")}
              onBlur={handleBlur("url")}
              aria-invalid={!!errors.url}
            />
            {errors.url && (
              <p role="alert" className="mt-1 text-[11px] text-red-500">{errors.url.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <MonthYearPicker
              id={`proj-start-${item.id}`}
              label={t.editor.projects.startDate}
              value={startDate}
              onChange={(val) => {
                setValue("startDate", val);
                dispatchUpdate("startDate", val);
              }}
            />
            <MonthYearPicker
              id={`proj-end-${item.id}`}
              label={t.editor.projects.endDate}
              value={endDate}
              onChange={(val) => {
                setValue("endDate", val);
                dispatchUpdate("endDate", val);
              }}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor={`proj-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.projects.description}
            </Label>
            <Textarea
              id={`proj-desc-${item.id}`}
              placeholder={t.editor.projects.descriptionPlaceholder}
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
 * Projects section — manages portfolio and side project entries.
 */
export function ProjectsSection() {
  const { t, language } = useTranslation();
  const items = useCVStore((state) => state.cvData.projects);
  const addProject = useCVStore((state) => state.addProject);
  const removeProject = useCVStore((state) => state.removeProject);
  const reorderProject = useCVStore((state) => state.reorderProject);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: generateId(),
      name: "",
      role: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    addProject(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeProject(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <EmptyStateCard
          icon={FolderGit2}
          title={t.editor.projects.emptyTitle}
          description={t.editor.projects.emptyDesc}
          actionLabel={`+ ${t.editor.projects.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item, index) => (
              <ProjectItemForm
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                onDelete={() => setDeleteTargetId(item.id)}
                onMoveUp={() => reorderProject(index, index - 1)}
                onMoveDown={() => reorderProject(index, index + 1)}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className={cn("w-full gap-1.5 text-xs mt-1 border-dashed")}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.editor.projects.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this project" : "proyek ini"}
      />
    </div>
  );
}


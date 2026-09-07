"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Trophy, EyeOff } from "lucide-react";
import { AwardItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useTranslation } from "@/i18n";
import type { AwardItem } from "@/types/cv.types";

interface AwardItemFormProps {
  item: AwardItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function AwardItemForm({ item, isOpen, onToggle, onDelete }: AwardItemFormProps) {
  const { t, language } = useTranslation();
  const updateAward = useCVStore((state) => state.updateAward);

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<AwardItem>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(AwardItemSchema) as any,
    defaultValues: {
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      description: item.description ?? "",
    },
    mode: "onBlur",
  });

  const dispatchUpdate = useCallback(
    (field: keyof AwardItem, value: unknown) => {
      updateAward(item.id, { [field]: value });
    },
    [item.id, updateAward]
  );

  const handleBlur = (field: keyof AwardItem) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const defaultTitle = language === "en" ? "New Award" : "Penghargaan baru";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.title || defaultTitle} — ${item.issuer || ""}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.title || defaultTitle}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {item.issuer} {item.date ? `(${item.date})` : ""}
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
            <Label htmlFor={`award-title-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.awards.nameLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`award-title-${item.id}`}
              placeholder={t.optionalSections.awards.namePlaceholder}
              defaultValue={item.title}
              {...register("title")}
              onBlur={handleBlur("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? `award-title-err-${item.id}` : undefined}
              aria-required
            />
            {errors.title && (
              <p id={`award-title-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`award-issuer-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.awards.issuerLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`award-issuer-${item.id}`}
                placeholder={t.optionalSections.awards.issuerPlaceholder}
                defaultValue={item.issuer}
                {...register("issuer")}
                onBlur={handleBlur("issuer")}
                aria-invalid={!!errors.issuer}
                aria-required
              />
              {errors.issuer && (
                <p role="alert" className="mt-1 text-[11px] text-red-500">
                  {errors.issuer.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`award-date-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.awards.dateLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`award-date-${item.id}`}
                placeholder="2025"
                defaultValue={item.date}
                {...register("date")}
                onBlur={handleBlur("date")}
                aria-invalid={!!errors.date}
                aria-required
              />
              {errors.date && (
                <p role="alert" className="mt-1 text-[11px] text-red-500">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor={`award-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.awards.descriptionLabel}
            </Label>
            <Textarea
              id={`award-desc-${item.id}`}
              placeholder={t.optionalSections.awards.descriptionPlaceholder}
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

export function AwardsSection() {
  const { t, language } = useTranslation();
  const awardsSection = useCVStore((state) => state.cvData.optionalSections?.awards);
  const items = awardsSection?.items ?? [];
  const addAward = useCVStore((state) => state.addAward);
  const removeAward = useCVStore((state) => state.removeAward);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: AwardItem = {
      id: generateId(),
      title: "",
      issuer: "",
      date: "",
      description: "",
    };
    addAward(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeAward(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.awards.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("awards", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyStateCard
          icon={Trophy}
          title={t.optionalSections.awards.emptyTitle}
          description={t.optionalSections.awards.emptyDesc}
          actionLabel={`+ ${t.optionalSections.awards.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <AwardItemForm
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
            {t.optionalSections.awards.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this award" : "penghargaan ini"}
      />
    </div>
  );
}

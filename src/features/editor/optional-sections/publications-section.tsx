"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Newspaper, EyeOff } from "lucide-react";
import { PublicationItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useTranslation } from "@/i18n";
import type { PublicationItem } from "@/types/cv.types";

interface PublicationItemFormProps {
  item: PublicationItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function PublicationItemForm({ item, isOpen, onToggle, onDelete }: PublicationItemFormProps) {
  const { t, language } = useTranslation();
  const updatePublication = useCVStore((state) => state.updatePublication);

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<PublicationItem>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PublicationItemSchema) as any,
    defaultValues: {
      id: item.id,
      title: item.title,
      type: item.type ?? "",
      publisher: item.publisher,
      date: item.date,
      url: item.url ?? "",
      description: item.description ?? "",
    },
    mode: "onBlur",
  });

  const dispatchUpdate = useCallback(
    (field: keyof PublicationItem, value: unknown) => {
      updatePublication(item.id, { [field]: value });
    },
    [item.id, updatePublication]
  );

  const handleBlur = (field: keyof PublicationItem) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const defaultTitle = language === "en" ? "New Publication" : "Publikasi baru";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.title || defaultTitle} — ${item.publisher || ""}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.title || defaultTitle}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {item.publisher} {item.date ? `(${item.date})` : ""}
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
            <Label htmlFor={`pub-title-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.publications.titleLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`pub-title-${item.id}`}
              placeholder={t.optionalSections.publications.titlePlaceholder}
              defaultValue={item.title}
              {...register("title")}
              onBlur={handleBlur("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? `pub-title-err-${item.id}` : undefined}
              aria-required
            />
            {errors.title && (
              <p id={`pub-title-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`pub-pub-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.publications.publisherLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`pub-pub-${item.id}`}
                placeholder={t.optionalSections.publications.publisherPlaceholder}
                defaultValue={item.publisher}
                {...register("publisher")}
                onBlur={handleBlur("publisher")}
                aria-invalid={!!errors.publisher}
                aria-required
              />
              {errors.publisher && (
                <p role="alert" className="mt-1 text-[11px] text-red-500">
                  {errors.publisher.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`pub-date-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.publications.dateLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`pub-date-${item.id}`}
                placeholder="YYYY-MM"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`pub-type-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.publications.typeLabel}
              </Label>
              <Input
                id={`pub-type-${item.id}`}
                placeholder={t.optionalSections.publications.typePlaceholder}
                defaultValue={item.type}
                {...register("type")}
                onBlur={handleBlur("type")}
              />
            </div>

            <div>
              <Label htmlFor={`pub-url-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.publications.urlLabel}
              </Label>
              <Input
                id={`pub-url-${item.id}`}
                type="url"
                placeholder={t.optionalSections.publications.urlPlaceholder}
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
          </div>

          <div>
            <Label htmlFor={`pub-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.publications.descriptionLabel}
            </Label>
            <Textarea
              id={`pub-desc-${item.id}`}
              placeholder={t.optionalSections.publications.descriptionPlaceholder}
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

export function PublicationsSection() {
  const { t, language } = useTranslation();
  const publicationsSection = useCVStore((state) => state.cvData.optionalSections?.publications);
  const items = publicationsSection?.items ?? [];
  const addPublication = useCVStore((state) => state.addPublication);
  const removePublication = useCVStore((state) => state.removePublication);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: PublicationItem = {
      id: generateId(),
      title: "",
      publisher: "",
      date: "",
      type: "",
      url: "",
      description: "",
    };
    addPublication(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removePublication(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.publications.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("publications", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyStateCard
          icon={Newspaper}
          title={t.optionalSections.publications.emptyTitle}
          description={t.optionalSections.publications.emptyDesc}
          actionLabel={`+ ${t.optionalSections.publications.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <PublicationItemForm
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
            {t.optionalSections.publications.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this publication" : "publikasi ini"}
      />
    </div>
  );
}

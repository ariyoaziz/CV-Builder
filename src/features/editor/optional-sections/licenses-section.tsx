"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileCheck2, EyeOff } from "lucide-react";
import { LicenseItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useTranslation } from "@/i18n";
import type { LicenseItem } from "@/types/cv.types";

interface LicenseItemFormProps {
  item: LicenseItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function LicenseItemForm({ item, isOpen, onToggle, onDelete }: LicenseItemFormProps) {
  const { t, language } = useTranslation();
  const updateLicense = useCVStore((state) => state.updateLicense);

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<LicenseItem>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(LicenseItemSchema) as any,
    defaultValues: {
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      licenseNumber: item.licenseNumber ?? "",
      issueDate: item.issueDate,
      expiryDate: item.expiryDate ?? "",
      url: item.url ?? "",
    },
    mode: "onBlur",
  });

  const dispatchUpdate = useCallback(
    (field: keyof LicenseItem, value: unknown) => {
      updateLicense(item.id, { [field]: value });
    },
    [item.id, updateLicense]
  );

  const handleBlur = (field: keyof LicenseItem) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const defaultTitle = language === "en" ? "New License" : "Lisensi baru";

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
            {item.issuer} {item.licenseNumber ? `(No: ${item.licenseNumber})` : ""}
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
            <Label htmlFor={`lic-title-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.licenses.nameLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`lic-title-${item.id}`}
              placeholder={t.optionalSections.licenses.namePlaceholder}
              defaultValue={item.title}
              {...register("title")}
              onBlur={handleBlur("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? `lic-title-err-${item.id}` : undefined}
              aria-required
            />
            {errors.title && (
              <p id={`lic-title-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`lic-issuer-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.licenses.issuerLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`lic-issuer-${item.id}`}
                placeholder={t.optionalSections.licenses.issuerPlaceholder}
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
              <Label htmlFor={`lic-num-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.licenses.licenseNumberLabel}
              </Label>
              <Input
                id={`lic-num-${item.id}`}
                placeholder={t.optionalSections.licenses.licenseNumberPlaceholder}
                defaultValue={item.licenseNumber}
                {...register("licenseNumber")}
                onBlur={handleBlur("licenseNumber")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`lic-issue-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.licenses.issueDateLabel} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`lic-issue-${item.id}`}
                placeholder="YYYY-MM"
                defaultValue={item.issueDate}
                {...register("issueDate")}
                onBlur={handleBlur("issueDate")}
                aria-invalid={!!errors.issueDate}
                aria-required
              />
              {errors.issueDate && (
                <p role="alert" className="mt-1 text-[11px] text-red-500">
                  {errors.issueDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor={`lic-exp-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.optionalSections.licenses.expiryDateLabel}
              </Label>
              <Input
                id={`lic-exp-${item.id}`}
                placeholder="YYYY-MM"
                defaultValue={item.expiryDate}
                {...register("expiryDate")}
                onBlur={handleBlur("expiryDate")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`lic-url-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {language === "en" ? "Verification URL (optional)" : "Tautan Verifikasi (opsional)"}
            </Label>
            <Input
              id={`lic-url-${item.id}`}
              type="url"
              placeholder="https://..."
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
      )}
    </div>
  );
}

export function LicensesSection() {
  const { t, language } = useTranslation();
  const licensesSection = useCVStore((state) => state.cvData.optionalSections?.licenses);
  const items = licensesSection?.items ?? [];
  const addLicense = useCVStore((state) => state.addLicense);
  const removeLicense = useCVStore((state) => state.removeLicense);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: LicenseItem = {
      id: generateId(),
      title: "",
      issuer: "",
      licenseNumber: "",
      issueDate: "",
      expiryDate: "",
      url: "",
    };
    addLicense(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeLicense(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.licenses.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("licenses", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyStateCard
          icon={FileCheck2}
          title={t.optionalSections.licenses.emptyTitle}
          description={t.optionalSections.licenses.emptyDesc}
          actionLabel={`+ ${t.optionalSections.licenses.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <LicenseItemForm
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
            {t.optionalSections.licenses.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this license" : "lisensi ini"}
      />
    </div>
  );
}

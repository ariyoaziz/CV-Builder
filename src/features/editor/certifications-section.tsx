"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Award } from "lucide-react";
import { CertificationItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { MonthYearPicker } from "@/components/shared/month-year-picker";
import { useTranslation } from "@/i18n";
import type { CertificationItem } from "@/types/cv.types";

type CertFormData = CertificationItem;

interface CertItemFormProps {
  item: CertificationItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function CertItemForm({ item, isOpen, onToggle, onDelete }: CertItemFormProps) {
  const { t, language } = useTranslation();
  const updateCertification = useCVStore((state) => state.updateCertification);

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<CertFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CertificationItemSchema) as any,
    defaultValues: {
      id: item.id,
      name: item.name,
      issuer: item.issuer,
      issueDate: item.issueDate,
      expiryDate: item.expiryDate ?? "",
      credentialUrl: item.credentialUrl ?? "",
    },
    mode: "onBlur",
  });

  const issueDate = useWatch({ control, name: "issueDate" });
  const expiryDate = useWatch({ control, name: "expiryDate" });

  const dispatchUpdate = useCallback(
    (field: keyof CertFormData, value: unknown) => {
      updateCertification(item.id, { [field]: value } as Partial<CertificationItem>);
    },
    [item.id, updateCertification]
  );

  const handleBlur = (field: keyof CertFormData) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const newCertLabel = language === "en" ? "New Certification" : "Sertifikasi baru";
  const defaultIssuerLabel = language === "en" ? "Issuer" : "Penerbit";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.name || newCertLabel} dari ${item.issuer || defaultIssuerLabel}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.name || newCertLabel}
          </p>
          <p className="text-xs text-slate-500 truncate">{item.issuer}</p>
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
          {/* Name */}
          <div>
            <Label htmlFor={`cert-name-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.certifications.name} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`cert-name-${item.id}`}
              placeholder={t.editor.certifications.namePlaceholder}
              defaultValue={item.name}
              {...register("name")}
              onBlur={handleBlur("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `cert-name-err-${item.id}` : undefined}
              aria-required
            />
            {errors.name && (
              <p id={`cert-name-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Issuer */}
          <div>
            <Label htmlFor={`cert-issuer-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.certifications.issuer} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`cert-issuer-${item.id}`}
              placeholder={t.editor.certifications.issuerPlaceholder}
              defaultValue={item.issuer}
              {...register("issuer")}
              onBlur={handleBlur("issuer")}
              aria-invalid={!!errors.issuer}
              aria-describedby={errors.issuer ? `cert-issuer-err-${item.id}` : undefined}
              aria-required
            />
            {errors.issuer && (
              <p id={`cert-issuer-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.issuer.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <MonthYearPicker
              id={`cert-issue-${item.id}`}
              label={t.editor.certifications.issueDate}
              required
              value={issueDate}
              onChange={(val) => {
                setValue("issueDate", val);
                dispatchUpdate("issueDate", val);
              }}
              error={errors.issueDate?.message}
            />
            <MonthYearPicker
              id={`cert-expiry-${item.id}`}
              label={`${t.editor.certifications.expiryDate} (${t.common.optional})`}
              value={expiryDate}
              onChange={(val) => {
                setValue("expiryDate", val);
                dispatchUpdate("expiryDate", val);
              }}
            />
          </div>

          {/* Credential URL */}
          <div>
            <Label htmlFor={`cert-url-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.certifications.url} ({t.common.optional})
            </Label>
            <Input
              id={`cert-url-${item.id}`}
              type="url"
              placeholder={t.editor.certifications.urlPlaceholder}
              defaultValue={item.credentialUrl ?? ""}
              {...register("credentialUrl")}
              onBlur={handleBlur("credentialUrl")}
              aria-invalid={!!errors.credentialUrl}
            />
            {errors.credentialUrl && (
              <p role="alert" className="mt-1 text-[11px] text-red-500">{errors.credentialUrl.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Certifications section.
 * Chronological order managed implicitly by issueDate — no manual reorder.
 */
export function CertificationsSection() {
  const { t, language } = useTranslation();
  const items = useCVStore((state) => state.cvData.certifications);
  const addCertification = useCVStore((state) => state.addCertification);
  const removeCertification = useCVStore((state) => state.removeCertification);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: CertificationItem = {
      id: generateId(),
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialUrl: "",
    };
    addCertification(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeCertification(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <EmptyStateCard
          icon={Award}
          title={t.editor.certifications.emptyTitle}
          description={t.editor.certifications.emptyDesc}
          actionLabel={`+ ${t.editor.certifications.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <CertItemForm
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
            {t.editor.certifications.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this certification" : "sertifikasi ini"}
      />
    </div>
  );
}


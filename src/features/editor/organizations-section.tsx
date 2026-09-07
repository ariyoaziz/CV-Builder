"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ChevronUp, ChevronDown, Users } from "lucide-react";
import { OrganizationItemSchema } from "@/schemas/cv.schema";
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
import type { OrganizationItem } from "@/types/cv.types";
import { cn } from "@/lib/utils";

type OrgFormData = OrganizationItem;

interface OrgItemFormProps {
  item: OrganizationItem;
  index: number;
  total: number;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function OrgItemForm({
  item,
  index,
  total,
  isOpen,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: OrgItemFormProps) {
  const { t, language } = useTranslation();
  const updateOrganization = useCVStore((state) => state.updateOrganization);

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<OrgFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(OrganizationItemSchema) as any,
    defaultValues: {
      id: item.id,
      organization: item.organization,
      position: item.position,
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
    (field: keyof OrgFormData, value: unknown) => {
      updateOrganization(item.id, { [field]: value } as Partial<OrganizationItem>);
    },
    [item.id, updateOrganization]
  );

  const handleBlur = (field: keyof OrgFormData) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const handleCurrentChange = (checked: boolean) => {
    setValue("current", checked);
    if (checked) {
      setValue("endDate", "");
      updateOrganization(item.id, { current: true, endDate: "" });
    } else {
      updateOrganization(item.id, { current: false });
    }
  };

  const newPositionLabel = language === "en" ? "New Position" : "Jabatan baru";
  const defaultOrgLabel = language === "en" ? "Organization" : "Organisasi";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.position || newPositionLabel} di ${item.organization || defaultOrgLabel}`}
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
            {item.position || newPositionLabel}
          </p>
          <p className="text-xs text-slate-500 truncate">{item.organization}</p>
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
          {/* Organization + Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`org-org-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.organizations.name} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`org-org-${item.id}`}
                placeholder={t.editor.organizations.namePlaceholder}
                defaultValue={item.organization}
                {...register("organization")}
                onBlur={handleBlur("organization")}
                aria-invalid={!!errors.organization}
                aria-describedby={errors.organization ? `org-org-err-${item.id}` : undefined}
                aria-required
              />
              {errors.organization && (
                <p id={`org-org-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.organization.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor={`org-pos-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
                {t.editor.organizations.role} <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id={`org-pos-${item.id}`}
                placeholder={t.editor.organizations.rolePlaceholder}
                defaultValue={item.position}
                {...register("position")}
                onBlur={handleBlur("position")}
                aria-invalid={!!errors.position}
                aria-describedby={errors.position ? `org-pos-err-${item.id}` : undefined}
                aria-required
              />
              {errors.position && (
                <p id={`org-pos-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">{errors.position.message}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <MonthYearPicker
              id={`org-start-${item.id}`}
              label={t.editor.organizations.startDate}
              required
              value={startDate}
              onChange={(val) => {
                setValue("startDate", val);
                dispatchUpdate("startDate", val);
              }}
              error={errors.startDate?.message}
            />
            <MonthYearPicker
              id={`org-end-${item.id}`}
              label={t.editor.organizations.endDate}
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
              id={`org-current-${item.id}`}
              checked={isCurrent}
              onCheckedChange={(checked) => handleCurrentChange(!!checked)}
            />
            <Label htmlFor={`org-current-${item.id}`} className="text-xs text-slate-600 cursor-pointer">
              {t.editor.organizations.currentRole}
            </Label>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor={`org-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.editor.organizations.description}
            </Label>
            <Textarea
              id={`org-desc-${item.id}`}
              placeholder={t.editor.organizations.descriptionPlaceholder}
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
 * Organizations section — manages extracurricular and community leadership entries.
 */
export function OrganizationsSection() {
  const { t, language } = useTranslation();
  const items = useCVStore((state) => state.cvData.organizations);
  const addOrganization = useCVStore((state) => state.addOrganization);
  const removeOrganization = useCVStore((state) => state.removeOrganization);
  const reorderOrganization = useCVStore((state) => state.reorderOrganization);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: OrganizationItem = {
      id: generateId(),
      organization: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    addOrganization(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeOrganization(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <EmptyStateCard
          icon={Users}
          title={t.editor.organizations.emptyTitle}
          description={t.editor.organizations.emptyDesc}
          actionLabel={`+ ${t.editor.organizations.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item, index) => (
              <OrgItemForm
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                onDelete={() => setDeleteTargetId(item.id)}
                onMoveUp={() => reorderOrganization(index, index - 1)}
                onMoveDown={() => reorderOrganization(index, index + 1)}
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
            {t.editor.organizations.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this organization entry" : "entri organisasi ini"}
      />
    </div>
  );
}


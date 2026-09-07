"use client";

import { useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, HeartHandshake, EyeOff } from "lucide-react";
import { VolunteerItemSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { generateId } from "@/utils/id.utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyStateCard } from "@/components/shared/empty-state-card";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { MonthYearPicker } from "@/components/shared/month-year-picker";
import { useTranslation } from "@/i18n";
import type { VolunteerItem } from "@/types/cv.types";

interface VolunteerItemFormProps {
  item: VolunteerItem;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function VolunteerItemForm({ item, isOpen, onToggle, onDelete }: VolunteerItemFormProps) {
  const { t, language } = useTranslation();
  const updateVolunteer = useCVStore((state) => state.updateVolunteer);

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<VolunteerItem>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(VolunteerItemSchema) as any,
    defaultValues: {
      id: item.id,
      organization: item.organization,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      current: item.current ?? false,
      description: item.description ?? "",
    },
    mode: "onBlur",
  });

  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });
  const current = useWatch({ control, name: "current" });

  const dispatchUpdate = useCallback(
    (field: keyof VolunteerItem, value: unknown) => {
      updateVolunteer(item.id, { [field]: value });
    },
    [item.id, updateVolunteer]
  );

  const handleBlur = (field: keyof VolunteerItem) => async () => {
    await trigger(field);
    dispatchUpdate(field, getValues(field));
  };

  const defaultTitle = language === "en" ? "New Volunteer Role" : "Peran relawan baru";

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggle}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${item.role || defaultTitle} — ${item.organization || ""}`}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">
            {item.role || defaultTitle}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {item.organization} {item.startDate ? `• ${item.startDate}` : ""}
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
            <Label htmlFor={`vol-role-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.volunteer.roleLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`vol-role-${item.id}`}
              placeholder={t.optionalSections.volunteer.rolePlaceholder}
              defaultValue={item.role}
              {...register("role")}
              onBlur={handleBlur("role")}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? `vol-role-err-${item.id}` : undefined}
              aria-required
            />
            {errors.role && (
              <p id={`vol-role-err-${item.id}`} role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.role.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor={`vol-org-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.volunteer.organizationLabel} <span className="text-red-500" aria-hidden="true">*</span>
            </Label>
            <Input
              id={`vol-org-${item.id}`}
              placeholder={t.optionalSections.volunteer.organizationPlaceholder}
              defaultValue={item.organization}
              {...register("organization")}
              onBlur={handleBlur("organization")}
              aria-invalid={!!errors.organization}
              aria-required
            />
            {errors.organization && (
              <p role="alert" className="mt-1 text-[11px] text-red-500">
                {errors.organization.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MonthYearPicker
              id={`vol-start-${item.id}`}
              label={t.optionalSections.volunteer.startDateLabel}
              required
              value={startDate}
              onChange={(val) => {
                setValue("startDate", val);
                dispatchUpdate("startDate", val);
              }}
              error={errors.startDate?.message}
            />
            <MonthYearPicker
              id={`vol-end-${item.id}`}
              label={t.optionalSections.volunteer.endDateLabel}
              value={endDate}
              disabled={current}
              onChange={(val) => {
                setValue("endDate", val);
                dispatchUpdate("endDate", val);
              }}
              error={errors.endDate?.message}
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id={`vol-current-${item.id}`}
              checked={current}
              onCheckedChange={(checked) => {
                const val = Boolean(checked);
                setValue("current", val);
                dispatchUpdate("current", val);
                if (val) {
                  setValue("endDate", "");
                  dispatchUpdate("endDate", "");
                }
              }}
            />
            <Label htmlFor={`vol-current-${item.id}`} className="text-xs font-normal text-slate-700 cursor-pointer">
              {t.optionalSections.volunteer.currentRole}
            </Label>
          </div>

          <div>
            <Label htmlFor={`vol-desc-${item.id}`} className="text-xs font-medium text-slate-600 mb-1 block">
              {t.optionalSections.volunteer.descriptionLabel}
            </Label>
            <Textarea
              id={`vol-desc-${item.id}`}
              placeholder={t.optionalSections.volunteer.descriptionPlaceholder}
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

export function VolunteerSection() {
  const { t, language } = useTranslation();
  const volunteerSection = useCVStore((state) => state.cvData.optionalSections?.volunteer);
  const items = volunteerSection?.items ?? [];
  const addVolunteer = useCVStore((state) => state.addVolunteer);
  const removeVolunteer = useCVStore((state) => state.removeVolunteer);
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);

  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: VolunteerItem = {
      id: generateId(),
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    addVolunteer(newItem);
    setOpenId(newItem.id);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      removeVolunteer(deleteTargetId);
      if (openId === deleteTargetId) setOpenId(null);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs text-slate-500">
          {t.optionalSections.volunteer.helper}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleOptionalSection("volunteer", false)}
          className="h-7 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50"
        >
          <EyeOff className="h-3 w-3 mr-1" />
          {t.editor.optionalSectionPicker.hideSection}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyStateCard
          icon={HeartHandshake}
          title={t.optionalSections.volunteer.emptyTitle}
          description={t.optionalSections.volunteer.emptyDesc}
          actionLabel={`+ ${t.optionalSections.volunteer.addButton}`}
          onAction={handleAdd}
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <VolunteerItemForm
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
            {t.optionalSections.volunteer.addButton}
          </Button>
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        itemLabel={language === "en" ? "this volunteer activity" : "kegiatan relawan ini"}
      />
    </div>
  );
}

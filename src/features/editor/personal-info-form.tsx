"use client";

import { useEffect, useRef, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { PersonalInfoSchema } from "@/schemas/cv.schema";
import { useCVStore } from "@/store/useCVStore";
import { compressImageToDataUri } from "@/utils/image.utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/i18n";
import type { PersonalInfo } from "@/types/cv.types";

/**
 * Personal Information section form.
 *
 * Fields: fullName, headline, email, phone, location, linkedin, github, website, photoUrl, showFullLinks
 *
 * Form ↔ Zustand sync:
 * - React Hook Form manages local buffer (no store update per keystroke).
 * - onChange fires debounced (300ms) dispatch to updatePersonalInfo().
 * - onBlur immediately flushes pending values to the store.
 *
 * Photo flow: file input → validate → canvas compress → data URI → Zustand → persistence.
 * Photo RENDERING in the CV template is deferred to Phase 5.
 */
export function PersonalInfoForm() {
  const { t } = useTranslation();
  const storeData = useCVStore((state) => state.cvData.personalInfo);
  const updatePersonalInfo = useCVStore((state) => state.updatePersonalInfo);

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfo>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(PersonalInfoSchema) as any,
    defaultValues: storeData,
    mode: "onChange",
  });

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync store → form when store changes externally (import / reset)
  useEffect(() => {
    setValue("fullName", storeData.fullName ?? "");
    setValue("headline", storeData.headline ?? "");
    setValue("email", storeData.email ?? "");
    setValue("phone", storeData.phone ?? "");
    setValue("location", storeData.location ?? "");
    setValue("linkedin", storeData.linkedin ?? "");
    setValue("github", storeData.github ?? "");
    setValue("website", storeData.website ?? "");
    setValue("photoUrl", storeData.photoUrl ?? "");
    setValue("showFullLinks", storeData.showFullLinks ?? false);
  }, [storeData, setValue]);

  // Flush pending debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Debounced dispatch
  const dispatchUpdate = useCallback(
    (data: Partial<PersonalInfo>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updatePersonalInfo(data);
      }, 300);
    },
    [updatePersonalInfo]
  );

  // Watch all fields with useWatch (safe for React Compiler)
  const formValues = useWatch({ control });

  useEffect(() => {
    if (formValues) {
      dispatchUpdate(formValues as Partial<PersonalInfo>);
    }
  }, [formValues, dispatchUpdate]);

  // Photo upload handler
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoUrl = formValues?.photoUrl;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const result = await compressImageToDataUri(file, 400, 0.82);
    if (result.success) {
      setValue("photoUrl", result.dataUri);
      updatePersonalInfo({ photoUrl: result.dataUri });
      toast.success("Foto profil berhasil diunggah.");
    } else {
      toast.error(result.error);
    }
  };

  const handleRemovePhoto = () => {
    setValue("photoUrl", "");
    updatePersonalInfo({ photoUrl: "" });
  };

  return (
    <div className="space-y-4">
      {/* Photo upload */}
      <div>
        <Label className="text-xs font-medium text-slate-600 mb-2 block">
          {t.editor.personalInfo.photoUrl}
        </Label>
        <div className="flex items-center gap-3">
          {/* Preview / placeholder */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Foto profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-7 w-7 text-slate-300" strokeWidth={1.5} />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              aria-label={t.editor.personalInfo.photoUrlPlaceholder}
              onChange={handlePhotoChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => photoInputRef.current?.click()}
              className="gap-1.5 text-xs h-7"
            >
              <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
              {photoUrl ? (t.common.edit) : (t.common.add)}
            </Button>
            {photoUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                className="gap-1.5 text-xs h-7 text-slate-500"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                {t.editor.personalInfo.removePhoto}
              </Button>
            )}
            <p className="text-[11px] text-slate-400">
              {t.editor.personalInfo.photoHelp}
            </p>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <Label htmlFor="pi-fullName" className="text-xs font-medium text-slate-600 mb-1 block">
          {t.editor.personalInfo.fullName} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="pi-fullName"
          placeholder={t.editor.personalInfo.fullNamePlaceholder}
          {...register("fullName")}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "pi-fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="pi-fullName-error" role="alert" className="mt-1 text-[11px] text-red-500">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Headline */}
      <div>
        <Label htmlFor="pi-headline" className="text-xs font-medium text-slate-600 mb-1 block">
          {t.editor.personalInfo.headline}
        </Label>
        <Input
          id="pi-headline"
          placeholder={t.editor.personalInfo.headlinePlaceholder}
          {...register("headline")}
          aria-invalid={!!errors.headline}
          aria-describedby={errors.headline ? "pi-headline-error" : undefined}
        />
        {errors.headline && (
          <p id="pi-headline-error" role="alert" className="mt-1 text-[11px] text-red-500">
            {errors.headline.message}
          </p>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="pi-email" className="text-xs font-medium text-slate-600 mb-1 block">
            {t.editor.personalInfo.email}
          </Label>
          <Input
            id="pi-email"
            type="email"
            placeholder={t.editor.personalInfo.emailPlaceholder}
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "pi-email-error" : undefined}
          />
          {errors.email && (
            <p id="pi-email-error" role="alert" className="mt-1 text-[11px] text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="pi-phone" className="text-xs font-medium text-slate-600 mb-1 block">
            {t.editor.personalInfo.phone}
          </Label>
          <Input
            id="pi-phone"
            type="tel"
            placeholder={t.editor.personalInfo.phonePlaceholder}
            {...register("phone")}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="pi-location" className="text-xs font-medium text-slate-600 mb-1 block">
          {t.editor.personalInfo.location}
        </Label>
        <Input
          id="pi-location"
          placeholder={t.editor.personalInfo.locationPlaceholder}
          {...register("location")}
        />
      </div>

      {/* LinkedIn */}
      <div>
        <Label htmlFor="pi-linkedin" className="text-xs font-medium text-slate-600 mb-1 block">
          {t.editor.personalInfo.linkedin}
        </Label>
        <Input
          id="pi-linkedin"
          type="url"
          placeholder={t.editor.personalInfo.linkedinPlaceholder}
          {...register("linkedin")}
        />
      </div>

      {/* GitHub */}
      <div>
        <Label htmlFor="pi-github" className="text-xs font-medium text-slate-600 mb-1 block">
          {t.editor.personalInfo.github}
        </Label>
        <Input
          id="pi-github"
          type="url"
          placeholder={t.editor.personalInfo.githubPlaceholder}
          {...register("github")}
        />
      </div>

      {/* Website */}
      <div>
        <Label htmlFor="pi-website" className="text-xs font-medium text-slate-600 mb-1 block">
          {t.editor.personalInfo.website}
        </Label>
        <Input
          id="pi-website"
          type="url"
          placeholder={t.editor.personalInfo.websitePlaceholder}
          {...register("website")}
        />
      </div>

      {/* Display Full Links Checkbox */}
      <div className="rounded-lg border border-slate-200/80 bg-slate-50/60 p-3 space-y-1">
        <div className="flex items-center gap-2">
          <Checkbox
            id="pi-showFullLinks"
            checked={!!formValues?.showFullLinks}
            onCheckedChange={(checked) => {
              const val = !!checked;
              setValue("showFullLinks", val);
              updatePersonalInfo({ showFullLinks: val });
            }}
          />
          <Label
            htmlFor="pi-showFullLinks"
            className="text-xs font-medium text-slate-700 cursor-pointer select-none"
          >
            {t.editor.personalInfo.showFullLinks}
          </Label>
        </div>
        <p className="text-[11px] text-slate-500 pl-6 leading-normal">
          {t.editor.personalInfo.showFullLinksHelp}
        </p>
      </div>
    </div>
  );
}

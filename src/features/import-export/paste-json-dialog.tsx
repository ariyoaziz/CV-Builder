"use client";

import { useState, useCallback } from "react";
import { Eye, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImportConfirmDialog } from "@/features/import-export/import-confirm-dialog";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";
import { useCVStore } from "@/store/useCVStore";
import { validateAndParseAIJsonString } from "@/features/ai-templates/validate-ai-json";
import type { CVData } from "@/types/cv.types";

interface PasteJsonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Paste JSON Dialog
 *
 * Accepts raw JSON text (from external AI or any other source) via a textarea.
 * Passes text through the same validation pipeline as the existing Import JSON
 * file upload flow: JSON.parse → Zod CVData schema → Migration → Confirmation → replaceCVData().
 *
 * Does NOT create a second import pipeline.
 * Does NOT accept file uploads (use Dokumen → Impor JSON for that).
 */
export function PasteJsonDialog({ open, onOpenChange }: PasteJsonDialogProps) {
  const { t } = useTranslation();
  const replaceCVData = useCVStore((state) => state.replaceCVData);

  const [pasteText, setPasteText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<CVData | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPasteText(e.target.value);
    // Clear previous validation result on edit
    setValidationError(null);
    setCandidateData(null);
  };

  const handleValidate = useCallback(() => {
    setValidationError(null);
    setCandidateData(null);

    const result = validateAndParseAIJsonString(pasteText);
    if (result.success) {
      setCandidateData(result.data);
    } else {
      setValidationError(result.error ?? "Unknown validation error");
    }
  }, [pasteText]);

  const handleConfirmImport = useCallback(() => {
    if (!candidateData) return;
    replaceCVData(candidateData);
    setConfirmOpen(false);
    setCandidateData(null);
    setPasteText("");
    setValidationError(null);
    onOpenChange(false);
    toast.success(t.pasteJson.importSuccessToast);
  }, [candidateData, replaceCVData, onOpenChange, t.pasteJson.importSuccessToast]);

  const handleDialogClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      // Reset state on close
      setPasteText("");
      setValidationError(null);
      setCandidateData(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-lg max-h-[92vh] flex flex-col gap-0 p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200 shrink-0">
            <DialogTitle className="text-base font-bold text-slate-900">
              {t.pasteJson.dialogTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-0.5">
              {t.pasteJson.dialogSubtitle}
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {/* Paste area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="paste-json-textarea" className="text-xs font-semibold text-slate-700">
                  {t.pasteJson.pasteLabel}
                </Label>
                <div className="flex items-center gap-1.5">
                  {candidateData && (
                    <Badge className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 border">
                      ✓ {t.pasteJson.jsonValidBadge}
                    </Badge>
                  )}
                  {validationError && (
                    <Badge
                      variant="destructive"
                      className="text-[10px]"
                    >
                      {t.pasteJson.jsonInvalidBadge}
                    </Badge>
                  )}
                </div>
              </div>
              <Textarea
                id="paste-json-textarea"
                value={pasteText}
                onChange={handleTextChange}
                placeholder={t.pasteJson.pastePlaceholder}
                className="w-full max-w-full text-xs font-mono min-h-44 resize-y"
                spellCheck={false}
                autoComplete="off"
                aria-describedby={
                  validationError ? "paste-json-error" : undefined
                }
              />
            </div>

            {/* Validation note */}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.pasteJson.importNote}
            </p>

            {/* Error message */}
            {validationError && (
              <div
                id="paste-json-error"
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700"
              >
                <AlertTriangle
                  className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-500"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold mb-0.5">{t.pasteJson.jsonInvalidBadge}</p>
                  <p className="font-mono break-all">{validationError}</p>
                </div>
              </div>
            )}

            {/* Candidate preview */}
            {candidateData && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2.5">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  {t.pasteJson.candidatePreviewTitle}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-700">
                  <div className="min-w-0 break-words">
                    <span className="text-slate-500">{t.pasteJson.candidateName}: </span>
                    <span className="font-semibold">
                      {candidateData.personalInfo?.fullName || "—"}
                    </span>
                  </div>
                  {candidateData.personalInfo?.headline && (
                    <div className="min-w-0 break-words">
                      <span className="text-slate-500">{t.pasteJson.candidateHeadline}: </span>
                      <span className="font-medium break-words">
                        {candidateData.personalInfo.headline}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 break-words">
                    <span className="text-slate-500">{t.pasteJson.candidateExperienceCount}: </span>
                    <span className="font-semibold">{candidateData.experience?.length ?? 0}</span>
                  </div>
                  <div className="min-w-0 break-words">
                    <span className="text-slate-500">{t.pasteJson.candidateEducationCount}: </span>
                    <span className="font-semibold">{candidateData.education?.length ?? 0}</span>
                  </div>
                  <div className="min-w-0 break-words">
                    <span className="text-slate-500">{t.pasteJson.candidateSkillsCount}: </span>
                    <span className="font-semibold">{candidateData.skills?.length ?? 0}</span>
                  </div>
                  <div className="min-w-0 break-words">
                    <span className="text-slate-500">{t.pasteJson.candidateProjectsCount}: </span>
                    <span className="font-semibold">{candidateData.projects?.length ?? 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0 bg-white">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-9 w-full sm:w-auto"
              onClick={() => handleDialogClose(false)}
              id="btn-paste-json-cancel"
            >
              {t.common.cancel}
            </Button>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleValidate}
                disabled={!pasteText.trim()}
                className="gap-1.5 text-xs h-9 text-slate-700 w-full sm:w-auto"
                id="btn-paste-json-validate"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                {t.pasteJson.validateBtn}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                disabled={!candidateData}
                className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold w-full sm:w-auto"
                id="btn-paste-json-use"
              >
                {t.pasteJson.useThisCvBtn}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reuse existing ImportConfirmDialog */}
      <ImportConfirmDialog
        open={confirmOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setConfirmOpen(false);
        }}
        onConfirm={handleConfirmImport}
        importedData={candidateData}
      />
    </>
  );
}

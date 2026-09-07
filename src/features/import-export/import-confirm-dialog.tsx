"use client";

import React from "react";
import type { CVData } from "@/types/cv.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileUp, AlertTriangle } from "lucide-react";

interface ImportConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  importedData: CVData | null;
}

/**
 * Destructive overwrite confirmation modal before replacing active CVData in Zustand.
 */
export function ImportConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  importedData,
}: ImportConfirmDialogProps) {
  if (!importedData) return null;

  const candidateName = importedData.personalInfo?.fullName?.trim() || "CV Tanpa Nama";
  const headline = importedData.personalInfo?.headline?.trim();
  const templateName = importedData.metadata?.templateId || "modern";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2.5 text-amber-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-slate-900">
              Timpa Data CV Saat Ini?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-slate-600 pt-2 leading-relaxed">
            Mengimpor file ini akan <strong>menimpa seluruh konten CV</strong> yang sedang aktif di
            editor. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>

          {/* Details of incoming backup */}
          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <FileUp className="h-3.5 w-3.5 text-blue-600" />
              <span>Detail File Impor:</span>
            </div>
            <p className="text-slate-700">
              Kandidat: <span className="font-medium text-slate-950">{candidateName}</span>
            </p>
            {headline && (
              <p className="text-slate-500 truncate">
                Profesi: {headline}
              </p>
            )}
            <p className="text-slate-500 capitalize">
              Template: {templateName}
            </p>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel className="text-xs h-8 px-3">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="text-xs h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Ya, Impor Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

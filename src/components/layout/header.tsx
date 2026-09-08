"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FileDown, FileUp, ClipboardPaste, RotateCcw, Printer, ChevronDown, HelpCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useCVStore } from "@/store/useCVStore";
import { toast } from "sonner";
import type { CVData } from "@/types/cv.types";
import { exportCVToJSON } from "@/features/import-export/export-json";
import { validateAndParseImportFile } from "@/features/import-export/import-json";
import { ImportConfirmDialog } from "@/features/import-export/import-confirm-dialog";
import { PasteJsonDialog } from "@/features/import-export/paste-json-dialog";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { AIAssistantModal } from "@/features/ai-templates/ai-assistant-modal";

/**
 * Application header bar.
 *
 * Responsibilities:
 * - Brand identity
 * - CV document title display
 * - Language switcher ([ ID | EN ])
 * - Export JSON pipeline
 * - Import JSON pipeline with validation and overwrite confirmation
 * - Paste JSON pipeline (e.g. from AI tools)
 * - Reset CV with confirmation
 * - Print trigger (calls window.print())
 */
export function Header() {
  const { t, language, setLanguage } = useTranslation();
  const fullName = useCVStore((state) => state.cvData.personalInfo.fullName);
  const cvData = useCVStore((state) => state.cvData);
  const resetCVData = useCVStore((state) => state.resetCVData);

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isPasteJsonOpen, setIsPasteJsonOpen] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<CVData | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const documentTitle = fullName?.trim() || t.header.documentTitleFallback;

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    exportCVToJSON(cvData);
  };

  // ── Import ─────────────────────────────────────────────────────────────────
  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input value so the same file can be re-selected
    e.target.value = "";

    const result = await validateAndParseImportFile(file);
    if (result.success) {
      setPendingImportData(result.data);
    } else {
      toast.error(result.error);
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;
    useCVStore.getState().replaceCVData(pendingImportData);
    setPendingImportData(null);
    toast.success(t.header.importSuccessToast);
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleResetConfirm = () => {
    resetCVData();
    setIsResetOpen(false);
    toast.success(t.header.resetSuccessToast);
  };

  // ── Print ──────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      try {
        window.print();
      } catch (error) {
        console.error("Gagal membuka dialog cetak browser:", error);
      }
    }
  };

  return (
    <>
      {/* Hidden file input for import */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        aria-label={t.header.importAriaLabel}
        onChange={handleImportFile}
      />

      <header
        id="app-toolbar"
        className="flex min-w-0 items-center justify-between h-12 px-2 sm:px-4 border-b border-slate-200 bg-white shrink-0 no-print"
      >
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-blue-600 tracking-tight select-none">
            CV<span className="text-slate-800">Builder</span>
          </span>
          <span className="hidden sm:block text-slate-300 text-xs select-none">
            /
          </span>
          <span className="hidden sm:block text-xs text-slate-500 truncate max-w-45">
            {documentTitle}
          </span>
        </div>

        {/* Actions */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Switcher [ ID | EN ] */}
          <div
            className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5"
            role="group"
            aria-label={t.header.languageSwitcherAria}
          >
            <button
              type="button"
              id="lang-btn-id"
              onClick={() => setLanguage("id")}
              aria-pressed={language === "id"}
              className={cn(
                "min-w-9 min-h-8 px-2 py-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center justify-center select-none",
                language === "id"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              ID
            </button>
            <button
              type="button"
              id="lang-btn-en"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={cn(
                "min-w-9 min-h-8 px-2 py-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center justify-center select-none",
                language === "en"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              EN
            </button>
          </div>

          {/* AI Assistant Button */}
          <Button
            id="btn-ai-assistant"
            variant="outline"
            size="sm"
            onClick={() => setIsAIModalOpen(true)}
            className="gap-1.5 text-xs min-h-9 px-2 sm:px-2.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
            aria-label={t.header.aiAssistant}
          >
            <Bot className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden md:inline font-medium">{t.header.aiAssistant}</span>
          </Button>

          {/* About & Help Link */}
          <Link href="/about">
            <Button
              id="btn-about-help"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs min-h-9 px-2 sm:px-2.5 text-slate-600 hover:text-slate-900"
              aria-label={t.header.aboutHelp}
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden md:inline font-medium">{t.header.aboutHelp}</span>
            </Button>
          </Link>

          {/* Export / Import dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="btn-document-menu"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs min-h-9 px-2.5 sm:px-3 text-slate-700"
                aria-label={t.header.documentMenu}
              >
                <FileDown className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                <span className="hidden sm:inline font-medium">{t.header.documentMenu}</span>
                <ChevronDown className="h-3 w-3 text-slate-500" strokeWidth={2} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExport} className="gap-2 text-sm">
                <FileDown className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} aria-hidden="true" />
                {t.header.exportJSON}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick} className="gap-2 text-sm">
                <FileUp className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} aria-hidden="true" />
                {t.header.importJSON}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPasteJsonOpen(true)} className="gap-2 text-sm">
                <ClipboardPaste className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} aria-hidden="true" />
                {t.header.pasteJSON}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsResetOpen(true)}
                className="gap-2 text-sm text-destructive focus:text-destructive"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                {t.header.resetCV}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Print trigger */}
          <Button
            id="btn-print-cv"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs min-h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            aria-label={t.header.printPDF}
          >
            <Printer className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden sm:inline">{t.header.printPDF}</span>
            <span className="sm:hidden">{t.header.printShort}</span>
          </Button>
        </div>
      </header>

      {/* Reset confirmation dialog */}
      <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.header.resetDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.header.resetDialogDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.header.resetDialogCancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.header.resetDialogConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import overwrite confirmation dialog */}
      <ImportConfirmDialog
        open={Boolean(pendingImportData)}
        onOpenChange={(open) => {
          if (!open) setPendingImportData(null);
        }}
        onConfirm={handleConfirmImport}
        importedData={pendingImportData}
      />

      {/* Paste JSON Dialog */}
      <PasteJsonDialog
        open={isPasteJsonOpen}
        onOpenChange={setIsPasteJsonOpen}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
        onOpenPasteJson={() => setIsPasteJsonOpen(true)}
      />
    </>
  );
}

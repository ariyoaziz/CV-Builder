"use client";

import { useState } from "react";
import {
  Bot,
  Copy,
  Check,
  ChevronDown,
  ArrowDown,
  ExternalLink,
  Info,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTranslation } from "@/i18n";
import { AI_TEMPLATE_PRESETS } from "@/features/ai-templates/ai-template-presets";
import {
  buildAIPrompt,
  CV_DATA_JSON_SCHEMA_STR,
} from "@/features/ai-templates/cv-json-schema-contract";
import type { AITemplateMode } from "@/features/ai-templates/ai-template-types";
import { cn } from "@/lib/utils";
import { useCVStore } from "@/store/useCVStore";

interface AIAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional callback to open the Paste JSON dialog from header */
  onOpenPasteJson?: () => void;
}

export function AIAssistantModal({
  open,
  onOpenChange,
  onOpenPasteJson,
}: AIAssistantModalProps) {
  const { t, language } = useTranslation();
  const visualTemplateId = useCVStore((state) => state.cvData.metadata.templateId || "modern");

  // Prompt Builder state
  const [mode, setMode] = useState<AITemplateMode>("from_scratch");
  const [selectedPresetId, setSelectedPresetId] = useState("general-professional");
  const [promptLang, setPromptLang] = useState<"id" | "en">(language);
  const [targetPosition, setTargetPosition] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userNotes, setUserNotes] = useState("");

  // Copy state
  const [copiedPromptAndSchema, setCopiedPromptAndSchema] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const selectedPreset =
    AI_TEMPLATE_PRESETS.find((p) => p.id === selectedPresetId) ?? AI_TEMPLATE_PRESETS[0];
  const isEn = promptLang === "en";

  const builtPrompt = buildAIPrompt(
    {
      mode,
      presetId: selectedPresetId,
      language: promptLang,
      visualTemplateId,
      userInputData: userNotes,
      targetPosition,
      targetIndustry,
      jobDescription,
    },
    {
      focus: isEn ? selectedPreset.suggestedFocusEn : selectedPreset.suggestedFocusId,
      tips: isEn ? selectedPreset.tipsEn : selectedPreset.tipsId,
    }
  );

  const combinedCopy = `${builtPrompt}\n\n---\n\nJSON SCHEMA:\n${CV_DATA_JSON_SCHEMA_STR}`;

  const handleCopyPromptAndSchema = async () => {
    try {
      await navigator.clipboard.writeText(combinedCopy);
      setCopiedPromptAndSchema(true);
      toast.success(t.aiAssistant.copyPromptAndSchemaSuccessToast);
      setTimeout(() => setCopiedPromptAndSchema(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(builtPrompt);
      setCopiedPrompt(true);
      toast.success(t.aiAssistant.copySuccessToast);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(CV_DATA_JSON_SCHEMA_STR);
      setCopiedSchema(true);
      toast.success(t.aiAssistant.copySchemaSuccessToast);
      setTimeout(() => setCopiedSchema(false), 2000);
    } catch {
      toast.error("Failed to copy schema");
    }
  };

  const handleOpenPasteJson = () => {
    onOpenChange(false);
    onOpenPasteJson?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-2xl max-h-[92vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* ── Header ── */}
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0"
              aria-hidden="true"
            >
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                {t.aiAssistant.modalTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {t.aiAssistant.modalSubtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Scrollable body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-5">

          {/* ── Workflow Diagram ── */}
          <section aria-labelledby="ai-workflow-title">
            <h3
              id="ai-workflow-title"
              className="text-xs font-semibold text-slate-700 mb-2.5 flex items-center gap-1.5"
            >
              <ArrowDown className="h-3.5 w-3.5 text-indigo-500" aria-hidden="true" />
              {t.aiAssistant.workflowTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pl-0.5">
              {t.aiAssistant.workflowSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                      "bg-indigo-50 text-indigo-600 border border-indigo-200"
                    )}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-700">{step}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-2.5">
              {t.aiAssistant.workflowExplain}
            </p>
          </section>

          {/* ── 3 Components ── */}
          <section aria-labelledby="ai-components-title">
            <h3
              id="ai-components-title"
              className="text-xs font-semibold text-slate-700 mb-2"
            >
              {t.aiAssistant.threeComponentsTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  title: t.aiAssistant.componentTemplateTitle,
                  desc: t.aiAssistant.componentTemplateDesc,
                  color: "bg-indigo-50 border-indigo-200 text-indigo-700",
                },
                {
                  title: t.aiAssistant.componentAiTitle,
                  desc: t.aiAssistant.componentAiDesc,
                  color: "bg-slate-50 border-slate-200 text-slate-700",
                },
                {
                  title: t.aiAssistant.componentImportTitle,
                  desc: t.aiAssistant.componentImportDesc,
                  color: "bg-emerald-50 border-emerald-200 text-emerald-700",
                },
              ].map((comp, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-lg border p-2.5 text-center",
                    comp.color
                  )}
                >
                  <p className="text-[11px] font-semibold leading-snug">{comp.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{comp.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── AI vs Visual Template note ── */}
          <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
            <Layers className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[11px] text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-700">{t.aiAssistant.aiVsVisualTitle}: </span>
              {t.aiAssistant.aiVsVisualExplain}
              <span className="block mt-1 text-slate-500 italic">{t.aiAssistant.aiVsVisualExample}</span>
            </div>
          </div>

          <Separator />

          {/* ── Mode Selector ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("from_scratch")}
              className={cn(
                "rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
                mode === "from_scratch"
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
              id="ai-mode-from-scratch"
              aria-pressed={mode === "from_scratch"}
            >
              <p
                className={cn(
                  "text-xs font-bold mb-0.5",
                  mode === "from_scratch" ? "text-indigo-700" : "text-slate-800"
                )}
              >
                {t.aiAssistant.modeFromScratch}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {t.aiAssistant.modeFromScratchDesc}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("improve_existing")}
              className={cn(
                "rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600",
                mode === "improve_existing"
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
              id="ai-mode-improve-existing"
              aria-pressed={mode === "improve_existing"}
            >
              <p
                className={cn(
                  "text-xs font-bold mb-0.5",
                  mode === "improve_existing" ? "text-indigo-700" : "text-slate-800"
                )}
              >
                {t.aiAssistant.modeImproveExisting}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {t.aiAssistant.modeImproveExistingDesc}
              </p>
            </button>
          </div>

          {/* ── Preset + Prompt Language ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ai-preset-select" className="text-xs font-semibold text-slate-700">
                {t.aiAssistant.presetLabel}
              </Label>
              <select
                id="ai-preset-select"
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-0"
              >
                {AI_TEMPLATE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {isEn ? preset.titleEn : preset.titleId}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                {t.aiAssistant.promptOutputLanguage}
              </Label>
              <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5 h-8">
                <button
                  type="button"
                  onClick={() => setPromptLang("id")}
                  aria-pressed={promptLang === "id"}
                  className={cn(
                    "flex-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 h-full",
                    promptLang === "id"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setPromptLang("en")}
                  aria-pressed={promptLang === "en"}
                  className={cn(
                    "flex-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 h-full",
                    promptLang === "en"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* ── Preset description card ── */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
            <p className="text-xs font-semibold text-slate-700 mb-1">
              {isEn ? selectedPreset.titleEn : selectedPreset.titleId}
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isEn ? selectedPreset.descriptionEn : selectedPreset.descriptionId}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {(isEn
                ? selectedPreset.suitableForEn
                : selectedPreset.suitableForId
              ).map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-[10px] bg-white border-slate-200 text-slate-600 py-0 px-1.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {/* Tips */}
            <ul className="mt-2.5 space-y-1">
              {(isEn ? selectedPreset.tipsEn : selectedPreset.tipsId).map(
                (tip, idx) => (
                  <li
                    key={idx}
                    className="text-[11px] text-slate-600 flex items-start gap-1.5"
                  >
                    <span className="text-indigo-400 shrink-0 mt-0.5" aria-hidden="true">
                      •
                    </span>
                    {tip}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* ── Optional context fields ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="ai-target-position"
                className="text-xs font-medium text-slate-600"
              >
                {t.aiAssistant.targetPositionLabel}
              </Label>
              <Input
                id="ai-target-position"
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
                placeholder={t.aiAssistant.targetPositionPlaceholder}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="ai-target-industry"
                className="text-xs font-medium text-slate-600"
              >
                {t.aiAssistant.targetIndustryLabel}
              </Label>
              <Input
                id="ai-target-industry"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                placeholder={t.aiAssistant.targetIndustryPlaceholder}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ai-job-desc" className="text-xs font-medium text-slate-600">
              {t.aiAssistant.jobDescriptionLabel}
            </Label>
            <Textarea
              id="ai-job-desc"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t.aiAssistant.jobDescriptionPlaceholder}
              className="text-xs min-h-16 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ai-user-notes" className="text-xs font-medium text-slate-600">
              {t.aiAssistant.userNotesLabel}
            </Label>
            <Textarea
              id="ai-user-notes"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder={t.aiAssistant.userNotesPlaceholder}
              className="text-xs min-h-20 resize-none"
              rows={4}
            />
          </div>

          {/* ── Copy action buttons ── */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Primary: Copy Prompt + Schema */}
            <Button
              type="button"
              size="sm"
              onClick={handleCopyPromptAndSchema}
              className="gap-1.5 text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white flex-1 sm:flex-none"
              id="btn-copy-ai-prompt-and-schema"
            >
              {copiedPromptAndSchema ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t.aiAssistant.copyPromptAndSchemaBtn}
            </Button>

            {/* Secondary actions */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyPrompt}
              className="gap-1.5 text-xs h-9 text-slate-700"
              id="btn-copy-ai-prompt"
            >
              {copiedPrompt ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t.aiAssistant.copyPromptBtn}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySchema}
              className="gap-1.5 text-xs h-9 text-slate-700"
              id="btn-copy-json-schema"
            >
              {copiedSchema ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t.aiAssistant.copySchemaBtn}
            </Button>
          </div>

          {/* ── Prompt preview (collapsed) ── */}
          <details className="group rounded-xl border border-slate-200 bg-slate-50/60">
            <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-700 list-none">
              <span>{t.aiAssistant.previewPromptLabel}</span>
              <ChevronDown
                className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap px-3 pb-3 pt-1 font-mono text-[10px] leading-relaxed text-slate-600 border-t border-slate-200">
              {builtPrompt}
            </pre>
          </details>

          {/* ── Next Step CTA ── */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 flex items-start gap-3">
            <Info
              className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-800 mb-0.5">
                {t.aiAssistant.nextStepTitle}
              </p>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {t.aiAssistant.nextStepDesc}
              </p>
              {onOpenPasteJson && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenPasteJson}
                  variant="outline"
                  className="mt-2 h-8 text-xs gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  id="btn-ai-open-paste-json"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.aiAssistant.openImportBtn}
                </Button>
              )}
            </div>
          </div>

          {/* ── Privacy note ── */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-[11px] text-amber-800">
            <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <span className="font-semibold">{t.aiAssistant.privacyDisclaimerTitle}: </span>
              {t.aiAssistant.privacyDisclaimerText}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type AITemplateMode = "from_scratch" | "improve_existing";

export interface AITemplatePreset {
  id: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  suitableForId: string[];
  suitableForEn: string[];
  whenToUseId: string;
  whenToUseEn: string;
  tipsId: string[];
  tipsEn: string[];
  suggestedFocusId: string;
  suggestedFocusEn: string;
}

export interface AITemplate {
  id: string;
  title: string;
  description: string;
  suitableFor: string[];
  whenToUse: string;
  tips: string[];
  prompt: string;
  outputInstructions: string;
  jsonSchema: string;
  schemaVersion: string;
}

export interface GeneratedAIPromptPayload {
  mode: AITemplateMode;
  presetId: string;
  language: "id" | "en";
  visualTemplateId?: "modern" | "minimal" | "classic";
  userInputData?: string;
  targetPosition?: string;
  targetIndustry?: string;
  jobDescription?: string;
}

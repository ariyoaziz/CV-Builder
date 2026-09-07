import { parseAndMigrateCVData, type MigrationResult } from "@/schemas/migration";
import { normalizeAIJsonPayload } from "@/features/ai-templates/validate-ai-json";

export const MAX_IMPORT_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 Megabytes

/**
 * Reads, validates, and parses an imported JSON file.
 *
 * Steps:
 * 1. Validates file size (max 2MB).
 * 2. Reads file text asynchronously.
 * 3. Safely parses JSON string.
 * 4. Normalizes external AI artifacts & formats.
 * 5. Runs schema validation and version migration via parseAndMigrateCVData().
 *
 * Returns MigrationResult without mutating any application state.
 */
export async function validateAndParseImportFile(file: File): Promise<MigrationResult> {
  // 1. File size check
  if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "Ukuran file terlalu besar (maksimal 2MB).",
    };
  }

  // 2. Read file content
  let text: string;
  try {
    text = await file.text();
  } catch (error) {
    console.error("Gagal membaca file:", error);
    return {
      success: false,
      error: "File tidak dapat dibaca oleh browser.",
    };
  }

  // 3. JSON parse check
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      success: false,
      error: "File bukan format JSON yang valid atau rusak.",
    };
  }

  // 4. Normalize & Schema validation
  const normalized = normalizeAIJsonPayload(parsed);
  return parseAndMigrateCVData(normalized);
}

/**
 * Validates and parses a raw JSON string directly.
 * Uses the same normalization and schema migration pipeline.
 */
export function validateAndParseImportJsonString(rawJson: string): MigrationResult {
  if (!rawJson || !rawJson.trim()) {
    return {
      success: false,
      error: "String JSON kosong.",
    };
  }

  let cleanText = rawJson.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanText);
  } catch {
    return {
      success: false,
      error: "Teks bukan format JSON yang valid atau rusak.",
    };
  }

  const normalized = normalizeAIJsonPayload(parsed);
  return parseAndMigrateCVData(normalized);
}



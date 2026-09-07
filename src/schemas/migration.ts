import { CVDataSchema } from "@/schemas/cv.schema";
import { CVData } from "@/types/cv.types";

export type MigrationResult =
  | { success: true; data: CVData }
  | { success: false; error: string };

/**
 * Validates untrusted input and migrates schema versions if necessary.
 * Current active version: 1
 */
export function parseAndMigrateCVData(rawJson: unknown): MigrationResult {
  if (typeof rawJson !== "object" || rawJson === null) {
    return {
      success: false,
      error: "Format file tidak valid: data CV harus berupa objek JSON",
    };
  }

  const rawObj = rawJson as Record<string, unknown>;
  const version = rawObj.version;

  if (typeof version !== "number") {
    return {
      success: false,
      error: "File CV tidak memiliki informasi versi schema yang valid",
    };
  }

  switch (version) {
    case 1: {
      const parsed = CVDataSchema.safeParse(rawObj);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues
          .slice(0, 3)
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        return {
          success: false,
          error: `Struktur data tidak valid (${errorMessages})`,
        };
      }
      return { success: true, data: parsed.data };
    }

    // Future version migrations can be hooked here:
    // case 2: {
    //   const v1Data = migrateV1ToV2(rawObj);
    //   return { success: true, data: CVDataSchemaV2.parse(v1Data) };
    // }

    default:
      return {
        success: false,
        error: `Versi schema CV (${version}) tidak didukung oleh aplikasi ini`,
      };
  }
}

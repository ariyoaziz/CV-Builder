import { CVDataSchema, SafeUrlSchema } from "../cv.schema";
import { parseAndMigrateCVData } from "../migration";
import { initialCVData } from "../../store/initial-data";
import { createEmptyCVData } from "../../store/empty-data";
import { useCVStore } from "../../store/useCVStore";

export function runTests(): boolean {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  console.log("=== RUNNING PHASE 3 TESTS ===");

  // 1. Validate Initial Sample Data
  const sampleParse = CVDataSchema.safeParse(initialCVData);
  assert(sampleParse.success, "initialCVData conforms strictly to CVDataSchema v1");

  // 2. Validate Empty Data
  const emptyData = createEmptyCVData();
  const emptyParse = CVDataSchema.safeParse(emptyData);
  assert(emptyParse.success, "createEmptyCVData conforms strictly to CVDataSchema v1");

  // 3. Safe URL Validation
  assert(SafeUrlSchema.safeParse("https://example.com").success, "SafeUrl accepts valid https");
  assert(SafeUrlSchema.safeParse("http://example.com").success, "SafeUrl accepts valid http");
  assert(SafeUrlSchema.safeParse("").success, "SafeUrl accepts empty optional string");
  assert(!SafeUrlSchema.safeParse("javascript:alert(1)").success, "SafeUrl rejects javascript: protocol");
  assert(!SafeUrlSchema.safeParse("data:text/html,hack").success, "SafeUrl rejects data: protocol");

  // 4. Migration & Ingestion Engine
  const validMigration = parseAndMigrateCVData(initialCVData);
  assert(validMigration.success, "parseAndMigrateCVData accepts valid v1 schema");

  const invalidVersionMigration = parseAndMigrateCVData({ ...initialCVData, version: 99 });
  assert(!invalidVersionMigration.success, "parseAndMigrateCVData rejects unsupported version 99");

  const corruptMigration = parseAndMigrateCVData({ version: 1, invalid: "data" });
  assert(!corruptMigration.success, "parseAndMigrateCVData rejects malformed payload");

  // 5. Zustand Store Invariants
  const store = useCVStore.getState();
  store.loadSampleData();
  assert(store.cvData.personalInfo.fullName === "Budi Santoso", "Store initializes with sample name");

  store.updatePersonalInfo({ fullName: "Ahmad Dahlan" });
  assert(useCVStore.getState().cvData.personalInfo.fullName === "Ahmad Dahlan", "updatePersonalInfo works immutably");

  const newExp = {
    id: "99999999-9999-4999-8999-999999999999",
    company: "Test Co",
    position: "Engineer",
    location: "",
    startDate: "2024-01",
    endDate: "",
    current: true,
    description: "Testing",
  };
  store.addExperience(newExp);
  assert(
    useCVStore.getState().cvData.experience.some((e) => e.id === newExp.id),
    "addExperience preserves stable ID"
  );

  store.removeExperience(newExp.id);
  assert(
    !useCVStore.getState().cvData.experience.some((e) => e.id === newExp.id),
    "removeExperience deletes only targeted entity"
  );

  store.setTemplate("classic");
  assert(useCVStore.getState().cvData.metadata.templateId === "classic", "setTemplate updates metadata cleanly");

  store.resetCVData();
  assert(useCVStore.getState().cvData.personalInfo.fullName === "", "resetCVData cleans state");

  console.log(`=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  return failed === 0;
}

// Self-run when executed directly
if (typeof require !== "undefined" && require.main === module) {
  const success = runTests();
  if (!success) process.exit(1);
}

import { CVData } from "@/types/cv.types";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

/**
 * Creates a clean, empty CV document conforming to version 1 schema.
 */
export function createEmptyCVData(): CVData {
  const now = new Date().toISOString();
  return {
    version: 1,
    metadata: {
      id: "00000000-0000-4000-8000-000000000001",
      createdAt: now,
      updatedAt: now,
      templateId: "modern",
      accentColor: "#2563eb",
      typography: "inter",
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      sectionLabels: {},
    },
    personalInfo: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      showFullLinks: false,
      photoUrl: "",
    },
    summary: {
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    organizations: [],
    optionalSections: {
      languages: { enabled: false, items: [] },
      awards: { enabled: false, items: [] },
      courses: { enabled: false, items: [] },
      licenses: { enabled: false, items: [] },
      volunteer: { enabled: false, items: [] },
      publications: { enabled: false, items: [] },
      portfolio: { enabled: false, items: [] },
      references: { enabled: false, onDemand: false, items: [] },
      interests: { enabled: false, items: [] },
    },
  };
}

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CVData,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  CertificationItem,
  OrganizationItem,
  LanguageItem,
  AwardItem,
  CourseItem,
  LicenseItem,
  VolunteerItem,
  PublicationItem,
  PortfolioLinkItem,
  ReferenceItem,
  OptionalSections,
  OptionalSectionKey,
  TemplateId,
  TypographyId,
} from "@/types/cv.types";
import { initialCVData } from "@/store/initial-data";
import { createEmptyCVData } from "@/store/empty-data";
import { parseAndMigrateCVData } from "@/schemas/migration";
import { generateId } from "@/utils/id.utils";

export interface CVStoreState {
  cvData: CVData;
  isHydrated: boolean;

  // Hydration state
  setHydrated: (state: boolean) => void;

  // Section 01: Personal Info
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;

  // Section 02: Professional Summary
  updateSummary: (data: { summary: string }) => void;

  // Section 03: Work Experience
  addExperience: (item: ExperienceItem) => void;
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;

  // Section 04: Education
  addEducation: (item: EducationItem) => void;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;

  // Section 05: Skills
  addSkill: (item: SkillItem) => void;
  addMultipleSkills: (items: SkillItem[]) => void;
  removeSkill: (id: string) => void;
  updateSkillCategory: (id: string, category: string) => void;
  removeSkillsByCategory: (category: string) => void;
  renameSkillCategory: (oldCategory: string, newCategory: string) => void;
  setSkillsForCategory: (category: string, skillNames: string[]) => void;

  // Section 06: Projects
  addProject: (item: ProjectItem) => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  reorderProject: (fromIndex: number, toIndex: number) => void;

  // Section 07: Certifications
  addCertification: (item: CertificationItem) => void;
  updateCertification: (id: string, updates: Partial<CertificationItem>) => void;
  removeCertification: (id: string) => void;

  // Section 08: Organizations
  addOrganization: (item: OrganizationItem) => void;
  updateOrganization: (id: string, updates: Partial<OrganizationItem>) => void;
  removeOrganization: (id: string) => void;
  reorderOrganization: (fromIndex: number, toIndex: number) => void;

  // Optional Sections Master Actions
  toggleOptionalSection: (sectionKey: OptionalSectionKey, enabled?: boolean) => void;
  setOptionalSections: (sections: OptionalSections) => void;

  // Optional 1: Languages
  addLanguage: (item: LanguageItem) => void;
  updateLanguage: (id: string, updates: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;
  reorderLanguages: (fromIndex: number, toIndex: number) => void;

  // Optional 2: Awards
  addAward: (item: AwardItem) => void;
  updateAward: (id: string, updates: Partial<AwardItem>) => void;
  removeAward: (id: string) => void;
  reorderAwards: (fromIndex: number, toIndex: number) => void;

  // Optional 3: Courses
  addCourse: (item: CourseItem) => void;
  updateCourse: (id: string, updates: Partial<CourseItem>) => void;
  removeCourse: (id: string) => void;
  reorderCourses: (fromIndex: number, toIndex: number) => void;

  // Optional 4: Licenses
  addLicense: (item: LicenseItem) => void;
  updateLicense: (id: string, updates: Partial<LicenseItem>) => void;
  removeLicense: (id: string) => void;
  reorderLicenses: (fromIndex: number, toIndex: number) => void;

  // Optional 5: Volunteer
  addVolunteer: (item: VolunteerItem) => void;
  updateVolunteer: (id: string, updates: Partial<VolunteerItem>) => void;
  removeVolunteer: (id: string) => void;
  reorderVolunteer: (fromIndex: number, toIndex: number) => void;

  // Optional 6: Publications
  addPublication: (item: PublicationItem) => void;
  updatePublication: (id: string, updates: Partial<PublicationItem>) => void;
  removePublication: (id: string) => void;
  reorderPublications: (fromIndex: number, toIndex: number) => void;

  // Optional 7: Portfolio Links
  addPortfolioLink: (item: PortfolioLinkItem) => void;
  updatePortfolioLink: (id: string, updates: Partial<PortfolioLinkItem>) => void;
  removePortfolioLink: (id: string) => void;
  reorderPortfolioLinks: (fromIndex: number, toIndex: number) => void;

  // Optional 8: References
  addReference: (item: ReferenceItem) => void;
  updateReference: (id: string, updates: Partial<ReferenceItem>) => void;
  removeReference: (id: string) => void;
  reorderReferences: (fromIndex: number, toIndex: number) => void;
  setReferencesOnDemand: (onDemand: boolean) => void;

  // Optional 9: Interests
  setInterests: (items: string[]) => void;

  // Metadata & Customization
  setTemplate: (templateId: TemplateId) => void;
  setAccentColor: (accentColor: string) => void;
  setTypography: (typography: TypographyId) => void;
  setSectionOrder: (newOrder: string[]) => void;
  setSectionLabel: (sectionId: string, label: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;

  // Root Actions
  replaceCVData: (incoming: CVData) => void;
  resetCVData: () => void;
  loadSampleData: () => void;
}

/**
 * Reorder utility helper
 */
function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[] {
  if (startIndex < 0 || startIndex >= list.length || endIndex < 0 || endIndex >= list.length) {
    return list;
  }
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Custom storage engine with safe error boundaries and schema verification
 */
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn("LocalStorage storage failed or quota exceeded:", e);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignored
    }
  },
};

export const useCVStore = create<CVStoreState>()(
  persist(
    (set) => ({
      cvData: initialCVData,
      isHydrated: false,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      // 1. Personal Info
      updatePersonalInfo: (data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            personalInfo: {
              ...state.cvData.personalInfo,
              ...data,
            },
          },
        })),

      // 2. Summary
      updateSummary: (data) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            summary: {
              ...state.cvData.summary,
              ...data,
            },
          },
        })),

      // 3. Experience
      addExperience: (item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            experience: [...state.cvData.experience, item],
          },
        })),

      updateExperience: (id, updates) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            experience: state.cvData.experience.map((item) =>
              item.id === id ? { ...item, ...updates, id } : item
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            experience: state.cvData.experience.filter((item) => item.id !== id),
          },
        })),

      reorderExperience: (fromIndex, toIndex) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            experience: reorderArray(state.cvData.experience, fromIndex, toIndex),
          },
        })),

      // 4. Education
      addEducation: (item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            education: [...state.cvData.education, item],
          },
        })),

      updateEducation: (id, updates) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            education: state.cvData.education.map((item) =>
              item.id === id ? { ...item, ...updates, id } : item
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            education: state.cvData.education.filter((item) => item.id !== id),
          },
        })),

      reorderEducation: (fromIndex, toIndex) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            education: reorderArray(state.cvData.education, fromIndex, toIndex),
          },
        })),

      // 5. Skills
      addSkill: (item) =>
        set((state) => {
          const itemCategory = item.category?.trim() || "Keahlian Utama";
          const isDuplicate = state.cvData.skills.some(
            (s) =>
              s.name.toLowerCase() === item.name.toLowerCase() &&
              (s.category?.trim() || "Keahlian Utama").toLowerCase() === itemCategory.toLowerCase()
          );
          if (isDuplicate) return state;

          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                updatedAt: new Date().toISOString(),
              },
              skills: [...state.cvData.skills, { ...item, category: itemCategory }],
            },
          };
        }),

      addMultipleSkills: (items) =>
        set((state) => {
          const existing = new Set(
            state.cvData.skills.map(
              (s) => `${s.name.toLowerCase()}:::${(s.category?.trim() || "Keahlian Utama").toLowerCase()}`
            )
          );

          const newUniqueItems = items.filter((item) => {
            const cat = item.category?.trim() || "Keahlian Utama";
            const key = `${item.name.toLowerCase()}:::${cat.toLowerCase()}`;
            if (existing.has(key)) return false;
            existing.add(key);
            return true;
          });

          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                updatedAt: new Date().toISOString(),
              },
              skills: [...state.cvData.skills, ...newUniqueItems],
            },
          };
        }),

      removeSkill: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            skills: state.cvData.skills.filter((item) => item.id !== id),
          },
        })),

      updateSkillCategory: (id, category) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            skills: state.cvData.skills.map((item) =>
              item.id === id ? { ...item, category: category.trim() || "Keahlian Utama" } : item
            ),
          },
        })),

      removeSkillsByCategory: (category) =>
        set((state) => {
          const targetCat = category.trim().toLowerCase();
          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                updatedAt: new Date().toISOString(),
              },
              skills: state.cvData.skills.filter(
                (item) => (item.category?.trim() || "Keahlian Utama").toLowerCase() !== targetCat
              ),
            },
          };
        }),

      renameSkillCategory: (oldCategory, newCategory) =>
        set((state) => {
          const trimmedNew = newCategory.trim();
          if (!trimmedNew) return state;
          const oldTarget = oldCategory.trim().toLowerCase();

          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                updatedAt: new Date().toISOString(),
              },
              skills: state.cvData.skills.map((item) =>
                (item.category?.trim() || "Keahlian Utama").toLowerCase() === oldTarget
                  ? { ...item, category: trimmedNew }
                  : item
              ),
            },
          };
        }),

      setSkillsForCategory: (category, skillNames) =>
        set((state) => {
          const targetCat = category.trim() || "Keahlian Utama";
          const targetCatLower = targetCat.toLowerCase();

          const otherSkills = state.cvData.skills.filter(
            (s) => (s.category?.trim() || "Keahlian Utama").toLowerCase() !== targetCatLower
          );
          const currentCategorySkills = state.cvData.skills.filter(
            (s) => (s.category?.trim() || "Keahlian Utama").toLowerCase() === targetCatLower
          );

          const newCategorySkills: SkillItem[] = skillNames.map((name) => {
            const existing = currentCategorySkills.find(
              (s) => s.name.toLowerCase() === name.trim().toLowerCase()
            );
            return existing || { id: generateId(), name: name.trim(), category: targetCat };
          });

          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                updatedAt: new Date().toISOString(),
              },
              skills: [...otherSkills, ...newCategorySkills],
            },
          };
        }),

      // 6. Projects
      addProject: (item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            projects: [...state.cvData.projects, item],
          },
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            projects: state.cvData.projects.map((item) =>
              item.id === id ? { ...item, ...updates, id } : item
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            projects: state.cvData.projects.filter((item) => item.id !== id),
          },
        })),

      reorderProject: (fromIndex, toIndex) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            projects: reorderArray(state.cvData.projects, fromIndex, toIndex),
          },
        })),

      // 7. Certifications
      addCertification: (item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            certifications: [...state.cvData.certifications, item],
          },
        })),

      updateCertification: (id, updates) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            certifications: state.cvData.certifications.map((item) =>
              item.id === id ? { ...item, ...updates, id } : item
            ),
          },
        })),

      removeCertification: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            certifications: state.cvData.certifications.filter((item) => item.id !== id),
          },
        })),

      // 8. Organizations
      addOrganization: (item) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            organizations: [...state.cvData.organizations, item],
          },
        })),

      updateOrganization: (id, updates) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            organizations: state.cvData.organizations.map((item) =>
              item.id === id ? { ...item, ...updates, id } : item
            ),
          },
        })),

      removeOrganization: (id) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            organizations: state.cvData.organizations.filter((item) => item.id !== id),
          },
        })),

      reorderOrganization: (fromIndex, toIndex) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            organizations: reorderArray(state.cvData.organizations, fromIndex, toIndex),
          },
        })),

      // Optional Sections Master Actions
      toggleOptionalSection: (sectionKey, enabled) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const currentSection = optSecs[sectionKey];
          const currentEnabled = currentSection?.enabled ?? false;
          const nextEnabled = enabled !== undefined ? enabled : !currentEnabled;
          const currentItems = currentSection?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                updatedAt: new Date().toISOString(),
              },
              optionalSections: {
                ...optSecs,
                [sectionKey]: {
                  ...currentSection,
                  items: currentItems,
                  ...(sectionKey === "references" ? { onDemand: (currentSection as { onDemand?: boolean })?.onDemand ?? false } : {}),
                  enabled: nextEnabled,
                },
              },
            },
          };
        }),

      setOptionalSections: (sections) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              updatedAt: new Date().toISOString(),
            },
            optionalSections: sections,
          },
        })),

      // Optional 1: Languages
      addLanguage: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.languages;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                languages: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updateLanguage: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.languages;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                languages: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removeLanguage: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.languages;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                languages: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderLanguages: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.languages;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                languages: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 2: Awards
      addAward: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.awards;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                awards: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updateAward: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.awards;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                awards: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removeAward: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.awards;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                awards: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderAwards: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.awards;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                awards: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 3: Courses
      addCourse: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.courses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                courses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updateCourse: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.courses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                courses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removeCourse: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.courses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                courses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderCourses: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.courses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                courses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 4: Licenses
      addLicense: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.licenses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                licenses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updateLicense: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.licenses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                licenses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removeLicense: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.licenses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                licenses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderLicenses: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.licenses;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                licenses: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 5: Volunteer
      addVolunteer: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.volunteer;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                volunteer: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updateVolunteer: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.volunteer;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                volunteer: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removeVolunteer: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.volunteer;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                volunteer: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderVolunteer: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.volunteer;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                volunteer: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 6: Publications
      addPublication: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.publications;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                publications: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updatePublication: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.publications;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                publications: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removePublication: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.publications;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                publications: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderPublications: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.publications;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                publications: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 7: Portfolio Links
      addPortfolioLink: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.portfolio;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                portfolio: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updatePortfolioLink: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.portfolio;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                portfolio: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removePortfolioLink: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.portfolio;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                portfolio: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderPortfolioLinks: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.portfolio;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                portfolio: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      // Optional 8: References
      addReference: (item) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.references;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                references: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  onDemand: current?.onDemand ?? false,
                  items: [...items, item],
                },
              },
            },
          };
        }),

      updateReference: (id, updates) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.references;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                references: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  onDemand: current?.onDemand ?? false,
                  items: items.map((item) =>
                    item.id === id ? { ...item, ...updates, id } : item
                  ),
                },
              },
            },
          };
        }),

      removeReference: (id) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.references;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                references: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  onDemand: current?.onDemand ?? false,
                  items: items.filter((item) => item.id !== id),
                },
              },
            },
          };
        }),

      reorderReferences: (fromIndex, toIndex) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.references;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                references: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  onDemand: current?.onDemand ?? false,
                  items: reorderArray(items, fromIndex, toIndex),
                },
              },
            },
          };
        }),

      setReferencesOnDemand: (onDemand) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.references;
          const items = current?.items ?? [];
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                references: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items,
                  onDemand,
                },
              },
            },
          };
        }),

      // Optional 9: Interests
      setInterests: (items) =>
        set((state) => {
          const optSecs = state.cvData.optionalSections ?? {};
          const current = optSecs.interests;
          return {
            cvData: {
              ...state.cvData,
              metadata: { ...state.cvData.metadata, updatedAt: new Date().toISOString() },
              optionalSections: {
                ...optSecs,
                interests: {
                  ...current,
                  enabled: current?.enabled ?? true,
                  items,
                },
              },
            },
          };
        }),

      // Metadata / Customization
      setTemplate: (templateId) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              templateId,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      setAccentColor: (accentColor) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              accentColor,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      setTypography: (typography) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              typography,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      setSectionOrder: (newOrder) =>
        set((state) => ({
          cvData: {
            ...state.cvData,
            metadata: {
              ...state.cvData.metadata,
              sectionOrder: newOrder,
              updatedAt: new Date().toISOString(),
            },
          },
        })),

      setSectionLabel: (sectionId, label) =>
        set((state) => {
          const nextLabels = { ...(state.cvData.metadata.sectionLabels ?? {}) };
          const trimmedLabel = label.trim();
          if (trimmedLabel) {
            nextLabels[sectionId] = trimmedLabel;
          } else {
            delete nextLabels[sectionId];
          }

          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                sectionLabels: nextLabels,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      reorderSections: (fromIndex, toIndex) =>
        set((state) => {
          const currentOrder = state.cvData.metadata.sectionOrder ?? [];
          const nextOrder = reorderArray(currentOrder, fromIndex, toIndex);
          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                sectionOrder: nextOrder,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      moveSectionUp: (sectionId) =>
        set((state) => {
          const currentOrder = state.cvData.metadata.sectionOrder ?? [];
          const idx = currentOrder.indexOf(sectionId);
          if (idx <= 0) return state;
          const nextOrder = reorderArray(currentOrder, idx, idx - 1);
          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                sectionOrder: nextOrder,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      moveSectionDown: (sectionId) =>
        set((state) => {
          const currentOrder = state.cvData.metadata.sectionOrder ?? [];
          const idx = currentOrder.indexOf(sectionId);
          if (idx < 0 || idx >= currentOrder.length - 1) return state;
          const nextOrder = reorderArray(currentOrder, idx, idx + 1);
          return {
            cvData: {
              ...state.cvData,
              metadata: {
                ...state.cvData.metadata,
                sectionOrder: nextOrder,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      // Root Reset / Replace
      replaceCVData: (incoming) => {
        const migration = parseAndMigrateCVData(incoming);
        if (migration.success) {
          set({ cvData: migration.data });
        } else {
          console.error("Failed to replace CV Data:", migration.error);
        }
      },

      resetCVData: () => set({ cvData: createEmptyCVData() }),

      loadSampleData: () => set({ cvData: initialCVData }),
    }),
    {
      name: "cv_builder_state_v1",
      storage: createJSONStorage(() => safeLocalStorage),
      merge: (persistedState: unknown, currentState: CVStoreState) => {
        const rawPersisted = (persistedState as { cvData?: Partial<CVData> }) || {};
        const emptyCV = createEmptyCVData();
        const mergedCvData: CVData = {
          ...emptyCV,
          ...(rawPersisted.cvData || {}),
          metadata: {
            ...emptyCV.metadata,
            ...(rawPersisted.cvData?.metadata || {}),
          },
          personalInfo: {
            ...emptyCV.personalInfo,
            ...(rawPersisted.cvData?.personalInfo || {}),
          },
          summary: {
            ...emptyCV.summary,
            ...(rawPersisted.cvData?.summary || {}),
          },
          experience: rawPersisted.cvData?.experience ?? emptyCV.experience,
          education: rawPersisted.cvData?.education ?? emptyCV.education,
          skills: rawPersisted.cvData?.skills ?? emptyCV.skills,
          projects: rawPersisted.cvData?.projects ?? emptyCV.projects,
          certifications: rawPersisted.cvData?.certifications ?? emptyCV.certifications,
          organizations: rawPersisted.cvData?.organizations ?? emptyCV.organizations,
          optionalSections: {
            ...emptyCV.optionalSections,
            ...(rawPersisted.cvData?.optionalSections || {}),
          },
        };

        // Guarantee all 9 optional sections have valid items array and enabled flag
        for (const key of Object.keys(emptyCV.optionalSections) as (keyof typeof emptyCV.optionalSections)[]) {
          const defaultSec = emptyCV.optionalSections[key];
          const currentSec = mergedCvData.optionalSections[key] as unknown as { enabled?: boolean; items?: unknown[]; onDemand?: boolean };
          mergedCvData.optionalSections[key] = {
            ...defaultSec,
            ...(currentSec || {}),
            enabled: Boolean(currentSec?.enabled),
            items: Array.isArray(currentSec?.items) ? currentSec.items : defaultSec.items,
          } as never;
        }

        return {
          ...currentState,
          ...(persistedState as Partial<CVStoreState>),
          cvData: mergedCvData,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

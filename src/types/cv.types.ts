import { z } from "zod";
import {
  CVDataSchema,
  CVMetadataSchema,
  PersonalInfoSchema,
  ProfessionalSummarySchema,
  ExperienceItemSchema,
  EducationItemSchema,
  SkillItemSchema,
  ProjectItemSchema,
  CertificationItemSchema,
  OrganizationItemSchema,
  LanguageItemSchema,
  AwardItemSchema,
  CourseItemSchema,
  LicenseItemSchema,
  VolunteerItemSchema,
  PublicationItemSchema,
  PortfolioLinkItemSchema,
  ReferenceItemSchema,
  OptionalSectionsSchema,
} from "@/schemas/cv.schema";

export type CVData = z.infer<typeof CVDataSchema>;
export type CVMetadata = z.infer<typeof CVMetadataSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type ProfessionalSummary = z.infer<typeof ProfessionalSummarySchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type SkillItem = z.infer<typeof SkillItemSchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type OrganizationItem = z.infer<typeof OrganizationItemSchema>;

export type LanguageItem = z.infer<typeof LanguageItemSchema>;
export type AwardItem = z.infer<typeof AwardItemSchema>;
export type CourseItem = z.infer<typeof CourseItemSchema>;
export type LicenseItem = z.infer<typeof LicenseItemSchema>;
export type VolunteerItem = z.infer<typeof VolunteerItemSchema>;
export type PublicationItem = z.infer<typeof PublicationItemSchema>;
export type PortfolioLinkItem = z.infer<typeof PortfolioLinkItemSchema>;
export type ReferenceItem = z.infer<typeof ReferenceItemSchema>;
export type OptionalSections = z.infer<typeof OptionalSectionsSchema>;
export type OptionalSectionKey = keyof OptionalSections;

export type TemplateId = CVMetadata["templateId"];
export type TypographyId = CVMetadata["typography"];

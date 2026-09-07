import { z } from "zod";

/**
 * Helper: Strict Safe URL Protocol validator
 * Only permits http:// or https:// (or empty string if optional)
 */
export const SafeUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val === "") return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL harus diawali dengan http:// atau https://" }
  );

/**
 * 1. Personal Information Schema
 */
export const PersonalInfoSchema = z.object({
  fullName: z.string().trim().min(1, "Nama lengkap wajib diisi").max(100, "Maksimal 100 karakter"),
  headline: z.string().trim().max(120, "Maksimal 120 karakter").optional().default(""),
  email: z.string().trim().email("Format email tidak valid").or(z.literal("")).default(""),
  phone: z.string().trim().max(30, "Maksimal 30 karakter").optional().default(""),
  location: z.string().trim().max(100, "Maksimal 100 karakter").optional().default(""),
  linkedin: z.string().trim().max(200, "Maksimal 200 karakter").optional().default(""),
  github: z.string().trim().max(200, "Maksimal 200 karakter").optional().default(""),
  website: z.string().trim().max(200, "Maksimal 200 karakter").optional().default(""),
  showFullLinks: z.boolean().optional().default(false),
  photoUrl: z
    .string()
    .refine(
      (val) => val === "" || val.startsWith("data:image/"),
      "Format foto profil harus data URI gambar yang valid"
    )
    .optional()
    .default(""),
});

/**
 * 2. Professional Summary Schema
 */
export const ProfessionalSummarySchema = z.object({
  summary: z.string().max(2000, "Ringkasan maksimal 2000 karakter").optional().default(""),
});

/**
 * 3. Experience Item Schema
 */
export const ExperienceItemSchema = z
  .object({
    id: z.string().uuid(),
    company: z.string().trim().min(1, "Nama perusahaan wajib diisi").max(100, "Maksimal 100 karakter"),
    position: z.string().trim().min(1, "Posisi / jabatan wajib diisi").max(100, "Maksimal 100 karakter"),
    location: z.string().trim().max(100, "Maksimal 100 karakter").optional().default(""),
    startDate: z
      .string()
      .trim()
      .min(1, "Bulan mulai wajib diisi")
      .regex(/^\d{4}-\d{2}$/, "Format tanggal harus YYYY-MM"),
    endDate: z.string().trim().optional().default(""),
    current: z.boolean().default(false),
    description: z.string().max(3000, "Deskripsi maksimal 3000 karakter").optional().default(""),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Tanggal selesai wajib diisi jika bukan posisi saat ini",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.current && data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
      path: ["endDate"],
    }
  );

/**
 * 4. Education Item Schema
 */
export const EducationItemSchema = z
  .object({
    id: z.string().uuid(),
    institution: z.string().trim().min(1, "Nama institusi wajib diisi").max(120, "Maksimal 120 karakter"),
    degree: z.string().trim().min(1, "Gelar / jenjang pendidikan wajib diisi").max(100, "Maksimal 100 karakter"),
    field: z.string().trim().max(100, "Maksimal 100 karakter").optional().default(""),
    location: z.string().trim().max(100, "Maksimal 100 karakter").optional().default(""),
    startDate: z
      .string()
      .trim()
      .min(1, "Bulan mulai wajib diisi")
      .regex(/^\d{4}-\d{2}$/, "Format tanggal harus YYYY-MM"),
    endDate: z.string().trim().optional().default(""),
    current: z.boolean().default(false),
    gpa: z.string().trim().max(30, "Maksimal 30 karakter").optional().default(""),
    description: z.string().max(1500, "Deskripsi maksimal 1500 karakter").optional().default(""),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Tanggal selesai wajib diisi jika sedang tidak menempuh pendidikan",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.current && data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
      path: ["endDate"],
    }
  );

/**
 * 5. Skill Item Schema
 */
export const SkillItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Nama keahlian wajib diisi").max(50, "Maksimal 50 karakter"),
  category: z.string().trim().max(50, "Maksimal 50 karakter").optional().default("Keahlian Utama"),
});

/**
 * 6. Project Item Schema
 */
export const ProjectItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Nama proyek wajib diisi").max(100, "Maksimal 100 karakter"),
  role: z.string().trim().max(100, "Maksimal 100 karakter").optional().default(""),
  technologies: z.array(z.string().trim().max(40)).default([]),
  url: SafeUrlSchema.optional().default(""),
  startDate: z.string().trim().optional().default(""),
  endDate: z.string().trim().optional().default(""),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional().default(""),
});

/**
 * 7. Certification Item Schema
 */
export const CertificationItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Nama sertifikasi wajib diisi").max(120, "Maksimal 120 karakter"),
  issuer: z.string().trim().min(1, "Penerbit sertifikasi wajib diisi").max(100, "Maksimal 100 karakter"),
  issueDate: z
    .string()
    .trim()
    .min(1, "Tanggal penerbitan wajib diisi")
    .regex(/^\d{4}-\d{2}$/, "Format tanggal harus YYYY-MM"),
  expiryDate: z.string().trim().optional().default(""),
  credentialUrl: SafeUrlSchema.optional().default(""),
});

/**
 * 8. Organization Item Schema
 */
export const OrganizationItemSchema = z
  .object({
    id: z.string().uuid(),
    organization: z.string().trim().min(1, "Nama organisasi wajib diisi").max(120, "Maksimal 120 karakter"),
    position: z.string().trim().min(1, "Posisi / jabatan wajib diisi").max(100, "Maksimal 100 karakter"),
    startDate: z
      .string()
      .trim()
      .min(1, "Bulan mulai wajib diisi")
      .regex(/^\d{4}-\d{2}$/, "Format tanggal harus YYYY-MM"),
    endDate: z.string().trim().optional().default(""),
    current: z.boolean().default(false),
    description: z.string().max(1500, "Deskripsi maksimal 1500 karakter").optional().default(""),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Tanggal selesai wajib diisi jika sudah tidak aktif",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.current && data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
      path: ["endDate"],
    }
  );

/**
 * Optional Sections Schemas
 */

/** 1. Language Item */
export const LanguageItemSchema = z.object({
  id: z.string().uuid(),
  language: z.string().trim().min(1, "Nama bahasa wajib diisi").max(60, "Maksimal 60 karakter"),
  proficiency: z.string().trim().min(1, "Tingkat kemampuan wajib diisi").max(50, "Maksimal 50 karakter").default("Menengah"),
});

/** 2. Award Item */
export const AwardItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "Nama penghargaan wajib diisi").max(120, "Maksimal 120 karakter"),
  issuer: z.string().trim().min(1, "Pemberi penghargaan wajib diisi").max(100, "Maksimal 100 karakter"),
  date: z.string().trim().min(1, "Tanggal penghargaan wajib diisi").max(20, "Maksimal 20 karakter"),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().default(""),
});

/** 3. Course Item */
export const CourseItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "Nama kursus/pelatihan wajib diisi").max(120, "Maksimal 120 karakter"),
  provider: z.string().trim().min(1, "Penyelenggara wajib diisi").max(100, "Maksimal 100 karakter"),
  date: z.string().trim().optional().default(""),
  duration: z.string().trim().max(50, "Maksimal 50 karakter").optional().default(""),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().default(""),
  url: SafeUrlSchema.optional().default(""),
});

/** 4. License Item */
export const LicenseItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "Nama lisensi wajib diisi").max(120, "Maksimal 120 karakter"),
  issuer: z.string().trim().min(1, "Lembaga penerbit wajib diisi").max(100, "Maksimal 100 karakter"),
  licenseNumber: z.string().trim().max(60, "Maksimal 60 karakter").optional().default(""),
  issueDate: z.string().trim().min(1, "Tanggal terbit wajib diisi").max(20, "Maksimal 20 karakter"),
  expiryDate: z.string().trim().optional().default(""),
  url: SafeUrlSchema.optional().default(""),
});

/** 5. Volunteer Item */
export const VolunteerItemSchema = z
  .object({
    id: z.string().uuid(),
    organization: z.string().trim().min(1, "Nama organisasi relawan wajib diisi").max(120, "Maksimal 120 karakter"),
    role: z.string().trim().min(1, "Peran relawan wajib diisi").max(100, "Maksimal 100 karakter"),
    startDate: z.string().trim().min(1, "Bulan mulai wajib diisi"),
    endDate: z.string().trim().optional().default(""),
    current: z.boolean().default(false),
    description: z.string().max(1500, "Deskripsi maksimal 1500 karakter").optional().default(""),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "Tanggal selesai wajib diisi jika sudah tidak aktif",
      path: ["endDate"],
    }
  );

/** 6. Publication Item */
export const PublicationItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1, "Judul publikasi wajib diisi").max(200, "Maksimal 200 karakter"),
  type: z.string().trim().max(60, "Maksimal 60 karakter").optional().default(""),
  publisher: z.string().trim().min(1, "Penerbit/jurnal wajib diisi").max(120, "Maksimal 120 karakter"),
  date: z.string().trim().min(1, "Tanggal publikasi wajib diisi").max(20, "Maksimal 20 karakter"),
  url: SafeUrlSchema.optional().default(""),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().default(""),
});

/** 7. Portfolio Link Item */
export const PortfolioLinkItemSchema = z.object({
  id: z.string().uuid(),
  label: z.string().trim().min(1, "Label tautan wajib diisi").max(60, "Maksimal 60 karakter"),
  url: SafeUrlSchema,
});

/** 8. Reference Item */
export const ReferenceItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Nama pemberi referensi wajib diisi").max(100, "Maksimal 100 karakter"),
  position: z.string().trim().min(1, "Jabatan wajib diisi").max(100, "Maksimal 100 karakter"),
  company: z.string().trim().min(1, "Perusahaan/institusi wajib diisi").max(100, "Maksimal 100 karakter"),
  email: z.string().trim().email("Format email tidak valid").or(z.literal("")).optional().default(""),
  phone: z.string().trim().max(30, "Maksimal 30 karakter").optional().default(""),
  relationship: z.string().trim().max(80, "Maksimal 80 karakter").optional().default(""),
});

/**
 * Optional Sections Group Schema
 */
export const OptionalSectionsSchema = z.object({
  languages: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(LanguageItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  awards: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(AwardItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  courses: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(CourseItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  licenses: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(LicenseItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  volunteer: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(VolunteerItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  publications: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(PublicationItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  portfolio: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(PortfolioLinkItemSchema).default([]),
    })
    .default({ enabled: false, items: [] }),
  references: z
    .object({
      enabled: z.boolean().default(false),
      onDemand: z.boolean().default(false),
      items: z.array(ReferenceItemSchema).default([]),
    })
    .default({ enabled: false, onDemand: false, items: [] }),
  interests: z
    .object({
      enabled: z.boolean().default(false),
      items: z.array(z.string().trim().min(1).max(50)).default([]),
    })
    .default({ enabled: false, items: [] }),
}).default({
  languages: { enabled: false, items: [] },
  awards: { enabled: false, items: [] },
  courses: { enabled: false, items: [] },
  licenses: { enabled: false, items: [] },
  volunteer: { enabled: false, items: [] },
  publications: { enabled: false, items: [] },
  portfolio: { enabled: false, items: [] },
  references: { enabled: false, onDemand: false, items: [] },
  interests: { enabled: false, items: [] },
});

export const DEFAULT_SECTION_ORDER = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "organizations",
  "portfolio",
  "languages",
  "awards",
  "courses",
  "licenses",
  "volunteer",
  "publications",
  "references",
  "interests",
] as const;

/**
 * Metadata Schema
 */
export const CVMetadataSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  templateId: z.enum(["modern", "minimal", "classic"]).default("modern"),
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, "Format warna HEX tidak valid")
    .default("#2563eb"),
  typography: z.enum(["inter", "outfit", "serif"]).default("inter"),
  sectionOrder: z.array(z.string()).optional().default([...DEFAULT_SECTION_ORDER]),
  sectionLabels: z.record(z.string(), z.string().trim().max(80)).optional().default({}),
});

/**
 * Root CV Data Model Schema (Version 1)
 */
export const CVDataSchema = z.object({
  version: z.literal(1),
  metadata: CVMetadataSchema,
  personalInfo: PersonalInfoSchema,
  summary: ProfessionalSummarySchema,
  experience: z.array(ExperienceItemSchema).default([]),
  education: z.array(EducationItemSchema).default([]),
  skills: z.array(SkillItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  organizations: z.array(OrganizationItemSchema).default([]),
  optionalSections: OptionalSectionsSchema.default({
    languages: { enabled: false, items: [] },
    awards: { enabled: false, items: [] },
    courses: { enabled: false, items: [] },
    licenses: { enabled: false, items: [] },
    volunteer: { enabled: false, items: [] },
    publications: { enabled: false, items: [] },
    portfolio: { enabled: false, items: [] },
    references: { enabled: false, onDemand: false, items: [] },
    interests: { enabled: false, items: [] },
  }),
});

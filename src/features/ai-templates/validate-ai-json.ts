import { parseAndMigrateCVData, type MigrationResult } from "@/schemas/migration";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

/**
 * UUID v4 regex pattern.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ensureUUID(idValue: unknown): string {
  if (typeof idValue === "string" && UUID_REGEX.test(idValue)) {
    return idValue;
  }
  return generateUUID();
}

/**
 * Strips markdown link formatting, mailto: prefixes, angle brackets, etc.
 * Example: "[candidate@example.com](mailto:candidate@example.com)" -> "candidate@example.com"
 */
export function cleanEmail(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let str = raw.trim();
  if (!str) return "";

  // 1. Check if markdown link format: [text](mailto:email) or [email](email)
  const mdMatch = str.match(/\[(.*?)\]\((?:mailto:)?(.*?)\)/i);
  if (mdMatch) {
    const target = mdMatch[2].trim() || mdMatch[1].trim();
    str = target;
  }

  // 2. Remove mailto: prefix
  str = str.replace(/^mailto:/i, "").trim();

  // 3. Remove angle brackets <email@example.com>
  str = str.replace(/^<|>$/g, "").trim();

  // 4. Remove common prefix like "Email: "
  str = str.replace(/^email:\s*/i, "").trim();

  // 5. Extract valid email pattern if wrapped in extra text
  const emailMatch = str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    return emailMatch[0];
  }

  return "";
}

/**
 * Strips markdown link formatting, ensures http:// or https:// protocol, and validates URL.
 * Example: "[https://ariyoaziz.github.io/](https://ariyoaziz.github.io/)" -> "https://ariyoaziz.github.io/"
 */
export function cleanUrl(raw: unknown, fallbackIfInvalid = ""): string {
  if (typeof raw !== "string") return fallbackIfInvalid;
  let str = raw.trim();
  if (!str) return fallbackIfInvalid;

  // 1. Check if markdown link format: [text](url)
  const mdMatch = str.match(/\[(.*?)\]\((.*?)\)/);
  if (mdMatch) {
    str = mdMatch[2].trim() || mdMatch[1].trim();
  }

  // 2. Remove angle brackets <url>
  str = str.replace(/^<|>$/g, "").trim();

  // 3. Remove common prefixes like "Website: ", "URL: "
  str = str.replace(/^(?:website|url|portfolio|link):\s*/i, "").trim();

  // 4. Auto-prepend https:// if protocol is missing for common domains
  if (str && !/^https?:\/\//i.test(str)) {
    if (/^(?:www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i.test(str)) {
      str = `https://${str}`;
    }
  }

  // 5. Validate URL format
  try {
    const parsed = new URL(str);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return str;
    }
  } catch {
    return fallbackIfInvalid;
  }

  return fallbackIfInvalid;
}

/**
 * Strips markdown artifacts and non-phone noise from phone numbers.
 */
export function cleanPhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let str = raw.trim();
  if (!str) return "";

  const mdMatch = str.match(/\[(.*?)\]\((?:tel:)?(.*?)\)/i);
  if (mdMatch) {
    str = mdMatch[2].trim() || mdMatch[1].trim();
  }
  str = str.replace(/^tel:/i, "").trim();
  str = str.replace(/^<|>$/g, "").trim();
  str = str.replace(/^phone:\s*/i, "").trim();

  return str.slice(0, 30);
}

/**
 * Normalizes date string into YYYY-MM format.
 * Examples: "2022-01-15" -> "2022-01", "2022/05" -> "2022-05", "2022" -> "2022-01"
 */
export function cleanDateYearMonth(raw: unknown, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const str = raw.trim();
  if (!str) return fallback;

  // Exact match YYYY-MM
  if (/^\d{4}-\d{2}$/.test(str)) {
    return str;
  }

  // Match YYYY-MM-DD or YYYY/MM/DD
  const matchFull = str.match(/^(\d{4})[-/.](\d{1,2})/);
  if (matchFull) {
    const year = matchFull[1];
    const month = matchFull[2].padStart(2, "0");
    return `${year}-${month}`;
  }

  // Match just Year (YYYY)
  const matchYear = str.match(/^(\d{4})$/);
  if (matchYear) {
    return `${matchYear[1]}-01`;
  }

  return fallback;
}

/**
 * Normalizes untrusted AI output payload:
 * - Cleans markdown artifacts from emails, URLs, and phone numbers
 * - Normalizes dates and UUIDs
 * - Resolves field aliases (e.g. role -> position, name -> title)
 * - Ensures required top-level collections are valid
 */
export function normalizeAIJsonPayload(rawObj: unknown): unknown {
  if (typeof rawObj !== "object" || rawObj === null) {
    return rawObj;
  }

  const data = JSON.parse(JSON.stringify(rawObj)) as Record<string, unknown>;

  // Ensure version is 1
  if (!data.version || typeof data.version !== "number") {
    data.version = 1;
  }

  // Ensure metadata
  if (!data.metadata || typeof data.metadata !== "object") {
    data.metadata = {};
  }
  const meta = data.metadata as Record<string, unknown>;
  meta.id = ensureUUID(meta.id);

  // Normalize createdAt to strict ISO 8601 UTC string
  if (typeof meta.createdAt === "string" && !isNaN(Date.parse(meta.createdAt))) {
    meta.createdAt = new Date(meta.createdAt).toISOString();
  } else {
    meta.createdAt = new Date().toISOString();
  }

  // Normalize updatedAt to strict ISO 8601 UTC string
  if (typeof meta.updatedAt === "string" && !isNaN(Date.parse(meta.updatedAt))) {
    meta.updatedAt = new Date(meta.updatedAt).toISOString();
  } else {
    meta.updatedAt = new Date().toISOString();
  }

  if (!meta.templateId || !["modern", "minimal", "classic"].includes(meta.templateId as string)) {
    meta.templateId = "modern";
  }
  if (!meta.accentColor || !/^#([A-Fa-f0-9]{6})$/.test(meta.accentColor as string)) {
    meta.accentColor = "#2563eb";
  }
  if (!meta.typography || !["inter", "outfit", "serif"].includes(meta.typography as string)) {
    meta.typography = "inter";
  }

  if (!Array.isArray(meta.sectionOrder)) {
    meta.sectionOrder = [...DEFAULT_SECTION_ORDER];
  } else {
    // Append missing default section keys if any are missing
    const existing = new Set(meta.sectionOrder as string[]);
    const missing = DEFAULT_SECTION_ORDER.filter((sec) => !existing.has(sec));
    if (missing.length > 0) {
      meta.sectionOrder = [...(meta.sectionOrder as string[]), ...missing];
    }
  }

  // Ensure personalInfo
  if (!data.personalInfo || typeof data.personalInfo !== "object") {
    data.personalInfo = { fullName: "Nama Lengkap" };
  } else {
    const pInfo = data.personalInfo as Record<string, unknown>;
    if (!pInfo.fullName || typeof pInfo.fullName !== "string" || !pInfo.fullName.trim()) {
      pInfo.fullName = "Nama Lengkap";
    }
    pInfo.fullName = typeof pInfo.fullName === "string" ? pInfo.fullName.trim() : "Nama Lengkap";
    pInfo.headline = typeof pInfo.headline === "string" ? pInfo.headline.trim() : "";
    pInfo.email = cleanEmail(pInfo.email);
    pInfo.phone = cleanPhone(pInfo.phone);
    pInfo.location = typeof pInfo.location === "string" ? pInfo.location.trim() : "";
    pInfo.linkedin = cleanUrl(pInfo.linkedin);
    pInfo.github = cleanUrl(pInfo.github);
    pInfo.website = cleanUrl(pInfo.website);
    pInfo.showFullLinks = Boolean(pInfo.showFullLinks);
    pInfo.photoUrl = typeof pInfo.photoUrl === "string" ? pInfo.photoUrl.trim() : "";
  }

  // Ensure summary
  if (!data.summary || typeof data.summary !== "object") {
    data.summary = { summary: "" };
  } else {
    const sum = data.summary as Record<string, unknown>;
    sum.summary = typeof sum.summary === "string" ? sum.summary : "";
  }

  // Ensure experience
  if (Array.isArray(data.experience)) {
    data.experience = data.experience.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = { ...(item as Record<string, unknown>) };
        itemObj.id = ensureUUID(itemObj.id);
        itemObj.company = typeof itemObj.company === "string" && itemObj.company.trim() ? itemObj.company.trim() : "Perusahaan";
        itemObj.position = typeof itemObj.position === "string" && itemObj.position.trim()
          ? itemObj.position.trim()
          : typeof itemObj.role === "string" && itemObj.role.trim()
          ? itemObj.role.trim()
          : "Posisi";
        itemObj.location = typeof itemObj.location === "string" ? itemObj.location.trim() : "";
        itemObj.startDate = cleanDateYearMonth(itemObj.startDate, "2020-01");
        itemObj.current = Boolean(itemObj.current);
        itemObj.endDate = itemObj.current ? "" : cleanDateYearMonth(itemObj.endDate, "");
        if (!itemObj.current && !itemObj.endDate) {
          itemObj.current = true;
          itemObj.endDate = "";
        }
        if (!itemObj.current && itemObj.startDate && itemObj.endDate && itemObj.endDate < itemObj.startDate) {
          itemObj.endDate = itemObj.startDate;
        }
        itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
        return itemObj;
      }
      return item;
    });
  } else {
    data.experience = [];
  }

  // Ensure education
  if (Array.isArray(data.education)) {
    data.education = data.education.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = { ...(item as Record<string, unknown>) };
        itemObj.id = ensureUUID(itemObj.id);
        itemObj.institution = typeof itemObj.institution === "string" && itemObj.institution.trim() ? itemObj.institution.trim() : "Institusi Pendidikan";
        itemObj.degree = typeof itemObj.degree === "string" && itemObj.degree.trim() ? itemObj.degree.trim() : "Pendidikan";
        itemObj.field = typeof itemObj.field === "string" ? itemObj.field.trim() : "";
        itemObj.location = typeof itemObj.location === "string" ? itemObj.location.trim() : "";
        itemObj.startDate = cleanDateYearMonth(itemObj.startDate, "2020-01");
        itemObj.current = Boolean(itemObj.current);
        itemObj.endDate = itemObj.current ? "" : cleanDateYearMonth(itemObj.endDate, "");
        if (!itemObj.current && !itemObj.endDate) {
          itemObj.current = true;
          itemObj.endDate = "";
        }
        if (!itemObj.current && itemObj.startDate && itemObj.endDate && itemObj.endDate < itemObj.startDate) {
          itemObj.endDate = itemObj.startDate;
        }
        itemObj.gpa = typeof itemObj.gpa === "string" ? itemObj.gpa.trim() : "";
        itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
        return itemObj;
      }
      return item;
    });
  } else {
    data.education = [];
  }

  // Ensure skills
  if (Array.isArray(data.skills)) {
    data.skills = data.skills.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = { ...(item as Record<string, unknown>) };
        itemObj.id = ensureUUID(itemObj.id);
        itemObj.name = typeof itemObj.name === "string" && itemObj.name.trim() ? itemObj.name.trim() : "Keahlian";
        itemObj.category = typeof itemObj.category === "string" && itemObj.category.trim() ? itemObj.category.trim() : "Keahlian Utama";
        return itemObj;
      }
      return item;
    });
  } else {
    data.skills = [];
  }

  // Ensure projects
  if (Array.isArray(data.projects)) {
    data.projects = data.projects.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = { ...(item as Record<string, unknown>) };
        itemObj.id = ensureUUID(itemObj.id);
        itemObj.name = typeof itemObj.name === "string" && itemObj.name.trim() ? itemObj.name.trim() : "Proyek";
        itemObj.role = typeof itemObj.role === "string" ? itemObj.role.trim() : "";
        itemObj.technologies = Array.isArray(itemObj.technologies)
          ? itemObj.technologies.filter((t): t is string => typeof t === "string" && Boolean(t.trim())).map((t) => t.trim())
          : [];
        itemObj.url = cleanUrl(itemObj.url);
        itemObj.startDate = cleanDateYearMonth(itemObj.startDate, "");
        itemObj.endDate = cleanDateYearMonth(itemObj.endDate, "");
        itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
        return itemObj;
      }
      return item;
    });
  } else {
    data.projects = [];
  }

  // Ensure certifications
  if (Array.isArray(data.certifications)) {
    data.certifications = data.certifications.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = { ...(item as Record<string, unknown>) };
        itemObj.id = ensureUUID(itemObj.id);
        itemObj.name = typeof itemObj.name === "string" && itemObj.name.trim() ? itemObj.name.trim() : "Sertifikasi";
        itemObj.issuer = typeof itemObj.issuer === "string" && itemObj.issuer.trim() ? itemObj.issuer.trim() : "Penerbit";
        itemObj.issueDate = cleanDateYearMonth(itemObj.issueDate, "2022-01");
        itemObj.expiryDate = cleanDateYearMonth(itemObj.expiryDate, "");
        itemObj.credentialUrl = cleanUrl(itemObj.credentialUrl);
        return itemObj;
      }
      return item;
    });
  } else {
    data.certifications = [];
  }

  // Ensure organizations
  if (Array.isArray(data.organizations)) {
    data.organizations = data.organizations.map((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const itemObj = { ...(item as Record<string, unknown>) };
        itemObj.id = ensureUUID(itemObj.id);
        itemObj.organization = typeof itemObj.organization === "string" && itemObj.organization.trim() ? itemObj.organization.trim() : "Organisasi";
        itemObj.position = typeof itemObj.position === "string" && itemObj.position.trim()
          ? itemObj.position.trim()
          : typeof itemObj.role === "string" && itemObj.role.trim()
          ? itemObj.role.trim()
          : typeof itemObj.title === "string" && itemObj.title.trim()
          ? itemObj.title.trim()
          : "Anggota";
        itemObj.startDate = cleanDateYearMonth(itemObj.startDate, "2020-01");
        itemObj.current = Boolean(itemObj.current);
        itemObj.endDate = itemObj.current ? "" : cleanDateYearMonth(itemObj.endDate, "");
        if (!itemObj.current && !itemObj.endDate) {
          itemObj.current = true;
          itemObj.endDate = "";
        }
        if (!itemObj.current && itemObj.startDate && itemObj.endDate && itemObj.endDate < itemObj.startDate) {
          itemObj.endDate = itemObj.startDate;
        }
        itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
        return itemObj;
      }
      return item;
    });
  } else {
    data.organizations = [];
  }

  // Ensure optionalSections
  if (!data.optionalSections || typeof data.optionalSections !== "object") {
    data.optionalSections = {
      languages: { enabled: false, items: [] },
      awards: { enabled: false, items: [] },
      courses: { enabled: false, items: [] },
      licenses: { enabled: false, items: [] },
      volunteer: { enabled: false, items: [] },
      publications: { enabled: false, items: [] },
      portfolio: { enabled: false, items: [] },
      references: { enabled: false, onDemand: false, items: [] },
      interests: { enabled: false, items: [] },
    };
  } else {
    const opt = data.optionalSections as Record<string, unknown>;

    // languages
    if (opt.languages && typeof opt.languages === "object") {
      const sec = opt.languages as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.language = typeof itemObj.language === "string" && itemObj.language.trim() ? itemObj.language.trim() : "Bahasa";
            itemObj.proficiency = typeof itemObj.proficiency === "string" && itemObj.proficiency.trim() ? itemObj.proficiency.trim() : "Menengah";
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // awards
    if (opt.awards && typeof opt.awards === "object") {
      const sec = opt.awards as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.title = typeof itemObj.title === "string" && itemObj.title.trim()
              ? itemObj.title.trim()
              : typeof itemObj.name === "string" && itemObj.name.trim()
              ? itemObj.name.trim()
              : "Penghargaan";
            itemObj.issuer = typeof itemObj.issuer === "string" && itemObj.issuer.trim() ? itemObj.issuer.trim() : "Penyelenggara";
            itemObj.date = typeof itemObj.date === "string" && itemObj.date.trim() ? itemObj.date.trim() : "2024";
            itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // courses
    if (opt.courses && typeof opt.courses === "object") {
      const sec = opt.courses as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.title = typeof itemObj.title === "string" && itemObj.title.trim()
              ? itemObj.title.trim()
              : typeof itemObj.name === "string" && itemObj.name.trim()
              ? itemObj.name.trim()
              : "Kursus";
            itemObj.provider = typeof itemObj.provider === "string" && itemObj.provider.trim() ? itemObj.provider.trim() : "Penyelenggara";
            itemObj.date = typeof itemObj.date === "string" ? itemObj.date.trim() : "";
            itemObj.duration = typeof itemObj.duration === "string" ? itemObj.duration.trim() : "";
            itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
            itemObj.url = cleanUrl(itemObj.url || itemObj.certificateUrl);
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // licenses
    if (opt.licenses && typeof opt.licenses === "object") {
      const sec = opt.licenses as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.title = typeof itemObj.title === "string" && itemObj.title.trim()
              ? itemObj.title.trim()
              : typeof itemObj.name === "string" && itemObj.name.trim()
              ? itemObj.name.trim()
              : "Lisensi";
            itemObj.issuer = typeof itemObj.issuer === "string" && itemObj.issuer.trim() ? itemObj.issuer.trim() : "Lembaga Penerbit";
            itemObj.licenseNumber = typeof itemObj.licenseNumber === "string" ? itemObj.licenseNumber.trim() : "";
            itemObj.issueDate = typeof itemObj.issueDate === "string" && itemObj.issueDate.trim() ? itemObj.issueDate.trim() : "2024";
            itemObj.expiryDate = typeof itemObj.expiryDate === "string" ? itemObj.expiryDate.trim() : "";
            itemObj.url = cleanUrl(itemObj.url);
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // volunteer
    if (opt.volunteer && typeof opt.volunteer === "object") {
      const sec = opt.volunteer as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.organization = typeof itemObj.organization === "string" && itemObj.organization.trim() ? itemObj.organization.trim() : "Organisasi";
            itemObj.role = typeof itemObj.role === "string" && itemObj.role.trim()
              ? itemObj.role.trim()
              : typeof itemObj.position === "string" && itemObj.position.trim()
              ? itemObj.position.trim()
              : "Relawan";
            itemObj.startDate = typeof itemObj.startDate === "string" && itemObj.startDate.trim() ? itemObj.startDate.trim() : "2023";
            itemObj.current = Boolean(itemObj.current);
            itemObj.endDate = itemObj.current ? "" : (typeof itemObj.endDate === "string" ? itemObj.endDate.trim() : "");
            if (!itemObj.current && !itemObj.endDate) {
              itemObj.current = true;
              itemObj.endDate = "";
            }
            itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // publications
    if (opt.publications && typeof opt.publications === "object") {
      const sec = opt.publications as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.title = typeof itemObj.title === "string" && itemObj.title.trim() ? itemObj.title.trim() : "Publikasi";
            itemObj.type = typeof itemObj.type === "string" ? itemObj.type.trim() : "";
            itemObj.publisher = typeof itemObj.publisher === "string" && itemObj.publisher.trim() ? itemObj.publisher.trim() : "Penerbit";
            itemObj.date = typeof itemObj.date === "string" && itemObj.date.trim() ? itemObj.date.trim() : "2024";
            itemObj.url = cleanUrl(itemObj.url);
            itemObj.description = typeof itemObj.description === "string" ? itemObj.description : "";
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // portfolio
    if (opt.portfolio && typeof opt.portfolio === "object") {
      const sec = opt.portfolio as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.label = typeof itemObj.label === "string" && itemObj.label.trim() ? itemObj.label.trim() : "Portfolio";
            itemObj.url = cleanUrl(itemObj.url, "https://example.com");
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // references
    if (opt.references && typeof opt.references === "object") {
      const sec = opt.references as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      sec.onDemand = Boolean(sec.onDemand);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const itemObj = { ...(item as Record<string, unknown>) };
            itemObj.id = ensureUUID(itemObj.id);
            itemObj.name = typeof itemObj.name === "string" && itemObj.name.trim() ? itemObj.name.trim() : "Nama Referensi";
            itemObj.position = typeof itemObj.position === "string" && itemObj.position.trim() ? itemObj.position.trim() : "Posisi";
            itemObj.company = typeof itemObj.company === "string" && itemObj.company.trim() ? itemObj.company.trim() : "Perusahaan";
            itemObj.email = cleanEmail(itemObj.email);
            itemObj.phone = cleanPhone(itemObj.phone);
            itemObj.relationship = typeof itemObj.relationship === "string" ? itemObj.relationship.trim() : "";
            return itemObj;
          }
          return item;
        });
      } else {
        sec.items = [];
      }
    }

    // interests
    if (opt.interests && typeof opt.interests === "object") {
      const sec = opt.interests as Record<string, unknown>;
      sec.enabled = Boolean(sec.enabled);
      if (Array.isArray(sec.items)) {
        sec.items = sec.items
          .filter((i): i is string => typeof i === "string" && Boolean(i.trim()))
          .map((i) => i.trim());
      } else {
        sec.items = [];
      }
    }
  }

  return data;
}

/**
 * Validates untrusted AI-generated JSON text.
 * Strips code fences, extracts JSON, normalizes identifiers & formats, and checks against Zod schema.
 */
export function validateAndParseAIJsonString(rawText: string): MigrationResult {
  if (!rawText || !rawText.trim()) {
    return {
      success: false,
      error: "Input JSON kosong. Silakan tempelkan output JSON dari AI eksternal.",
    };
  }

  let cleanText = rawText.trim();

  // Strip markdown code fences if user included them (e.g. ```json ... ```)
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  // Handle case where text contains JSON wrapped inside other conversational text
  if (!cleanText.startsWith("{")) {
    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleanText);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "SyntaxError";
    return {
      success: false,
      error: `Format JSON tidak valid atau rusak: ${errorMsg}`,
    };
  }

  const normalized = normalizeAIJsonPayload(parsed);
  return parseAndMigrateCVData(normalized);
}

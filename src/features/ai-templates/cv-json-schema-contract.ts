import type { GeneratedAIPromptPayload } from "./ai-template-types";

/**
 * Single source of truth JSON schema string for External AI Prompts.
 * Conforms 100% to active CVDataSchema Version 1.
 */
export const CV_DATA_JSON_SCHEMA_STR = JSON.stringify(
  {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "CVData",
    description: "Root CV Data Model Schema (Version 1) for CV ATS Builder",
    type: "object",
    required: [
      "version",
      "metadata",
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "organizations",
      "optionalSections",
    ],
    properties: {
      version: {
        type: "integer",
        const: 1,
        description: "Schema version number, strictly integer 1",
      },
      metadata: {
        type: "object",
        required: ["id", "createdAt", "updatedAt", "templateId", "accentColor", "typography"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique UUID v4 string (e.g., e1a90f23-5c82-4115-a7b2-601e3b320001)",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Strict ISO 8601 UTC string with trailing Z (e.g., 2026-09-06T12:00:00.000Z)",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Strict ISO 8601 UTC string with trailing Z (e.g., 2026-09-06T12:00:00.000Z)",
          },
          templateId: { type: "string", enum: ["modern", "minimal", "classic"] },
          accentColor: { type: "string", pattern: "^#([A-Fa-f0-9]{6})$" },
          typography: { type: "string", enum: ["inter", "outfit", "serif"] },
          sectionLabels: {
            type: "object",
            additionalProperties: { type: "string", maxLength: 80 },
            description: "Optional CV-only section headings keyed by section id; editor labels remain unchanged.",
          },
        },
      },
      personalInfo: {
        type: "object",
        required: ["fullName"],
        properties: {
          fullName: { type: "string", minLength: 1, maxLength: 100, description: "Candidate's full name (required)" },
          headline: { type: "string", maxLength: 120, description: "Professional title / headline, or empty string \"\"" },
          email: {
            type: "string",
            description:
              "Raw plain email address only (e.g., 'candidate@example.com'). DO NOT use markdown links like '[email](mailto:...)', DO NOT use 'mailto:', DO NOT use HTML, DO NOT prefix with 'Email:'. If not available, use empty string \"\".",
          },
          phone: { type: "string", maxLength: 30, description: "Raw phone number (e.g., '+62 800 0000 0000'), or empty string \"\"" },
          location: { type: "string", maxLength: 100, description: "City, Country (e.g., 'Jakarta, Indonesia'), or empty string \"\"" },
          linkedin: {
            type: "string",
            maxLength: 200,
            description: "Raw absolute URL (e.g., 'https://linkedin.com/in/username'), or empty string \"\". DO NOT use markdown links.",
          },
          github: {
            type: "string",
            maxLength: 200,
            description: "Raw absolute URL (e.g., 'https://github.com/username'), or empty string \"\". DO NOT use markdown links.",
          },
          website: {
            type: "string",
            maxLength: 200,
            description: "Raw absolute URL (e.g., 'https://ariyoaziz.github.io/'), or empty string \"\". DO NOT use markdown links.",
          },
          photoUrl: { type: "string", description: "Profile photo data URI or empty string \"\"" },
        },
      },
      summary: {
        type: "object",
        properties: {
          summary: { type: "string", maxLength: 2000 },
        },
      },
      experience: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "company", "position", "startDate", "current"],
          properties: {
            id: { type: "string", format: "uuid" },
            company: { type: "string", minLength: 1, maxLength: 100 },
            position: { type: "string", minLength: 1, maxLength: 100 },
            location: { type: "string", maxLength: 100 },
            startDate: { type: "string", pattern: "^\\d{4}-\\d{2}$" },
            endDate: { type: "string" },
            current: { type: "boolean" },
            description: { type: "string", maxLength: 3000 },
          },
        },
      },
      education: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "institution", "degree", "field", "startDate", "current"],
          properties: {
            id: { type: "string", format: "uuid" },
            institution: { type: "string", minLength: 1, maxLength: 120 },
            degree: { type: "string", minLength: 1, maxLength: 100 },
            field: { type: "string", maxLength: 100 },
            location: { type: "string", maxLength: 100 },
            startDate: { type: "string", pattern: "^\\d{4}-\\d{2}$" },
            endDate: { type: "string" },
            current: { type: "boolean" },
            gpa: { type: "string", maxLength: 30 },
            description: { type: "string", maxLength: 1500 },
          },
        },
      },
      skills: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", minLength: 1, maxLength: 50 },
            category: { type: "string", maxLength: 50 },
          },
        },
      },
      projects: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", minLength: 1, maxLength: 100 },
            role: { type: "string", maxLength: 100 },
            technologies: { type: "array", items: { type: "string", maxLength: 40 } },
            url: { type: "string", description: "Raw absolute HTTP/HTTPS URL or empty string \"\". DO NOT use markdown links." },
            startDate: { type: "string" },
            endDate: { type: "string" },
            description: { type: "string", maxLength: 2000 },
          },
        },
      },
      certifications: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "name", "issuer", "issueDate"],
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", minLength: 1, maxLength: 120 },
            issuer: { type: "string", minLength: 1, maxLength: 100 },
            issueDate: { type: "string", pattern: "^\\d{4}-\\d{2}$" },
            expiryDate: { type: "string" },
            credentialUrl: { type: "string", description: "Raw absolute HTTP/HTTPS URL or empty string \"\"." },
          },
        },
      },
      organizations: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "organization", "position", "startDate", "current"],
          properties: {
            id: { type: "string", format: "uuid" },
            organization: { type: "string", minLength: 1, maxLength: 120 },
            position: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              description: "Job title / role in organization. Field MUST be named 'position', NOT 'role'.",
            },
            startDate: { type: "string", pattern: "^\\d{4}-\\d{2}$" },
            endDate: { type: "string" },
            current: { type: "boolean" },
            description: { type: "string", maxLength: 1500 },
          },
        },
      },
      optionalSections: {
        type: "object",
        properties: {
          languages: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "language", "proficiency"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    language: { type: "string", minLength: 1, maxLength: 60 },
                    proficiency: { type: "string", minLength: 1, maxLength: 50 },
                  },
                },
              },
            },
          },
          awards: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "title", "issuer", "date"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    title: { type: "string", minLength: 1, maxLength: 120 },
                    issuer: { type: "string", minLength: 1, maxLength: 100 },
                    date: { type: "string", minLength: 1, maxLength: 20 },
                    description: { type: "string", maxLength: 1000 },
                  },
                },
              },
            },
          },
          courses: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "title", "provider"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    title: {
                      type: "string",
                      minLength: 1,
                      maxLength: 120,
                      description: "Course name/title. Field MUST be named 'title', NOT 'name'.",
                    },
                    provider: { type: "string", minLength: 1, maxLength: 100 },
                    date: { type: "string" },
                    duration: { type: "string", maxLength: 50 },
                    description: { type: "string", maxLength: 1000 },
                    url: { type: "string", description: "Raw absolute HTTP/HTTPS URL or empty string \"\"." },
                  },
                },
              },
            },
          },
          licenses: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "title", "issuer", "issueDate"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    title: {
                      type: "string",
                      minLength: 1,
                      maxLength: 120,
                      description: "License title. Field MUST be named 'title', NOT 'name'.",
                    },
                    issuer: { type: "string", minLength: 1, maxLength: 100 },
                    licenseNumber: { type: "string", maxLength: 60 },
                    issueDate: { type: "string", minLength: 1, maxLength: 20 },
                    expiryDate: { type: "string" },
                    url: { type: "string", description: "Raw absolute HTTP/HTTPS URL or empty string \"\"." },
                  },
                },
              },
            },
          },
          volunteer: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "organization", "role", "startDate", "current"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    organization: { type: "string", minLength: 1, maxLength: 120 },
                    role: {
                      type: "string",
                      minLength: 1,
                      maxLength: 100,
                      description: "Volunteer role/position. Field is named 'role'.",
                    },
                    startDate: { type: "string", minLength: 1 },
                    endDate: { type: "string" },
                    current: { type: "boolean" },
                    description: { type: "string", maxLength: 1500 },
                  },
                },
              },
            },
          },
          publications: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "title", "publisher", "date"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    title: { type: "string", minLength: 1, maxLength: 200 },
                    type: { type: "string", maxLength: 60 },
                    publisher: { type: "string", minLength: 1, maxLength: 120 },
                    date: { type: "string", minLength: 1, maxLength: 20 },
                    url: { type: "string", description: "Raw absolute HTTP/HTTPS URL or empty string \"\"." },
                    description: { type: "string", maxLength: 1000 },
                  },
                },
              },
            },
          },
          portfolio: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "label", "url"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    label: { type: "string", minLength: 1, maxLength: 60 },
                    url: { type: "string", description: "Raw absolute HTTP/HTTPS URL (required)." },
                  },
                },
              },
            },
          },
          references: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              onDemand: { type: "boolean" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  required: ["id", "name", "position", "company"],
                  properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string", minLength: 1, maxLength: 100 },
                    position: { type: "string", minLength: 1, maxLength: 100 },
                    company: { type: "string", minLength: 1, maxLength: 100 },
                    email: { type: "string", description: "Raw plain email address or empty string \"\"." },
                    phone: { type: "string", maxLength: 30 },
                    relationship: { type: "string", maxLength: 80 },
                  },
                },
              },
            },
          },
          interests: {
            type: "object",
            properties: {
              enabled: { type: "boolean" },
              items: { type: "array", items: { type: "string", minLength: 1, maxLength: 50 } },
            },
          },
        },
      },
    },
  },
  null,
  2
);

/**
 * Example valid CVData JSON output conforming 100% to active CVDataSchema Version 1.
 */
export const CV_DATA_EXAMPLE_JSON_STR = JSON.stringify(
  {
    version: 1,
    metadata: {
      id: "e1a90f23-5c82-4115-a7b2-601e3b320001",
      createdAt: "2026-09-01T08:00:00.000Z",
      updatedAt: "2026-09-06T12:00:00.000Z",
      templateId: "modern",
      accentColor: "#2563eb",
      typography: "inter",
    },
    personalInfo: {
      fullName: "Jane Doe",
      headline: "Product Marketing Manager",
      email: "jane.doe@example.com",
      phone: "+62 812-3456-7890",
      location: "Jakarta, Indonesia",
      linkedin: "https://linkedin.com/in/janedoe",
      github: "",
      website: "https://janedoe.com",
      photoUrl: "",
    },
    summary: {
      summary:
        "Product Marketing Manager dengan pengalaman 4+ tahun dalam memimpin peluncuran produk B2B SaaS dan strategi pertumbuhan pengguna.",
    },
    experience: [
      {
        id: "a1111111-1111-4111-8111-111111111111",
        company: "PT Global Inovasi",
        position: "Product Marketing Specialist",
        location: "Jakarta, Indonesia",
        startDate: "2022-03",
        endDate: "",
        current: true,
        description:
          "- Memimpin kampanye go-to-market untuk 3 fitur utama aplikasi.\n- Meningkatkan active user mingguan sebesar 25% melalui targeted email onboarding.",
      },
    ],
    education: [
      {
        id: "b1111111-1111-4111-8111-111111111111",
        institution: "Universitas Indonesia",
        degree: "Sarjana Manajemen (S.M.)",
        field: "Manajemen Pemasaran",
        location: "Depok, Indonesia",
        startDate: "2017-08",
        endDate: "2021-07",
        current: false,
        gpa: "3.75 / 4.00",
        description: "Fokus pada Riset Pasar dan Komunikasi Pemasaran Digital.",
      },
    ],
    skills: [
      { id: "c1111111-1111-4111-8111-111111111111", name: "Product Positioning", category: "Keahlian Utama" },
      { id: "c2222222-2222-4222-8222-222222222222", name: "User Research", category: "Keahlian Utama" },
      { id: "c3333333-3333-4333-8333-333333333333", name: "Google Analytics", category: "Tools" },
    ],
    projects: [],
    certifications: [
      {
        id: "e1111111-1111-4111-8111-111111111111",
        name: "Google Digital Marketing & E-commerce Professional",
        issuer: "Coursera / Google",
        issueDate: "2022-01",
        expiryDate: "",
        credentialUrl: "",
      },
    ],
    organizations: [
      {
        id: "f1111111-1111-4111-8111-111111111111",
        organization: "Ikatan Alumni UI",
        position: "Koordinator Hubungan Industri",
        startDate: "2021-08",
        endDate: "2023-08",
        current: false,
        description: "Mengkoordinasikan program mentorship karir bagi 100+ fresh graduate.",
      },
    ],
    optionalSections: {
      languages: {
        enabled: true,
        items: [
          { id: "11111111-1111-4111-8111-111111111111", language: "Bahasa Indonesia", proficiency: "Native" },
          { id: "22222222-2222-4222-8222-222222222222", language: "English", proficiency: "Professional Working" },
        ],
      },
      awards: { enabled: false, items: [] },
      courses: { enabled: false, items: [] },
      licenses: { enabled: false, items: [] },
      volunteer: { enabled: false, items: [] },
      publications: { enabled: false, items: [] },
      portfolio: { enabled: false, items: [] },
      references: { enabled: false, onDemand: false, items: [] },
      interests: { enabled: false, items: [] },
    },
  },
  null,
  2
);

/**
 * Builds a prompt for External AI.
 */
export function buildAIPrompt(
  payload: GeneratedAIPromptPayload,
  presetGuidelines?: { focus: string; tips: string[] }
): string {
  const isEn = payload.language === "en";
  const visualTemplateId = payload.visualTemplateId ?? "modern";
  const visualTemplateName =
    visualTemplateId === "minimal"
      ? "Minimal"
      : visualTemplateId === "classic"
        ? "Classic"
        : "Modern";

  const modeInstruction =
    payload.mode === "from_scratch"
      ? isEn
        ? "MODE: CREATE CV FROM SCRATCH\nYour task is to take the user's raw notes, background, education, and experiences, structure them professionally, improve wording/grammar/bullet points, and output the complete CV in valid CV Builder JSON format."
        : "MODE: BUAT CV DARI AWAL (FROM SCRATCH)\nTugas Anda adalah mengambil catatan mentah, latar belakang, pendidikan, dan pengalaman pengguna, menyusunnya secara profesional, memperbaiki tata bahasa/bullet points, dan menghasilkan CV lengkap dalam format CV Builder JSON yang valid."
      : isEn
        ? "MODE: IMPROVE EXISTING CV\nYour task is to analyze the user's existing CV text, polish bullet points with high-impact action verbs, enhance clarity and professional tone, reduce redundancy, and convert the entire CV into the exact CV Builder JSON format."
        : "MODE: PERBAIKI CV LAMA (IMPROVE EXISTING CV)\nTugas Anda adalah menganalisis CV lama pengguna, memoles bullet points dengan kata kerja aksi yang kuat, meningkatkan kejelasan dan nada profesional, mengurangi redundansi, dan mengonversi seluruh CV ke dalam format CV Builder JSON.";

  const targetContext = [
    payload.targetPosition
      ? isEn
        ? `Target Position: ${payload.targetPosition}`
        : `Posisi Target: ${payload.targetPosition}`
      : null,
    payload.targetIndustry
      ? isEn
        ? `Target Industry: ${payload.targetIndustry}`
        : `Industri Target: ${payload.targetIndustry}`
      : null,
    payload.jobDescription
      ? isEn
        ? `Target Job Description (Context for relevance and terminology):\n"""\n${payload.jobDescription.trim()}\n"""`
        : `Deskripsi Pekerjaan / Lowongan (Konteks relevansi dan istilah industri):\n"""\n${payload.jobDescription.trim()}\n"""`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const userContent = payload.userInputData?.trim()
    ? payload.userInputData.trim()
    : isEn
      ? "[PASTE YOUR RAW EXPERIENCE / NOTES / EXISTING CV HERE]"
      : "[TEMPELKAN CATATAN PENGALAMAN / CV LAMA ANDA DI SINI]";

  const focusTips = presetGuidelines?.tips?.length
    ? isEn
      ? `SPECIFIC FOCUS & GUIDELINES:\n${presetGuidelines.tips.map((t) => `- ${t}`).join("\n")}`
      : `PANDUAN & FOKUS SPESIFIK:\n${presetGuidelines.tips.map((t) => `- ${t}`).join("\n")}`
    : "";

  const languageAndTemplateRules = isEn
    ? `OUTPUT LANGUAGE & VISUAL TEMPLATE CONTRACT:
- The requested output language is ENGLISH (en), using polished, professional business English suitable for an ATS resume and international recruiters.
- Detect the language of every source/reference field. Translate all narrative CV content into fluent, idiomatic professional English, even when the source is Indonesian or another language. Do not translate word-for-word when that would sound unnatural.
- Keep the entire narrative output consistently in professional English. Do not mix Indonesian and English, use casual wording, or leave source-language sentences untranslated. Keep proper names, company names, school names, product names, certifications, technologies, URLs, email addresses, and legal names unchanged unless translation is clearly part of the official name.
- The selected visual template is ${visualTemplateName} (${visualTemplateId}). Set metadata.templateId to exactly "${visualTemplateId}". Do not substitute another template.
- The visual template controls presentation only; keep the same CVData schema and factual content.`
    : `KONTRAK BAHASA OUTPUT & TEMPLATE VISUAL:
- Bahasa keluaran yang diminta adalah BAHASA INDONESIA (id), menggunakan Bahasa Indonesia baku, profesional, dan natural untuk CV serta perekrut di Indonesia.
- Deteksi bahasa setiap kolom referensi/sumber. Terjemahkan seluruh isi naratif CV menjadi Bahasa Indonesia yang lancar dan profesional, meskipun sumbernya berbahasa Inggris atau bahasa lain. Jangan menerjemahkan kata demi kata jika hasilnya terdengar kaku atau tidak natural.
- Pastikan seluruh narasi konsisten dalam Bahasa Indonesia profesional. Jangan mencampur Bahasa Indonesia dan Inggris, menggunakan bahasa percakapan, atau menyisakan kalimat dari bahasa sumber tanpa alasan. Pertahankan nama orang, nama perusahaan, institusi, produk, sertifikasi, teknologi, URL, alamat email, dan nama legal apa adanya kecuali terjemahan memang bagian dari nama resminya.
- Template visual yang dipilih adalah ${visualTemplateName} (${visualTemplateId}). Isi metadata.templateId tepat dengan "${visualTemplateId}". Jangan mengganti ke template lain.
- Template visual hanya mengatur tampilan; gunakan schema CVData dan fakta yang sama.`;

  return `You are an expert ATS Resume & CV Strategist.

${modeInstruction}

${languageAndTemplateRules}

CRITICAL RULES & SCHEMA CONFORMITY:
1. THE OUTPUT MUST CONFORM EXACTLY TO THE CV BUILDER CVDATA SCHEMA (VERSION 1).
   - Return the root CVData object directly.
   - Do NOT wrap in wrappers like {"aiResult": ...}, {"cv": ...}, {"data": ...}, etc.
   - Use exact field names from the schema. Do not rename fields or invent alternative names.
   - Do not omit required fields. Do not change field types.

2. CRITICAL CONTACT INFORMATION & RAW FORMAT RULES:
   - EMAIL FORMAT:
     * If an email is provided, return ONLY the raw email address string (e.g., "candidate@example.com").
     * DO NOT wrap in Markdown links (e.g. NOT "[candidate@example.com](mailto:candidate@example.com)").
     * DO NOT prefix with "mailto:" or "Email:".
     * DO NOT wrap in angle brackets (NOT "<email@example.com>").
     * If email is not available, use empty string "". Never invent email addresses.
   - URL FORMAT:
     * If a URL is provided (for linkedin, github, website, project url, portfolio url, credential url, course url, license url, publication url), return ONLY the raw absolute URL (e.g., "https://ariyoaziz.github.io/").
     * Must start with "http://" or "https://".
     * DO NOT wrap in Markdown links (e.g. NOT "[https://...](https://...)").
     * DO NOT prefix with labels (e.g. NOT "Website: https://...").
     * If URL is not available, use empty string "".
   - PHONE NUMBER:
     * Preserve raw phone format as provided (e.g. "+62 800 0000 0000"). If not provided, use "". Never invent phone numbers.
   - EMPTY CONTACT FIELDS:
     * Missing optional contact fields (email, phone, location, linkedin, github, website, photoUrl) MUST be set to empty string "" (NOT null, NOT omitted).

3. SPECIFIC FIELD NAME REQUIREMENTS:
   - "organizations": Items MUST use "position" for the job title / role in the organization. (DO NOT use "role", "title", or "jobTitle").
   - "courses": Items MUST use "title" for the course name, and "url" for the link. (DO NOT use "name" or "certificateUrl").
   - "licenses": Items MUST use "title" for the license name. (DO NOT use "name").
   - "volunteer": Items use "role" for the volunteer role.
   - "certifications": Required fields are "id", "name", "issuer", "issueDate".

4. STRICT DATETIME & DATE FORMATS:
   - "metadata.createdAt" and "metadata.updatedAt" MUST be strict ISO 8601 UTC datetime strings with trailing 'Z' (e.g., "2026-09-06T12:30:00.000Z").
   - All standard resume date fields ("startDate", "endDate", "issueDate") MUST be formatted as "YYYY-MM" (e.g., "2023-08"). If currently ongoing, set current: true and endDate: "".

5. STRICT UNIQUE UUID v4 IDENTIFIERS:
   - Every required "id" field MUST contain a valid unique UUID v4 (36 lowercase hexadecimal characters with version 4 variant, e.g. "a1111111-1111-4111-8111-111111111111").
   - Every "id" in the entire JSON must be globally unique. Do NOT use placeholder numbers or empty strings for IDs.

6. FACTUAL ACCURACY & NO FABRICATIONS:
   - USER INFORMATION IS THE SINGLE SOURCE OF TRUTH.
   - Never invent employers, positions, dates, schools, degrees, GPA, certifications, awards, metrics, skills, projects, organizations, or contact information that the user did not provide.
   - If a piece of information is missing, use the schema's valid empty value ("" or empty array []).

7. OUTPUT FORMAT (MANDATORY):
   - Return ONLY raw JSON.
   - Do NOT include Markdown formatting (do not wrap in \`\`\`json code blocks).
   - Do NOT include conversational text, introductory greetings, explanations, or conclusions before or after the JSON.

8. PRE-RETURN SELF-VERIFICATION CHECKLIST:
   Before returning the JSON, internally verify:
   ✓ 1. Root object is directly CVData with "version": 1.
   ✓ 2. All required fields exist with exact field names (organizations use "position", courses use "title", licenses use "title").
   ✓ 3. All email fields contain raw valid email addresses only (no markdown links, no mailto:).
   ✓ 4. All URL fields contain raw absolute HTTP/HTTPS URLs (no markdown links, no labels).
   ✓ 5. All metadata datetimes (createdAt, updatedAt) are valid ISO 8601 UTC strings ending with 'Z'.
   ✓ 6. All date fields are "YYYY-MM".
   ✓ 7. All IDs are valid, unique UUID v4 strings.
   ✓ 8. No fabricated facts or metrics were invented.
   ✓ 9. Output contains only valid, raw JSON.

${focusTips}

${targetContext ? `TARGET CONTEXT:\n${targetContext}\n` : ""}
USER INPUT DATA / SOURCE MATERIAL:
"""
${userContent}
"""

TARGET JSON SCHEMA (VERSION 1):
${CV_DATA_JSON_SCHEMA_STR}

EXAMPLE OUTPUT FORMAT (CONFORMS 100% TO SCHEMA):
${CV_DATA_EXAMPLE_JSON_STR}
`;
}

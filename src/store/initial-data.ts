import { CVData } from "@/types/cv.types";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

/**
 * Curated professional sample data for initial application state and preview.
 * Fully conforms to CVDataSchema version 1.
 */
export const initialCVData: CVData = {
  version: 1,
  metadata: {
    id: "e1a90f23-5c82-4115-a7b2-601e3b320001",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-06T12:00:00.000Z",
    templateId: "modern",
    accentColor: "#2563eb",
    typography: "inter",
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionLabels: {},
  },
  personalInfo: {
    fullName: "Budi Santoso",
    headline: "Senior Frontend Engineer",
    email: "budi.santoso@example.com",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    linkedin: "https://linkedin.com/in/budisantoso",
    github: "https://github.com/budisantoso",
    website: "https://budisantoso.dev",
    showFullLinks: false,
    photoUrl: "",
  },
  summary: {
    summary:
      "Software Engineer dengan pengalaman 5+ tahun dalam merancang dan mengembangkan aplikasi web berskala besar menggunakan React, Next.js, dan TypeScript. Terbiasa memimpin tim frontend kecil, mengoptimalkan web vitals, dan menerapkan praktik arsitektur yang modular dan testable.",
  },
  experience: [
    {
      id: "a1111111-1111-4111-8111-111111111111",
      company: "PT Teknologi Nusantara",
      position: "Lead Frontend Engineer",
      location: "Jakarta, Indonesia",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description:
        "- Memimpin migrasi arsitektur monolitik ke Next.js App Router, meningkatkan First Contentful Paint sebesar 40%.\n- Merancang design system terpadu menggunakan Tailwind CSS dan Radix UI yang digunakan oleh 4 tim produk.\n- Membimbing 5 junior engineer dalam code review harian dan penerapan automated testing.",
    },
    {
      id: "a2222222-2222-4222-8222-222222222222",
      company: "Digital Solusi Asia",
      position: "Frontend Software Engineer",
      location: "Bandung, Indonesia",
      startDate: "2020-08",
      endDate: "2022-12",
      current: false,
      description:
        "- Membangun antarmuka dashboard analitik realtime berbasis WebSocket dan TypeScript.\n- Mengurangi bundle size JavaScript sebesar 35% melalui code splitting dan dynamic imports.\n- Berkolaborasi erat dengan tim UI/UX untuk memastikan kepatuhan aksesibilitas WCAG 2.1 AA.",
    },
  ],
  education: [
    {
      id: "b1111111-1111-4111-8111-111111111111",
      institution: "Institut Teknologi Bandung",
      degree: "Sarjana Komputer (S.Kom)",
      field: "Teknik Informatika",
      location: "Bandung, Indonesia",
      startDate: "2016-08",
      endDate: "2020-07",
      current: false,
      gpa: "3.82 / 4.00 (Cum Laude)",
      description: "Fokus pada Rekayasa Perangkat Lunak dan Sistem Terdistribusi. Penerima beasiswa prestasi akademik.",
    },
  ],
  skills: [
    { id: "c1111111-1111-4111-8111-111111111111", name: "TypeScript", category: "Keahlian Utama" },
    { id: "c2222222-2222-4222-8222-222222222222", name: "JavaScript (ES6+)", category: "Keahlian Utama" },
    { id: "c3333333-3333-4333-8333-333333333333", name: "HTML5 & CSS3", category: "Keahlian Utama" },
    { id: "c4444444-4444-4444-8444-444444444444", name: "React", category: "Keahlian Utama" },
    { id: "c5555555-5555-4555-8555-555555555555", name: "Next.js", category: "Keahlian Utama" },
    { id: "c6666666-6666-4666-8666-666666666666", name: "Tailwind CSS", category: "Keahlian Utama" },
    { id: "c7777777-7777-4777-8777-777777777777", name: "Zustand & Redux", category: "Keahlian Utama" },
    { id: "c8888888-8888-4888-8888-888888888888", name: "Git & GitHub", category: "Tools" },
    { id: "c9999999-9999-4999-8999-999999999999", name: "Docker & CI/CD", category: "Tools" },
  ],
  projects: [
    {
      id: "d1111111-1111-4111-8111-111111111111",
      name: "Open Source E-Commerce Kit",
      role: "Creator & Lead Developer",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
      url: "https://github.com/budisantoso/ecommerce-kit",
      startDate: "2023-04",
      endDate: "2023-11",
      description:
        "- Mengembangkan template e-commerce modular dengan performa 99/100 di Google Lighthouse.\n- Mendapatkan 500+ stars di GitHub dan digunakan oleh berbagai UMKM digital.",
    },
  ],
  certifications: [
    {
      id: "e1111111-1111-4111-8111-111111111111",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-06",
      expiryDate: "2026-06",
      credentialUrl: "https://aws.amazon.com/verification",
    },
  ],
  organizations: [
    {
      id: "f1111111-1111-4111-8111-111111111111",
      organization: "Google Developer Student Clubs ITB",
      position: "Lead Organizer",
      startDate: "2019-08",
      endDate: "2020-07",
      current: false,
      description:
        "- Mengorganisir 12 workshop teknis seputar web development dan cloud computing untuk 300+ mahasiswa.",
    },
  ],
  optionalSections: {
    languages: {
      enabled: true,
      items: [
        { id: "11111111-1111-4111-8111-111111111111", language: "Bahasa Indonesia", proficiency: "Native" },
        { id: "22222222-2222-4222-8222-222222222222", language: "English", proficiency: "Profesional" },
      ],
    },
    awards: {
      enabled: false,
      items: [
        {
          id: "33333333-3333-4333-8333-333333333333",
          title: "Juara 1 Hackathon Nasional",
          issuer: "Kementerian Kominfo",
          date: "2023-10",
          description: "Membangun solusi pemantauan logistik real-time berbasis Next.js.",
        },
      ],
    },
    courses: { enabled: false, items: [] },
    licenses: { enabled: false, items: [] },
    volunteer: { enabled: false, items: [] },
    publications: { enabled: false, items: [] },
    portfolio: { enabled: false, items: [] },
    references: { enabled: false, onDemand: true, items: [] },
    interests: {
      enabled: true,
      items: ["Open Source", "Design System", "Cloud Computing", "Web Performance"],
    },
  },
};

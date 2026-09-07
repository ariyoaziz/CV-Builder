"use client";

import React from "react";
import type { CVTemplateProps } from "@/features/preview/template-registry";
import { formatDateRange, formatMonthYear } from "@/utils/date.utils";
import { getTranslations, useTranslation } from "@/i18n";
import { formatDisplayUrl } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

/**
 * Minimal Template
 * - Editorial, high-density layout (Outfit / Inter)
 * - Subtle horizontal rules below headings
 * - Categorized skills displayed as readable inline text (comma-separated, NO pill badges)
 * - Compact spacing maximizing content density
 * - Full support for all 9 optional sections
 */
export function MinimalTemplate({ data, accentColor, language }: CVTemplateProps) {
  const { language: activeLanguage } = useTranslation();
  const lang = language ?? activeLanguage ?? "id";
  const baseTranslations = getTranslations(lang);
  const t = {
    ...baseTranslations,
    sections: { ...baseTranslations.sections, ...(data.metadata.sectionLabels ?? {}) },
  };
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    organizations,
    optionalSections,
  } = data;

  const hasSummary = Boolean(summary.summary?.trim());
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasSkills = skills.length > 0;
  const hasProjects = projects.length > 0;
  const hasCertifications = certifications.length > 0;
  const hasOrganizations = organizations.length > 0;

  // Optional sections flags — all access guarded against undefined items (stale localStorage)
  const opt = optionalSections || {};
  const hasLanguages = Boolean(opt.languages?.enabled && (opt.languages?.items?.length ?? 0) > 0);
  const hasAwards = Boolean(opt.awards?.enabled && (opt.awards?.items?.length ?? 0) > 0);
  const hasCourses = Boolean(opt.courses?.enabled && (opt.courses?.items?.length ?? 0) > 0);
  const hasLicenses = Boolean(opt.licenses?.enabled && (opt.licenses?.items?.length ?? 0) > 0);
  const hasVolunteer = Boolean(opt.volunteer?.enabled && (opt.volunteer?.items?.length ?? 0) > 0);
  const hasPublications = Boolean(opt.publications?.enabled && (opt.publications?.items?.length ?? 0) > 0);
  const hasPortfolio = Boolean(opt.portfolio?.enabled && (opt.portfolio?.items?.length ?? 0) > 0);
  const hasReferences = Boolean(
    opt.references?.enabled && (opt.references?.onDemand || (opt.references?.items?.length ?? 0) > 0)
  );
  const hasInterests = Boolean(opt.interests?.enabled && (opt.interests?.items?.length ?? 0) > 0);

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category?.trim() || t.editor.skills.mainSkillsDefaultCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});
  // Render each line of a multi-line description as an individual bullet <li>
  // Break-inside-avoid on each line prevents mid-line cuts during print.
  const DescLines = ({ text }: { text: string }) => {
    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-\u2022\u00b7]\s*/, "").trim())
      .filter(Boolean);
    if (lines.length === 0) return null;
    return (
      <ul className="pt-0.5">
        {lines.map((line, i) => (
          <li key={i} className="break-inside-avoid flex gap-1.5 text-xs text-slate-600 leading-relaxed">
            <span className="shrink-0 mt-0.75 text-slate-400 select-none" aria-hidden="true">&bull;</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <article
      className="cv-template cv-minimal text-slate-800 text-[12.5px] leading-normal select-text"
      style={{
        fontFamily: "var(--font-outfit), var(--font-inter), system-ui, sans-serif",
      }}
    >
      {/* Header / Masthead */}
      <header className="cv-header flex justify-between items-start gap-4 pb-3 mb-4 border-b border-slate-300">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {personalInfo.fullName || (lang === "en" ? "Full Name" : "Nama Lengkap")}
          </h1>
          {personalInfo.headline && (
            <p className="text-xs font-semibold tracking-wide text-slate-600 uppercase mt-0.5">
              {personalInfo.headline}
            </p>
          )}

          {/* Contact Line */}
          <address className="not-italic flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:underline text-slate-800"
              >
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <a
                href={
                  personalInfo.linkedin.startsWith("http")
                    ? personalInfo.linkedin
                    : `https://${personalInfo.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-slate-800"
              >
                {formatDisplayUrl(
                  personalInfo.linkedin,
                  "LinkedIn",
                  personalInfo.showFullLinks
                )}
              </a>
            )}
            {personalInfo.github && (
              <a
                href={
                  personalInfo.github.startsWith("http")
                    ? personalInfo.github
                    : `https://${personalInfo.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-slate-800"
              >
                {formatDisplayUrl(
                  personalInfo.github,
                  "GitHub",
                  personalInfo.showFullLinks
                )}
              </a>
            )}
            {personalInfo.website && (
              <a
                href={
                  personalInfo.website.startsWith("http")
                    ? personalInfo.website
                    : `https://${personalInfo.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-slate-800"
              >
                {formatDisplayUrl(
                  personalInfo.website,
                  lang === "en" ? "Portfolio" : "Portofolio",
                  personalInfo.showFullLinks
                )}
              </a>
            )}
          </address>
        </div>

        {/* Compact Photo */}
        {personalInfo.photoUrl && (
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personalInfo.photoUrl}
              alt=""
              aria-hidden="true"
              className="cv-profile-photo w-16 h-16 rounded-xs object-cover border border-slate-200"
            />
          </div>
        )}
      </header>

      <div
        className="space-y-4"
        role="region"
        aria-label={lang === "en" ? "CV content" : "Konten CV"}
      >
        {(() => {
          const sectionOrder = data.metadata?.sectionOrder ?? DEFAULT_SECTION_ORDER;
          const fullOrderedKeys = Array.from(new Set([...sectionOrder, ...DEFAULT_SECTION_ORDER]));

          const sectionJSXMap: Record<string, React.ReactNode> = {
            summary: hasSummary ? (
              <section aria-labelledby="min-summary" className="cv-section">
                <h2
                  id="min-summary"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-1.5 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.summary}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {summary.summary}
                </p>
              </section>
            ) : null,

            experience: hasExperience ? (
              <section aria-labelledby="min-experience" className="cv-section">
                <h2
                  id="min-experience"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.experience}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2.5">
                  {experience.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-950 text-[13px]">
                            {item.position}
                          </span>
                          <span className="text-slate-500 font-medium">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs text-slate-600">
                          <span className="font-semibold" style={{ color: accentColor }}>
                            {item.company}
                          </span>
                          {item.location && <span className="text-slate-500">{item.location}</span>}
                        </div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            education: hasEducation ? (
              <section aria-labelledby="min-education" className="cv-section">
                <h2
                  id="min-education"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.education}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2">
                  {education.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-950 text-[13px]">
                            {item.institution}
                          </span>
                          <span className="text-slate-500 font-medium">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-slate-700">
                          <span>
                            {item.degree}
                            {item.field ? ` in ${item.field}` : ""}
                          </span>
                          {item.location && <span className="text-slate-500">{item.location}</span>}
                        </div>
                        {item.gpa && (
                          <p className="text-slate-600">
                            {lang === "en" ? "GPA:" : "IPK:"} <span className="font-semibold text-slate-800">{item.gpa}</span>
                          </p>
                        )}
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            skills: hasSkills ? (
              <section aria-labelledby="min-skills" className="cv-section">
                <h2
                  id="min-skills"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.skills}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-1 text-xs">
                  {Object.entries(skillsByCategory).map(([cat, skillNames]) => {
                    if (skillNames.length === 0) return null;
                    return (
                      <div key={cat} className="cv-entry-item break-inside-avoid flex items-baseline gap-1.5 leading-relaxed">
                        <span className="font-bold text-slate-900 shrink-0">{cat}:</span>
                        <span className="text-slate-700">{skillNames.join(", ")}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null,

            projects: hasProjects ? (
              <section aria-labelledby="min-projects" className="cv-section">
                <h2
                  id="min-projects"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.projects}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2">
                  {projects.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-slate-950 text-[13px]">{item.name}</span>
                            {item.role && <span className="text-slate-500 font-medium">({item.role})</span>}
                          </div>
                          {item.startDate && (
                            <span className="text-slate-500">
                              {formatDateRange(item.startDate, item.endDate || "", false, lang)}
                            </span>
                          )}
                        </div>
                        {item.url && (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium block"
                            style={{ color: accentColor }}
                          >
                            {item.url}
                          </a>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <p className="text-slate-600">
                            <span className="font-medium text-slate-700">{lang === "en" ? "Technologies: " : "Teknologi: "}</span>
                            {item.technologies.join(", ")}
                          </p>
                        )}
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            certifications: hasCertifications ? (
              <section aria-labelledby="min-certifications" className="cv-section">
                <h2
                  id="min-certifications"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.certifications}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-1.5 text-xs">
                  {certifications.map((item) => (
                    <div key={item.id} className="cv-entry-item break-inside-avoid flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold text-slate-900">{item.name}</span>
                        <span className="text-slate-500"> — {item.issuer}</span>
                        {item.credentialUrl && (
                          <a
                            href={
                              item.credentialUrl.startsWith("http")
                                ? item.credentialUrl
                                : `https://${item.credentialUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 hover:underline text-[11px]"
                            style={{ color: accentColor }}
                          >
                            {lang === "en" ? "Credential" : "Kredensial"}
                          </a>
                        )}
                      </div>
                      <span className="text-slate-500 shrink-0">
                        {formatMonthYear(item.issueDate, lang)}
                        {item.expiryDate ? ` – ${formatMonthYear(item.expiryDate, lang)}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            organizations: hasOrganizations ? (
              <section aria-labelledby="min-organizations" className="cv-section">
                <h2
                  id="min-organizations"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.organizations}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2 text-xs">
                  {organizations.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-950 text-[13px]">{item.position}</span>
                          <span className="text-slate-500">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="font-medium text-slate-700">{item.organization}</div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            languages: hasLanguages ? (
              <section aria-labelledby="min-languages">
                <h2
                  id="min-languages"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.languages}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  {opt.languages?.items.map((item) => (
                    <div key={item.id} className="break-inside-avoid flex items-baseline gap-1">
                      <span className="font-semibold text-slate-900">{item.language}</span>
                      <span className="text-slate-500">({item.proficiency})</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            awards: hasAwards ? (
              <section aria-labelledby="min-awards">
                <h2
                  id="min-awards"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.awards}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2 text-xs">
                  {opt.awards?.items.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-950 text-[13px]">{item.title}</span>
                          <span className="text-slate-500">{item.date}</span>
                        </div>
                        <div className="font-medium text-slate-700">{item.issuer}</div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            courses: hasCourses ? (
              <section aria-labelledby="min-courses">
                <h2
                  id="min-courses"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.courses}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2 text-xs">
                  {opt.courses?.items.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-bold text-slate-950 text-[13px]">{item.title}</span>
                            {item.duration && (
                              <span className="text-slate-500 text-[11px] ml-1">({item.duration})</span>
                            )}
                          </div>
                          {item.date && <span className="text-slate-500">{item.date}</span>}
                        </div>
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <span>{item.provider}</span>
                          {item.url && (
                            <a
                              href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-[11px]"
                              style={{ color: accentColor }}
                            >
                              [{lang === "en" ? "Link" : "Tautan"}]
                            </a>
                          )}
                        </div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            licenses: hasLicenses ? (
              <section aria-labelledby="min-licenses">
                <h2
                  id="min-licenses"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.licenses}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-1.5 text-xs">
                  {opt.licenses?.items.map((item) => (
                    <div key={item.id} className="break-inside-avoid flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span className="text-slate-500"> — {item.issuer}</span>
                        {item.licenseNumber && (
                          <span className="text-slate-600 text-[11px] ml-1 font-mono">
                            (No: {item.licenseNumber})
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 hover:underline text-[11px]"
                            style={{ color: accentColor }}
                          >
                            {lang === "en" ? "Credential" : "Kredensial"}
                          </a>
                        )}
                      </div>
                      <span className="text-slate-500 shrink-0">
                        {item.issueDate}
                        {item.expiryDate ? ` – ${item.expiryDate}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            volunteer: hasVolunteer ? (
              <section aria-labelledby="min-volunteer">
                <h2
                  id="min-volunteer"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.volunteer}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2 text-xs">
                  {opt.volunteer?.items.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-slate-950 text-[13px]">{item.role}</span>
                          <span className="text-slate-500">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="font-medium text-slate-700">{item.organization}</div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            publications: hasPublications ? (
              <section aria-labelledby="min-publications">
                <h2
                  id="min-publications"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.publications}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="space-y-2 text-xs">
                  {opt.publications?.items.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-bold text-slate-950 text-[13px]">{item.title}</span>
                            {item.type && (
                              <span className="text-slate-500 text-[11px] ml-1">({item.type})</span>
                            )}
                          </div>
                          <span className="text-slate-500">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <span>{item.publisher}</span>
                          {item.url && (
                            <a
                              href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-[11px]"
                              style={{ color: accentColor }}
                            >
                              [{lang === "en" ? "View Publication" : "Lihat Publikasi"}]
                            </a>
                          )}
                        </div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            portfolio: hasPortfolio ? (
              <section aria-labelledby="min-portfolio">
                <h2
                  id="min-portfolio"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.portfolio}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  {opt.portfolio?.items.map((item) => (
                    <div key={item.id} className="break-inside-avoid flex items-baseline gap-1">
                      <span className="font-bold text-slate-900">{item.label}:</span>
                      <a
                        href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: accentColor }}
                      >
                        {item.url}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            references: hasReferences ? (
              <section aria-labelledby="min-references">
                <h2
                  id="min-references"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.references}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                {opt.references?.onDemand ? (
                  <p className="text-slate-600 text-xs italic">
                    {t.preview.referencesOnDemand}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {opt.references?.items.map((item) => (
                      <div key={item.id} className="break-inside-avoid space-y-0.5 pb-1">
                        <span className="font-bold text-slate-950 text-[13px]">{item.name}</span>
                        <div className="text-slate-700">
                          {item.position} — {item.company}
                        </div>
                        {item.relationship && (
                          <div className="text-slate-500 text-[11px]">{item.relationship}</div>
                        )}
                        {(item.email || item.phone) && (
                          <div className="text-slate-600 text-[11px] space-x-2">
                            {item.email && (
                              <a href={`mailto:${item.email}`} className="hover:underline" style={{ color: accentColor }}>
                                {item.email}
                              </a>
                            )}
                            {item.email && item.phone && <span>•</span>}
                            {item.phone && <span>{item.phone}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : null,

            interests: hasInterests ? (
              <section aria-labelledby="min-interests">
                <h2
                  id="min-interests"
                  className="text-xs font-bold tracking-wider uppercase text-slate-900 pb-1 mb-2 border-b border-slate-200 flex items-center justify-between"
                >
                  <span>{t.sections.interests}</span>
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </h2>
                <p className="text-slate-700 text-xs leading-relaxed">
                  {opt.interests?.items.join(", ")}
                </p>
              </section>
            ) : null,
          };

          return fullOrderedKeys.map((key) => {
            const content = sectionJSXMap[key];
            if (!content) return null;
            return <React.Fragment key={key}>{content}</React.Fragment>;
          });
        })()}
      </div>
    </article>
  );
}

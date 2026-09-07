"use client";

import React from "react";
import type { CVTemplateProps } from "@/features/preview/template-registry";
import { formatDateRange, formatMonthYear } from "@/utils/date.utils";
import { getTranslations, useTranslation } from "@/i18n";
import { formatDisplayUrl } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

/**
 * Modern Template
 * - Sans-serif typography (Inter)
 * - Left-aligned masthead with optional photo
 * - Subtle vertical accent line on section headings
 * - Clean whitespace and item-level break-inside-avoid
 * - Full support for all 9 optional sections and bilingual i18n
 */
export function ModernTemplate({ data, accentColor, language }: CVTemplateProps) {
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

  // Optional sections flags — all access guarded against undefined items
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
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    const cat = s.category?.trim() || t.editor.skills.mainSkillsDefaultCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
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
          <li key={i} className="break-inside-avoid flex gap-[5px] text-xs text-slate-600 leading-relaxed">
            <span className="shrink-0 mt-[3px] text-slate-400 select-none" aria-hidden="true">&bull;</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <article
      className="cv-template cv-modern text-slate-800 text-[13px] leading-relaxed select-text"
      style={{
        fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Masthead / Header */}
      <header className="cv-header flex items-start justify-between gap-6 border-b border-slate-200 pb-5 mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 wrap-break-word">
            {personalInfo.fullName || (lang === "en" ? "Full Name" : "Nama Lengkap")}
          </h1>
          {personalInfo.headline && (
            <p
              className="text-sm font-medium mt-1 wrap-break-word"
              style={{ color: accentColor }}
            >
              {personalInfo.headline}
            </p>
          )}

          {/* Contact Details */}
          <address className="not-italic flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:underline flex items-center gap-1 text-slate-700"
              >
                <span>{personalInfo.email}</span>
              </a>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1 text-slate-700">
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="text-slate-700">{personalInfo.location}</span>
            )}
            {personalInfo.linkedin && (
              <a
                href={
                  personalInfo.linkedin.startsWith("http")
                    ? personalInfo.linkedin
                    : `https://${personalInfo.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-slate-700"
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
                className="hover:underline text-slate-700"
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
                className="hover:underline text-slate-700"
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

        {/* Profile Photo if present */}
        {personalInfo.photoUrl && (
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personalInfo.photoUrl}
              alt=""
              aria-hidden="true"
              className="cv-profile-photo w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}
      </header>

      <div
        className="space-y-5"
        role="region"
        aria-label={lang === "en" ? "CV content" : "Konten CV"}
      >
        {(() => {
          const sectionOrder = data.metadata?.sectionOrder ?? DEFAULT_SECTION_ORDER;
          const fullOrderedKeys = Array.from(new Set([...sectionOrder, ...DEFAULT_SECTION_ORDER]));

          const sectionJSXMap: Record<string, React.ReactNode> = {
            summary: hasSummary ? (
              <section aria-labelledby="section-summary" className="cv-section">
                <h2
                  id="section-summary"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.summary}
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {summary.summary}
                </p>
              </section>
            ) : null,

            experience: hasExperience ? (
              <section aria-labelledby="section-experience" className="cv-section">
                <h2
                  id="section-experience"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.experience}
                </h2>
                <div className="space-y-3">
                  {experience.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-semibold text-slate-950 text-sm">
                            {item.position}
                          </h3>
                          <span className="text-xs font-medium text-slate-500 shrink-0">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs text-slate-600">
                          <span className="font-medium text-slate-800">{item.company}</span>
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
              <section aria-labelledby="section-education" className="cv-section">
                <h2
                  id="section-education"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.education}
                </h2>
                <div className="space-y-3">
                  {education.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-semibold text-slate-950 text-sm">{item.institution}</h3>
                          <span className="text-xs font-medium text-slate-500 shrink-0">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xs text-slate-700">
                          <span>{item.degree}{item.field ? ` — ${item.field}` : ""}</span>
                          {item.location && <span className="text-slate-500">{item.location}</span>}
                        </div>
                        {item.gpa && (
                          <p className="text-xs text-slate-600">
                            {lang === "en" ? "GPA / Grade:" : "IPK / Nilai:"}{" "}
                            <span className="font-medium text-slate-800">{item.gpa}</span>
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
              <section aria-labelledby="section-skills" className="cv-section">
                <h2
                  id="section-skills"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.skills}
                </h2>
                <div className="space-y-2">
                  {Object.entries(skillsByCategory).map(([category, items]) => {
                    if (items.length === 0) return null;
                    return (
                      <div key={category} className="cv-entry-item break-inside-avoid flex items-baseline gap-2 text-xs">
                        <span className="font-semibold text-slate-800 shrink-0 w-36">
                          {category}:
                        </span>
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {items.map((s) => (
                            <span
                              key={s.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null,

            projects: hasProjects ? (
              <section aria-labelledby="section-projects" className="cv-section">
                <h2
                  id="section-projects"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.projects}
                </h2>
                <div className="space-y-3">
                  {projects.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <div className="flex items-baseline gap-2">
                            <h3 className="font-semibold text-slate-950 text-sm">{item.name}</h3>
                            {item.role && (
                              <span className="text-xs text-slate-500 font-medium">({item.role})</span>
                            )}
                          </div>
                          {item.startDate && (
                            <span className="text-xs text-slate-500 shrink-0">
                              {formatDateRange(item.startDate, item.endDate || "", false, lang)}
                            </span>
                          )}
                        </div>
                        {item.url && (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs hover:underline text-blue-600 font-medium"
                          >
                            {item.url}
                          </a>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {item.technologies.map((tech, idx) => (
                              <span key={idx} className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-700 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            certifications: hasCertifications ? (
              <section aria-labelledby="section-certifications" className="cv-section">
                <h2
                  id="section-certifications"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.certifications}
                </h2>
                <div className="space-y-2">
                  {certifications.map((item) => (
                    <div
                      key={item.id}
                      className="cv-entry-item break-inside-avoid flex justify-between items-baseline text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">
                          {item.name}
                        </span>
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
                            className="ml-2 text-blue-600 hover:underline text-[11px]"
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
              <section aria-labelledby="section-organizations" className="cv-section">
                <h2
                  id="section-organizations"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.organizations}
                </h2>
                <div className="space-y-3">
                  {organizations.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-semibold text-slate-950 text-sm">{item.position}</h3>
                          <span className="text-slate-500 shrink-0">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="text-slate-700 font-medium">{item.organization}</div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            languages: hasLanguages ? (
              <section aria-labelledby="section-languages" className="cv-section">
                <h2
                  id="section-languages"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.languages}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
                  {opt.languages?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item break-inside-avoid flex items-baseline gap-1.5">
                      <span className="font-semibold text-slate-900">{item.language}</span>
                      <span className="text-slate-500">— {item.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            awards: hasAwards ? (
              <section aria-labelledby="section-awards" className="cv-section">
                <h2
                  id="section-awards"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.awards}
                </h2>
                <div className="space-y-2.5">
                  {opt.awards?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-semibold text-slate-950 text-sm">{item.title}</h3>
                          <span className="text-slate-500 shrink-0">{item.date}</span>
                        </div>
                        <div className="text-slate-700 font-medium">{item.issuer}</div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            courses: hasCourses ? (
              <section aria-labelledby="section-courses" className="cv-section">
                <h2
                  id="section-courses"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.courses}
                </h2>
                <div className="space-y-2.5">
                  {opt.courses?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <div className="flex items-baseline gap-2">
                            <h3 className="font-semibold text-slate-950 text-sm">{item.title}</h3>
                            {item.duration && (
                              <span className="text-slate-500 text-[11px]">({item.duration})</span>
                            )}
                          </div>
                          {item.date && <span className="text-slate-500 shrink-0">{item.date}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <span>{item.provider}</span>
                          {item.url && (
                            <a
                              href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-[11px]"
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
              <section aria-labelledby="section-licenses" className="cv-section">
                <h2
                  id="section-licenses"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.licenses}
                </h2>
                <div className="space-y-2">
                  {opt.licenses?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item break-inside-avoid flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span className="text-slate-500"> — {item.issuer}</span>
                        {item.licenseNumber && (
                          <span className="text-slate-600 text-[11px] ml-1.5 font-mono">
                            (No: {item.licenseNumber})
                          </span>
                        )}
                        {item.url && (
                          <a
                            href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:underline text-[11px]"
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
              <section aria-labelledby="section-volunteer" className="cv-section">
                <h2
                  id="section-volunteer"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.volunteer}
                </h2>
                <div className="space-y-3">
                  {opt.volunteer?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-semibold text-slate-950 text-sm">{item.role}</h3>
                          <span className="text-slate-500 shrink-0">
                            {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                          </span>
                        </div>
                        <div className="text-slate-700 font-medium">{item.organization}</div>
                      </div>
                      {item.description && <DescLines text={item.description} />}
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            publications: hasPublications ? (
              <section aria-labelledby="section-publications" className="cv-section">
                <h2
                  id="section-publications"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-3"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.publications}
                </h2>
                <div className="space-y-2.5">
                  {opt.publications?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item space-y-0.5 text-xs">
                      <div className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <div className="flex items-baseline gap-2">
                            <h3 className="font-semibold text-slate-950 text-sm">{item.title}</h3>
                            {item.type && (
                              <span className="text-slate-500 text-[11px] font-medium">
                                ({item.type})
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 shrink-0">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                          <span>{item.publisher}</span>
                          {item.url && (
                            <a
                              href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-[11px]"
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
              <section aria-labelledby="section-portfolio" className="cv-section">
                <h2
                  id="section-portfolio"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.portfolio}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
                  {opt.portfolio?.items.map((item) => (
                    <div key={item.id} className="cv-entry-item break-inside-avoid flex items-baseline gap-1.5">
                      <span className="font-semibold text-slate-900">{item.label}:</span>
                      <a
                        href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.url}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ) : null,

            references: hasReferences ? (
              <section aria-labelledby="section-references" className="cv-section">
                <h2
                  id="section-references"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.references}
                </h2>
                {opt.references?.onDemand ? (
                  <p className="text-slate-600 text-xs italic">
                    {t.preview.referencesOnDemand}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {opt.references?.items.map((item) => (
                      <div key={item.id} className="cv-entry-item break-inside-avoid space-y-0.5 p-2 rounded bg-slate-50/70 border border-slate-200/60">
                        <h3 className="font-semibold text-slate-950 text-sm">{item.name}</h3>
                        <div className="text-slate-700 font-medium">
                          {item.position} — {item.company}
                        </div>
                        {item.relationship && (
                          <div className="text-slate-500 text-[11px]">{item.relationship}</div>
                        )}
                        {(item.email || item.phone) && (
                          <div className="text-slate-600 text-[11px] pt-1 space-x-2">
                            {item.email && (
                              <a href={`mailto:${item.email}`} className="hover:underline text-blue-600">
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
              <section aria-labelledby="section-interests" className="cv-section">
                <h2
                  id="section-interests"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 mb-2"
                >
                  <span
                    className="w-1 h-3.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden="true"
                  />
                  {t.sections.interests}
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

"use client";

import React from "react";
import type { CVTemplateProps } from "@/features/preview/template-registry";
import { formatDateRange, formatMonthYear } from "@/utils/date.utils";
import { getTranslations, useTranslation } from "@/i18n";
import { formatDisplayUrl } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

/**
 * Classic ATS Template
 * Design philosophy: pure ATS compatibility + professional look.
 * - Font: Georgia / Times New Roman (standard serif — ATS safe)
 * - Colors: Pure black only, no accent colors
 * - Layout: Single column, natural flow — no tables, no CSS columns
 * - Headings: UPPERCASE BOLD with full-width 2px underline
 * - Entries: Bold role/degree, italic institution, right-aligned dates
 * - Descriptions: Bullet-point list with "•" characters
 * - Skills: Category label (bold) followed by comma-separated items
 */
export function ClassicTemplate({ data, language }: CVTemplateProps) {
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

  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category?.trim() || t.editor.skills.mainSkillsDefaultCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});

  type ContactPart = { text: string; href?: string };
  const contactParts: ContactPart[] = [];
  if (personalInfo.email)
    contactParts.push({ text: personalInfo.email, href: `mailto:${personalInfo.email}` });
  if (personalInfo.phone) contactParts.push({ text: personalInfo.phone });
  if (personalInfo.location) contactParts.push({ text: personalInfo.location });
  if (personalInfo.linkedin)
    contactParts.push({
      text: formatDisplayUrl(personalInfo.linkedin, "LinkedIn", personalInfo.showFullLinks),
      href: personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`,
    });
  if (personalInfo.github)
    contactParts.push({
      text: formatDisplayUrl(personalInfo.github, "GitHub", personalInfo.showFullLinks),
      href: personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`,
    });
  if (personalInfo.website)
    contactParts.push({
      text: formatDisplayUrl(personalInfo.website, lang === "en" ? "Portfolio" : "Portofolio", personalInfo.showFullLinks),
      href: personalInfo.website.startsWith("http") ? personalInfo.website : `https://${personalInfo.website}`,
    });

  const SectionHeading = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <h2
      id={id}
      className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-black border-b-[1.5px] border-black pb-[2px] mb-[7px] mt-[14px]"
    >
      {children}
    </h2>
  );

  const BulletList = ({ text }: { text: string }) => {
    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-\u2022\u00b7]\s*/, "").trim())
      .filter(Boolean);
    if (lines.length === 0) return null;
    return (
      <ul className="mt-[3px]">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-[6px] text-[11px] text-black leading-[1.45]">
            <span className="shrink-0 mt-[1px] select-none">&bull;</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  const sectionOrder = data.metadata?.sectionOrder || DEFAULT_SECTION_ORDER;
  const fullOrderedKeys = Array.from(new Set([...sectionOrder, ...DEFAULT_SECTION_ORDER]));

  const sectionJSXMap: Record<string, React.ReactNode> = {
    summary: hasSummary && (
      <section aria-labelledby="ats-summary" className="cv-section">
        <SectionHeading id="ats-summary">{t.sections.summary}</SectionHeading>
        <p className="text-[11px] text-black leading-[1.5] text-justify">{summary.summary}</p>
      </section>
    ),

    experience: hasExperience && (
      <section aria-labelledby="ats-experience" className="cv-section">
        <SectionHeading id="ats-experience">{t.sections.experience}</SectionHeading>
        <div className="space-y-[10px]">
          {experience.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black leading-snug">{item.position}</h3>
                <span className="text-[10.5px] text-black shrink-0 whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-[11px] italic text-black">{item.company}</span>
                {item.location && (
                  <span className="text-[10.5px] italic text-black shrink-0">{item.location}</span>
                )}
              </div>
              {item.description?.trim() && <BulletList text={item.description} />}
            </div>
          ))}
        </div>
      </section>
    ),

    education: hasEducation && (
      <section aria-labelledby="ats-education" className="cv-section">
        <SectionHeading id="ats-education">{t.sections.education}</SectionHeading>
        <div className="space-y-[10px]">
          {education.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black leading-snug">
                  {item.degree}{item.field ? ` \u2014 ${item.field}` : ""}
                </h3>
                <span className="text-[10.5px] text-black shrink-0 whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate || "", false, lang)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-[11px] italic text-black">{item.institution}</span>
                {item.location && (
                  <span className="text-[10.5px] italic text-black shrink-0">{item.location}</span>
                )}
              </div>
              {item.gpa && (
                <p className="text-[10.5px] text-black mt-[2px]">
                  {lang === "en" ? "GPA" : "IPK"}: {item.gpa}
                </p>
              )}
              {item.description?.trim() && <BulletList text={item.description} />}
            </div>
          ))}
        </div>
      </section>
    ),

    skills: hasSkills && (
      <section aria-labelledby="ats-skills" className="cv-section">
        <SectionHeading id="ats-skills">{t.sections.skills}</SectionHeading>
        <div>
          {Object.entries(skillsByCategory).map(([cat, names]) => (
            <div key={cat} className="cv-skill-row flex gap-[6px] text-[11px] text-black leading-[1.5]">
              <span className="font-bold shrink-0">{cat}:</span>
              <span>{names.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>
    ),

    projects: hasProjects && (
      <section aria-labelledby="ats-projects" className="cv-section">
        <SectionHeading id="ats-projects">{t.sections.projects}</SectionHeading>
        <div className="space-y-[10px]">
          {projects.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black leading-snug">
                  {item.name}
                  {item.role && (
                    <span className="font-normal italic text-[11px]"> &mdash; {item.role}</span>
                  )}
                </h3>
                {(item.startDate || item.endDate) && (
                  <span className="text-[10.5px] text-black shrink-0 whitespace-nowrap">
                    {formatDateRange(item.startDate || "", item.endDate || "", false, lang)}
                  </span>
                )}
              </div>
              {item.technologies && item.technologies.length > 0 && (
                <p className="text-[10.5px] italic text-black">
                  {lang === "en" ? "Technology" : "Teknologi"}: {item.technologies.join(", ")}
                </p>
              )}
              {item.url && (
                <a
                  href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10.5px] text-black hover:underline"
                >
                  {formatDisplayUrl(item.url, "Link", personalInfo.showFullLinks)}
                </a>
              )}
              {item.description?.trim() && <BulletList text={item.description} />}
            </div>
          ))}
        </div>
      </section>
    ),

    certifications: hasCertifications && (
      <section aria-labelledby="ats-certifications" className="cv-section">
        <SectionHeading id="ats-certifications">{t.sections.certifications}</SectionHeading>
        <div className="space-y-[5px]">
          {certifications.map((item) => (
            <div key={item.id} className="cv-entry-item flex justify-between items-baseline gap-2">
              <div>
                <span className="text-[11.5px] font-bold text-black">{item.name}</span>
                {item.issuer && (
                  <span className="text-[11px] italic text-black"> &mdash; {item.issuer}</span>
                )}
              </div>
              {item.issueDate && (
                <span className="text-[10.5px] text-black shrink-0 whitespace-nowrap">
                  {formatMonthYear(item.issueDate, lang)}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    organizations: hasOrganizations && (
      <section aria-labelledby="ats-organizations" className="cv-section">
        <SectionHeading id="ats-organizations">{t.sections.organizations}</SectionHeading>
        <div className="space-y-[10px]">
          {organizations.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black leading-snug">{item.position}</h3>
                <span className="text-[10.5px] text-black shrink-0 whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-[11px] italic text-black">{item.organization}</span>
              </div>
              {item.description?.trim() && <BulletList text={item.description} />}
            </div>
          ))}
        </div>
      </section>
    ),

    languages: hasLanguages && (
      <section aria-labelledby="ats-languages" className="cv-section">
        <SectionHeading id="ats-languages">{t.sections.languages}</SectionHeading>
        <div>
          {opt.languages?.items.map((item) => (
            <div key={item.id} className="cv-skill-row flex gap-[6px] text-[11px] text-black leading-[1.5]">
              <span className="font-bold shrink-0">{item.language}:</span>
              <span className="italic">{item.proficiency}</span>
            </div>
          ))}
        </div>
      </section>
    ),

    awards: hasAwards && (
      <section aria-labelledby="ats-awards" className="cv-section">
        <SectionHeading id="ats-awards">{t.sections.awards}</SectionHeading>
        <div className="space-y-[6px]">
          {opt.awards?.items.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black">{item.title}</h3>
                {item.date && (
                  <span className="text-[10.5px] text-black shrink-0">{formatMonthYear(item.date, lang)}</span>
                )}
              </div>
              {item.issuer && <p className="text-[11px] italic text-black">{item.issuer}</p>}
              {item.description?.trim() && (
                <p className="text-[11px] text-black mt-[2px] leading-[1.45]">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    courses: hasCourses && (
      <section aria-labelledby="ats-courses" className="cv-section">
        <SectionHeading id="ats-courses">{t.sections.courses}</SectionHeading>
        <div className="space-y-[6px]">
          {opt.courses?.items.map((item) => (
            <div key={item.id} className="cv-entry-item flex justify-between items-baseline gap-2">
              <div>
                <span className="text-[11.5px] font-bold text-black">{item.title}</span>
                {item.provider && (
                  <span className="text-[11px] italic text-black"> &mdash; {item.provider}</span>
                )}
              </div>
              {item.date && (
                <span className="text-[10.5px] text-black shrink-0">{formatMonthYear(item.date, lang)}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    licenses: hasLicenses && (
      <section aria-labelledby="ats-licenses" className="cv-section">
        <SectionHeading id="ats-licenses">{t.sections.licenses}</SectionHeading>
        <div className="space-y-[6px]">
          {opt.licenses?.items.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-[11.5px] font-bold text-black">{item.title}</span>
                {item.issueDate && (
                  <span className="text-[10.5px] text-black shrink-0">{formatMonthYear(item.issueDate, lang)}</span>
                )}
              </div>
              {item.issuer && <p className="text-[11px] italic text-black">{item.issuer}</p>}
              {item.licenseNumber && (
                <p className="text-[10.5px] text-black">
                  {lang === "en" ? "License No." : "No. Lisensi"}: {item.licenseNumber}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    volunteer: hasVolunteer && (
      <section aria-labelledby="ats-volunteer" className="cv-section">
        <SectionHeading id="ats-volunteer">{t.sections.volunteer}</SectionHeading>
        <div className="space-y-[10px]">
          {opt.volunteer?.items.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black">{item.role}</h3>
                <span className="text-[10.5px] text-black shrink-0 whitespace-nowrap">
                  {formatDateRange(item.startDate, item.endDate || "", item.current, lang)}
                </span>
              </div>
              <span className="text-[11px] italic text-black">{item.organization}</span>
              {item.description?.trim() && <BulletList text={item.description} />}
            </div>
          ))}
        </div>
      </section>
    ),

    publications: hasPublications && (
      <section aria-labelledby="ats-publications" className="cv-section">
        <SectionHeading id="ats-publications">{t.sections.publications}</SectionHeading>
        <div className="space-y-[8px]">
          {opt.publications?.items.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-[11.5px] font-bold text-black leading-snug">{item.title}</h3>
                {item.date && (
                  <span className="text-[10.5px] text-black shrink-0">{formatMonthYear(item.date, lang)}</span>
                )}
              </div>
              {item.publisher && <p className="text-[11px] italic text-black">{item.publisher}</p>}
              {item.url && (
                <a
                  href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10.5px] text-black hover:underline"
                >
                  {formatDisplayUrl(item.url, "Link", personalInfo.showFullLinks)}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    portfolio: hasPortfolio && (
      <section aria-labelledby="ats-portfolio" className="cv-section">
        <SectionHeading id="ats-portfolio">{t.sections.portfolio}</SectionHeading>
        <div className="space-y-[6px]">
          {opt.portfolio?.items.map((item) => (
            <div key={item.id} className="cv-entry-item">
              <a
                href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11.5px] font-bold text-black hover:underline"
              >
                {item.label}
              </a>
              {item.url && (
                <p className="text-[10.5px] text-black">{item.url}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    ),

    references: hasReferences && (
      <section aria-labelledby="ats-references" className="cv-section">
        <SectionHeading id="ats-references">{t.sections.references}</SectionHeading>
        {opt.references?.onDemand ? (
          <p className="text-[11px] italic text-black">{t.preview.referencesOnDemand}</p>
        ) : (
          <div className="space-y-[8px]">
            {opt.references?.items.map((item) => (
              <div key={item.id} className="cv-entry-item">
                <h3 className="text-[11.5px] font-bold text-black">{item.name}</h3>
                <p className="text-[11px] italic text-black">
                  {item.position}{item.company ? ` \u2014 ${item.company}` : ""}
                </p>
                {item.relationship && <p className="text-[10.5px] text-black">{item.relationship}</p>}
                {(item.email || item.phone) && (
                  <p className="text-[10.5px] text-black">
                    {item.email && (
                      <a href={`mailto:${item.email}`} className="hover:underline">{item.email}</a>
                    )}
                    {item.email && item.phone && <span className="mx-1">&bull;</span>}
                    {item.phone && <span>{item.phone}</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    ),

    interests: hasInterests && (
      <section aria-labelledby="ats-interests" className="cv-section">
        <SectionHeading id="ats-interests">{t.sections.interests}</SectionHeading>
        <p className="text-[11px] text-black leading-[1.45]">
          {opt.interests?.items.join(", ")}
        </p>
      </section>
    ),
  };

  return (
    <article
      className="cv-template cv-classic text-black select-text"
      style={{
        fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
        fontSize: "12px",
        lineHeight: "1.4",
        fontVariantNumeric: "lining-nums tabular-nums",
        fontFeatureSettings: '"lnum" 1, "tnum" 1',
      }}
    >
      {/* HEADER */}
      <header className="cv-header text-center pb-[10px] mb-[4px] border-b-[2px] border-black">
        <h1 className="text-[18px] font-bold uppercase tracking-[0.1em] text-black leading-tight">
          {personalInfo.fullName || (lang === "en" ? "Full Name" : "Nama Lengkap")}
        </h1>
        {personalInfo.headline && (
          <p className="text-[12px] font-bold uppercase tracking-[0.07em] text-black mt-[3px]">
            {personalInfo.headline}
          </p>
        )}
        {contactParts.length > 0 && (
          <p className="font-sans text-[10.5px] text-black mt-[6px] leading-[1.5] tracking-normal">
            {contactParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="mx-[5px]">|</span>}
                {part.href ? (
                  <a href={part.href} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                    {part.text}
                  </a>
                ) : (
                  <span>{part.text}</span>
                )}
              </React.Fragment>
            ))}
          </p>
        )}
      </header>

      {/* SECTIONS */}
      <div role="region" aria-label="Konten CV">
        {fullOrderedKeys.map((key) => (
          <React.Fragment key={key}>{sectionJSXMap[key] || null}</React.Fragment>
        ))}
      </div>
    </article>
  );
}

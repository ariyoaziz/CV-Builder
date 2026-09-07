"use client";

import React, { useState } from "react";
import {
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FolderGit2,
  Award,
  Users,
  Languages,
  Trophy,
  BookOpen,
  FileBadge,
  HeartHandshake,
  BookMarked,
  Link2,
  UserCheck,
  Sparkles,
  Plus,
  EyeOff,
  GripVertical,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCVStore } from "@/store/useCVStore";
import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/input";
import { OptionalSectionKey, OptionalSections } from "@/types/cv.types";
import { DEFAULT_SECTION_ORDER } from "@/schemas/cv.schema";

import { PersonalInfoForm } from "@/features/editor/personal-info-form";
import { SummaryForm } from "@/features/editor/summary-form";
import { ExperienceSection } from "@/features/editor/experience-section";
import { EducationSection } from "@/features/editor/education-section";
import { SkillsSection } from "@/features/editor/skills-section";
import { ProjectsSection } from "@/features/editor/projects-section";
import { CertificationsSection } from "@/features/editor/certifications-section";
import { OrganizationsSection } from "@/features/editor/organizations-section";

import { LanguagesSection } from "@/features/editor/optional-sections/languages-section";
import { AwardsSection } from "@/features/editor/optional-sections/awards-section";
import { CoursesSection } from "@/features/editor/optional-sections/courses-section";
import { LicensesSection } from "@/features/editor/optional-sections/licenses-section";
import { VolunteerSection } from "@/features/editor/optional-sections/volunteer-section";
import { PublicationsSection } from "@/features/editor/optional-sections/publications-section";
import { PortfolioSection } from "@/features/editor/optional-sections/portfolio-section";
import { ReferencesSection } from "@/features/editor/optional-sections/references-section";
import { InterestsSection } from "@/features/editor/optional-sections/interests-section";

/**
 * Stable module-level fallback for optionalSections.
 */
const EMPTY_OPTIONAL_SECTIONS: OptionalSections = {
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

/**
 * Editor Panel — scrollable left-side panel containing main CV sections
 * and dynamic optional sections with customizable section ordering via mouse drag & drop.
 */
export function EditorPanel() {
  const { t, language } = useTranslation();
  const optionalSectionsState =
    useCVStore((state) => state.cvData.optionalSections) ??
    EMPTY_OPTIONAL_SECTIONS;
  const toggleOptionalSection = useCVStore((state) => state.toggleOptionalSection);
  const sectionOrder =
    useCVStore((state) => state.cvData.metadata.sectionOrder) ??
    DEFAULT_SECTION_ORDER;
  const setSectionOrder = useCVStore((state) => state.setSectionOrder);
  const setSectionLabel = useCVStore((state) => state.setSectionLabel);
  const sectionLabels = useCVStore((state) => state.cvData.metadata.sectionLabels ?? {});

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Accordion active values
  const [activeAccordionValues, setActiveAccordionValues] = useState<string[]>([
    "personal-info",
    "summary",
  ]);

  const optionalSectionsDef: Array<{
    key: OptionalSectionKey;
    label: string;
    icon: React.ElementType;
  }> = [
    { key: "languages", label: t.sections.languages, icon: Languages },
    { key: "awards", label: t.sections.awards, icon: Trophy },
    { key: "courses", label: t.sections.courses, icon: BookOpen },
    { key: "licenses", label: t.sections.licenses, icon: FileBadge },
    { key: "volunteer", label: t.sections.volunteer, icon: HeartHandshake },
    { key: "publications", label: t.sections.publications, icon: BookMarked },
    { key: "portfolio", label: t.sections.portfolio, icon: Link2 },
    { key: "references", label: t.sections.references, icon: UserCheck },
    { key: "interests", label: t.sections.interests, icon: Sparkles },
  ];

  const sectionDefinitions: Record<
    string,
    {
      id: string;
      label: string;
      icon: React.ElementType;
      component: React.ComponentType;
      isOptional?: boolean;
      optionalKey?: OptionalSectionKey;
    }
  > = {
    summary: { id: "summary", label: t.sections.summary, icon: AlignLeft, component: SummaryForm },
    experience: { id: "experience", label: t.sections.experience, icon: Briefcase, component: ExperienceSection },
    education: { id: "education", label: t.sections.education, icon: GraduationCap, component: EducationSection },
    skills: { id: "skills", label: t.sections.skills, icon: Lightbulb, component: SkillsSection },
    projects: { id: "projects", label: t.sections.projects, icon: FolderGit2, component: ProjectsSection },
    certifications: { id: "certifications", label: t.sections.certifications, icon: Award, component: CertificationsSection },
    organizations: { id: "organizations", label: t.sections.organizations, icon: Users, component: OrganizationsSection },
    languages: { id: "languages", label: t.sections.languages, icon: Languages, component: LanguagesSection, isOptional: true, optionalKey: "languages" },
    awards: { id: "awards", label: t.sections.awards, icon: Trophy, component: AwardsSection, isOptional: true, optionalKey: "awards" },
    courses: { id: "courses", label: t.sections.courses, icon: BookOpen, component: CoursesSection, isOptional: true, optionalKey: "courses" },
    licenses: { id: "licenses", label: t.sections.licenses, icon: FileBadge, component: LicensesSection, isOptional: true, optionalKey: "licenses" },
    volunteer: { id: "volunteer", label: t.sections.volunteer, icon: HeartHandshake, component: VolunteerSection, isOptional: true, optionalKey: "volunteer" },
    publications: { id: "publications", label: t.sections.publications, icon: BookMarked, component: PublicationsSection, isOptional: true, optionalKey: "publications" },
    portfolio: { id: "portfolio", label: t.sections.portfolio, icon: Link2, component: PortfolioSection, isOptional: true, optionalKey: "portfolio" },
    references: { id: "references", label: t.sections.references, icon: UserCheck, component: ReferencesSection, isOptional: true, optionalKey: "references" },
    interests: { id: "interests", label: t.sections.interests, icon: Sparkles, component: InterestsSection, isOptional: true, optionalKey: "interests" },
  };

  const handleEnableSection = (key: OptionalSectionKey) => {
    toggleOptionalSection(key, true);
    const accordionId = `sec-${key}`;
    if (!activeAccordionValues.includes(accordionId)) {
      setActiveAccordionValues((prev) => [...prev, accordionId]);
    }
  };

  const handleDisableSection = (key: OptionalSectionKey, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOptionalSection(key, false);
  };

  // Combine sectionOrder from store with DEFAULT_SECTION_ORDER to catch all keys
  const fullOrderedKeys = Array.from(new Set([...sectionOrder, ...DEFAULT_SECTION_ORDER]));

  // Active sections sorted by sectionOrder
  const activeSections = fullOrderedKeys
    .map((key) => sectionDefinitions[key])
    .filter((sec) => {
      if (!sec) return false;
      if (!sec.isOptional) return true;
      return Boolean(sec.optionalKey && optionalSectionsState[sec.optionalKey]?.enabled);
    });

  // Inactive optional sections for the picker below
  const inactiveOptionalSections = optionalSectionsDef.filter(
    (sec) => !optionalSectionsState[sec.key]?.enabled
  );

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number, sectionId: string) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", sectionId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const activeIds = activeSections.map((s) => s.id);
    const reorderedActiveIds = [...activeIds];
    const [movedId] = reorderedActiveIds.splice(draggedIndex, 1);
    reorderedActiveIds.splice(targetIndex, 0, movedId);

    // Merge with non-active section keys to maintain full sectionOrder schema
    const newFullOrder = Array.from(new Set([...reorderedActiveIds, ...fullOrderedKeys]));
    setSectionOrder(newFullOrder);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.common.edit} CV
        </h2>
      </div>

      {/* Accordion sections */}
      <Accordion
        type="multiple"
        value={activeAccordionValues}
        onValueChange={setActiveAccordionValues}
        className="flex-1"
      >
        {/* Fixed Top Section: Personal Information — pinned, no drag handle */}
        <AccordionItem
          value="personal-info"
          className="border-b border-slate-100"
        >
          <AccordionTrigger className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:no-underline hover:bg-slate-50 transition-colors data-[state=open]:text-blue-600 data-[state=open]:bg-blue-50/40">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {t.sections.personalInfo}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-1">
            <PersonalInfoForm />
          </AccordionContent>
        </AccordionItem>

        {/* Dynamic Reorderable Sections */}
        {activeSections.map((sec, index) => {
          const { id, label, icon: Icon, component: SectionComponent, isOptional, optionalKey } = sec;
          const accordionId = `sec-${id}`;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <AccordionItem
              key={accordionId}
              value={accordionId}
              draggable
              onDragStart={(e) => handleDragStart(e, index, id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`border-b border-slate-100 transition-all ${
                isOptional ? "bg-slate-50/30" : ""
              } ${isDragging ? "opacity-30 bg-blue-50/60 border-dashed border-blue-400" : ""} ${
                isDragOver ? "border-t-2 border-t-blue-600 bg-blue-50/40" : ""
              }`}
            >
              <div className="flex items-center w-full group">
                {/* Drag Handle — grip icon kiri */}
                <div
                  className="pl-3 pr-1.5 py-3.5 text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0 select-none flex items-center transition-colors"
                  title="Tarik untuk menggeser posisi bagian ini"
                  aria-label={`Geser urutan ${label}`}
                >
                  <GripVertical className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>

                {/* Accordion trigger takes full remaining width */}
                <AccordionTrigger className="flex-1 pr-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:no-underline hover:bg-slate-50 transition-colors data-[state=open]:text-blue-600 data-[state=open]:bg-blue-50/40">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isOptional ? "text-blue-500" : "text-slate-500"}`} strokeWidth={1.75} />
                    <span>{label}</span>
                    {isOptional && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
                        {t.common.optional}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>

                {/* Hide button (icon-only) for optional sections */}
                {isOptional && optionalKey && (
                  <div className="flex items-center shrink-0 pr-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleDisableSection(optionalKey, e)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title={`${t.common.hide} ${label}`}
                      aria-label={`${t.common.hide} ${label}`}
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="mb-4 rounded-md border border-slate-200 bg-slate-50/70 p-3">
                  <label
                    htmlFor={`section-label-${id}`}
                    className="mb-1 block text-[11px] font-semibold text-slate-600"
                  >
                    {language === "en" ? "CV heading" : "Judul di CV"}
                  </label>
                  <Input
                    id={`section-label-${id}`}
                    value={sectionLabels[id] ?? ""}
                    onChange={(e) => setSectionLabel(id, e.target.value)}
                    placeholder={label}
                    maxLength={80}
                    className="h-8 text-xs"
                  />
                </div>
                <SectionComponent />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Bagian Opsional Picker Area */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70 mt-auto">
        <div className="mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t.editor.optionalSectionPicker.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.editor.optionalSectionPicker.subtitle}
          </p>
        </div>

        {inactiveOptionalSections.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            {t.optionalSections.interests.emptyDesc}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {inactiveOptionalSections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleEnableSection(key)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border border-slate-200 shadow-2xs transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                aria-label={`${t.common.add} ${label}`}
              >
                <Plus className="h-3 w-3 text-blue-600" />
                <Icon className="h-3.5 w-3.5 opacity-70" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

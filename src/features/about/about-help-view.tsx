"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Coffee,
  CheckCircle2,
  Download,
  Eye,
  ExternalLink,
  FileCheck,
  FileText,
  Globe,
  HardDrive,
  HelpCircle,
  Layers,
  Layout,
  Lock,
  Printer,
  Shield,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { useTranslation } from "@/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function AboutHelpView() {
  const { t, language, setLanguage } = useTranslation();
  const [activeFaqTab, setActiveFaqTab] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("getting-started");

  const sections = [
    { id: "getting-started", label: t.aboutHelp.nav.gettingStarted, icon: Sparkles },
    { id: "about", label: t.aboutHelp.nav.about, icon: BookOpen },
    { id: "target-users", label: t.aboutHelp.nav.targetUsers, icon: Users },
    { id: "privacy", label: t.aboutHelp.nav.privacySecurity, icon: Shield },
    { id: "how-it-works", label: t.aboutHelp.nav.howItWorks, icon: Workflow },
    { id: "templates", label: t.aboutHelp.nav.templates, icon: Layout },
    { id: "ats", label: t.aboutHelp.nav.ats, icon: FileCheck },
    { id: "faq", label: t.aboutHelp.nav.faq, icon: HelpCircle },
    {
      id: "support",
      label: language === "id" ? "Dukung Pengembangan" : "Support Development",
      icon: Coffee,
    },
  ];

  const faqCategories = [
    { id: "general", name: t.aboutHelp.faq.categories.general.name, items: t.aboutHelp.faq.categories.general.items },
    { id: "ats", name: t.aboutHelp.faq.categories.ats.name, items: t.aboutHelp.faq.categories.ats.items },
    { id: "editor", name: t.aboutHelp.faq.categories.editor.name, items: t.aboutHelp.faq.categories.editor.items },
    { id: "templates", name: t.aboutHelp.faq.categories.templates.name, items: t.aboutHelp.faq.categories.templates.items },
    { id: "importExport", name: t.aboutHelp.faq.categories.importExport.name, items: t.aboutHelp.faq.categories.importExport.items },
    { id: "printPdf", name: t.aboutHelp.faq.categories.printPdf.name, items: t.aboutHelp.faq.categories.printPdf.items },
    { id: "language", name: t.aboutHelp.faq.categories.language.name, items: t.aboutHelp.faq.categories.language.items },
  ];

  const filteredFaqCategories =
    activeFaqTab === "all"
      ? faqCategories
      : faqCategories.filter((cat) => cat.id === activeFaqTab);

  return (
    <div className="about-help-view min-h-screen bg-white text-slate-900">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-w-0 h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label={t.header.backToEditor}
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="hidden sm:inline">{t.header.backToEditor}</span>
            </Link>
            <span className="text-slate-300 select-none">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-blue-600 tracking-tight select-none">
                CV<span className="text-slate-800">Builder</span>
              </span>
              <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-medium py-0 px-1.5 text-slate-600 bg-slate-100 border-slate-200">
                {t.aboutHelp.pageTitle}
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <div
              className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-0.5"
              role="group"
              aria-label={t.header.languageSwitcherAria}
            >
              <button
                type="button"
                id="about-lang-btn-id"
                onClick={() => setLanguage("id")}
                aria-pressed={language === "id"}
                className={`min-w-9 min-h-8 px-2 py-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center justify-center select-none ${
                  language === "id"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ID
              </button>
              <button
                type="button"
                id="about-lang-btn-en"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`min-w-9 min-h-8 px-2 py-1 rounded text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center justify-center select-none ${
                  language === "en"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>

            <Link href="/">
              <Button size="sm" className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs min-h-9 px-2 sm:px-3">
                {t.header.backToEditor}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
        <div className="mb-5 lg:hidden">
          <label htmlFor="about-section-select" className="mb-1.5 block text-xs font-semibold text-slate-600">
            {language === "id" ? "Pilih informasi" : "Choose a topic"}
          </label>
          <select
            id="about-section-select"
            value={activeSectionId}
            onChange={(e) => setActiveSectionId(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>{sec.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Desktop Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20 border-r border-slate-200 pr-5">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {t.aboutHelp.pageTitle}
              </h2>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`group flex w-full items-center gap-2.5 border-l-2 px-2.5 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        activeSectionId === sec.id
                          ? "border-blue-600 bg-blue-50/50 text-blue-700"
                          : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${activeSectionId === sec.id ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"}`} aria-hidden="true" />
                      <span>{sec.label}</span>
                    </button>
                  );
                })}
              </nav>

              <Separator className="my-4" />

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold text-blue-900 mb-1">{t.aboutHelp.hero.title}</p>
                <p className="text-[11px] text-blue-700 mb-2 leading-relaxed">
                  {t.aboutHelp.hero.description}
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full text-xs bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
                    {t.header.backToEditor}
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Article Body */}
          <main className="min-w-0 space-y-8 lg:col-span-9">
            {/* 1. HERO SECTION */}
            {activeSectionId === "getting-started" && <section
              id="hero"
              aria-labelledby="hero-heading"
              className="border-b border-slate-200 bg-white pb-6 sm:pb-8 relative overflow-hidden"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                <span>{t.aboutHelp.hero.badge}</span>
              </div>
              <h1 id="hero-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                {t.aboutHelp.hero.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
                {t.aboutHelp.hero.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 py-1 px-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-1.5" aria-hidden="true" />
                  ATS Friendly
                </Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 py-1 px-2.5">
                  <HardDrive className="h-3.5 w-3.5 text-blue-600 mr-1.5" aria-hidden="true" />
                  Local Storage
                </Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 py-1 px-2.5">
                  <Lock className="h-3.5 w-3.5 text-amber-600 mr-1.5" aria-hidden="true" />
                  No Account
                </Badge>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 py-1 px-2.5">
                  <Globe className="h-3.5 w-3.5 text-indigo-600 mr-1.5" aria-hidden="true" />
                  ID & EN
                </Badge>
              </div>
            </section>}

            {/* 2. GETTING STARTED */}
            {activeSectionId === "getting-started" && <section
              id="getting-started"
              aria-labelledby="getting-started-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="getting-started-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.gettingStarted.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.gettingStarted.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {t.aboutHelp.gettingStarted.steps.map((step) => (
                  <Card key={step.step} className="border-slate-200 bg-white hover:border-slate-300 transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200">
                          {step.step}
                        </span>
                        <CardTitle className="text-sm font-semibold text-slate-800">
                          {step.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs leading-relaxed text-slate-600">
                        {step.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>}

            {/* 3. ABOUT CV BUILDER & CREATOR & PURPOSE */}
            {activeSectionId === "about" && <section
              id="about"
              aria-labelledby="about-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="about-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.about.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.about.subtitle}</p>
                </div>
              </div>

              <Card className="border-slate-200 bg-white">
                <CardContent className="p-6 space-y-6">
                  {/* What is it */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {t.aboutHelp.about.whatIsTitle}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                      {t.aboutHelp.about.whatIsDesc}
                    </p>
                  </div>

                  <Separator />

                  {/* Creator */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {t.aboutHelp.about.createdByTitle}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 mb-2">
                      {t.aboutHelp.about.createdByDesc}
                    </p>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 font-mono text-xs">
                      {t.aboutHelp.about.createdByName}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Purpose */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {t.aboutHelp.about.purposeTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      {t.aboutHelp.about.purposeDesc}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600">
                      {t.aboutHelp.about.purposes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>}

            {/* 4. TARGET USERS */}
            {activeSectionId === "target-users" && <section
              id="target-users"
              aria-labelledby="target-users-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Users className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="target-users-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.targetUsers.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.targetUsers.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {t.aboutHelp.targetUsers.personas.map((persona, idx) => (
                  <Card key={idx} className="border-slate-200 bg-white">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-semibold text-slate-800">
                        {persona.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs leading-relaxed text-slate-600">
                        {persona.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Diverse Industries Note */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-bold text-slate-800 mb-1">
                  {t.aboutHelp.targetUsers.industryTitle}
                </p>
                <p className="text-xs leading-relaxed text-slate-600">
                  {t.aboutHelp.targetUsers.industryDesc}
                </p>
              </div>
            </section>}

            {/* 5. PRIVACY & SECURITY */}
            {activeSectionId === "privacy" && <section
              id="privacy"
              aria-labelledby="privacy-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="privacy-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.privacySecurity.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.privacySecurity.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-slate-200 bg-white">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      {t.aboutHelp.privacySecurity.storageTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs leading-relaxed text-slate-600">
                      {t.aboutHelp.privacySecurity.storageDesc}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      {t.aboutHelp.privacySecurity.serverTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs leading-relaxed text-slate-600">
                      {t.aboutHelp.privacySecurity.serverDesc}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-600" aria-hidden="true" />
                      {t.aboutHelp.privacySecurity.accountTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs leading-relaxed text-slate-600">
                      {t.aboutHelp.privacySecurity.accountDesc}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 bg-white">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-600" aria-hidden="true" />
                      {t.aboutHelp.privacySecurity.backupTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs leading-relaxed text-slate-600">
                      {t.aboutHelp.privacySecurity.backupDesc}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Local Storage Risks & Tips */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-xs font-bold text-amber-900 mb-2">
                  {t.aboutHelp.privacySecurity.risksTitle}
                </p>
                <p className="text-xs leading-relaxed text-amber-800">
                  {t.aboutHelp.privacySecurity.risksDesc}
                </p>
              </div>
            </section>}

            {/* 6. HOW IT WORKS */}
            {activeSectionId === "how-it-works" && <section
              id="how-it-works"
              aria-labelledby="how-it-works-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                  <Workflow className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="how-it-works-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.howItWorks.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.howItWorks.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {t.aboutHelp.howItWorks.steps.map((step, idx) => {
                  const icons = [FileText, HardDrive, Eye, Layers, FileCheck, Printer];
                  const StepIcon = icons[idx] || Workflow;
                  return (
                    <div
                      key={step.step}
                      className="relative rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            <StepIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          </div>
                          <span className="text-xs font-bold text-slate-400">
                            0{step.step}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>}

            {/* 7. TEMPLATES */}
            {activeSectionId === "templates" && <section
              id="templates"
              aria-labelledby="templates-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <Layout className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="templates-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.templates.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.templates.subtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {t.aboutHelp.templates.items.map((item, idx) => {
                  const badges = ["Modern", "Minimal", "Classic"];
                  return (
                    <Card key={idx} className="border-slate-200 bg-white">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-bold text-slate-900">
                            {item.name}
                          </CardTitle>
                          <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-700 border-slate-200">
                            {badges[idx] || "Template"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs leading-relaxed text-slate-600">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Data Uniformity Note */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-xs font-semibold text-blue-900 mb-1">
                  Format Data CV
                </p>
                <p className="text-xs leading-relaxed text-blue-800">
                  {t.aboutHelp.templates.note}
                </p>
              </div>
            </section>}

            {/* 8. ATS EXPLANATION */}
            {activeSectionId === "ats" && <section
              id="ats"
              aria-labelledby="ats-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <FileCheck className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="ats-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.ats.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.ats.subtitle}</p>
                </div>
              </div>

              <Card className="border-slate-200 bg-white">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {t.aboutHelp.ats.whatIsTitle}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                      {t.aboutHelp.ats.whatIsDesc}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {t.aboutHelp.ats.builderTitle}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                      {t.aboutHelp.ats.builderDesc}
                    </p>
                  </div>

                  <Separator />

                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                    <h3 className="text-xs font-bold text-slate-800 mb-2">
                      {t.aboutHelp.ats.tipsTitle}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {t.aboutHelp.ats.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>}

            {/* 9. FAQ ACCORDION */}
            {activeSectionId === "faq" && <section
              id="faq"
              aria-labelledby="faq-heading"
              className="scroll-mt-20 space-y-6"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="faq-heading" className="text-xl font-bold tracking-tight text-slate-900">
                    {t.aboutHelp.faq.title}
                  </h2>
                  <p className="text-xs text-slate-500">{t.aboutHelp.faq.subtitle}</p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => setActiveFaqTab("all")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all min-h-9 flex items-center ${
                    activeFaqTab === "all"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {language === "id" ? "Semua Kategori" : "All Categories"}
                </button>
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveFaqTab(cat.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all min-h-9 flex items-center ${
                      activeFaqTab === cat.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Accordion Lists */}
              <div className="space-y-6">
                {filteredFaqCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                      {category.name}
                    </h3>
                    <Accordion type="multiple" className="space-y-2">
                      {category.items.map((item, idx) => (
                        <AccordionItem
                          key={`${category.id}-${idx}`}
                          value={`${category.id}-${idx}`}
                          className="rounded-xl border border-slate-200 bg-white px-4 data-[state=open]:border-blue-200 data-[state=open]:bg-blue-50/20 transition-colors"
                        >
                          <AccordionTrigger className="text-left text-xs sm:text-sm font-semibold text-slate-800 hover:no-underline py-3.5 min-h-11">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-xs sm:text-sm leading-relaxed text-slate-600 pt-0 pb-4">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            </section>}

            {activeSectionId === "support" && (
              <section aria-labelledby="support-heading" className="space-y-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <Coffee className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="support-heading" className="text-xl font-bold tracking-tight text-slate-900">
                      {language === "id" ? "Dukung Pengembangan" : "Support Development"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {language === "id"
                        ? "Terima kasih sudah menggunakan CV Builder. Dukungan Anda membantu pengembangan fitur dan perbaikan aplikasi."
                        : "Thank you for using CV Builder. Your support helps improve the app and build new features."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="p-5">
                      <p className="text-sm font-bold text-slate-900">Ariyo Aziz</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {language === "id" ? "Lihat portofolio dan proyek lainnya." : "View the portfolio and other projects."}
                      </p>
                      <a
                        href="https://ariyoaziz.github.io"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
                      >
                        ariyoaziz.github.io
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-200 bg-amber-50/60">
                    <CardContent className="p-5">
                      <p className="text-sm font-bold text-amber-950">
                        {language === "id" ? "Beli Kopi / Beri Dukungan" : "Buy Me a Coffee"}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-amber-800">
                        {language === "id"
                          ? "Jika aplikasi ini membantu, Anda dapat memberikan dukungan atau ucapan terima kasih melalui Saweria."
                          : "If this app helps you, you can support its development or say thanks through Saweria."}
                      </p>
                      <a
                        href="https://saweria.co/ariyoaziz"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-amber-900 hover:underline"
                      >
                        saweria.co/ariyoaziz
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            {/* Return to editor banner */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">
                {language === "id" ? "Siap Membuat CV Anda?" : "Ready to Create Your CV?"}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {language === "id"
                  ? "Buka editor sekarang untuk menyusun CV profesional yang rapi, ramah ATS, dan siap dicetak atau disimpan sebagai PDF."
                  : "Open the editor now to build a clean, ATS-friendly CV ready to print or save as PDF."}
              </p>
              <div className="pt-2">
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs min-h-11 px-5">
                    <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    {t.header.backToEditor}
                  </Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

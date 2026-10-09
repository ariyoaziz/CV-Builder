/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/static-components */
import * as React from "react";
import { toast } from "sonner";
import { sanitizeFilename } from "@/features/import-export/export-json";
import type { CVData } from "@/types/cv.types";
import type { Language } from "@/i18n/types";
import { getTranslations } from "@/i18n";
import { formatDateRange, formatMonthYear } from "@/utils/date.utils";

const safeHttpUrl = (value?: string): string | null => {
  if (!value?.trim()) return null;
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch { return null; }
};

const safeMailto = (value?: string): string | null => value?.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? `mailto:${value.trim()}` : null;
const lines = (value?: string) => (value ?? "").split(/\r?\n/).map((line) => line.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);

function PdfDocument({ data, language, Document, Page, Text, View, Link, Image, StyleSheet }: any) {
  const accent = data.metadata.accentColor || "#2563eb";
  const template = data.metadata.templateId || "modern";
  const isClassic = template === "classic";
  const isMinimal = template === "minimal";
  const info = data.personalInfo;
  const optional = data.optionalSections;
  const t = getTranslations(language);
  const styles = StyleSheet.create({
    page: { paddingTop: 43, paddingBottom: 43, paddingHorizontal: 43, fontFamily: "Helvetica", fontSize: 10, color: "#000000" },
    header: { borderBottomWidth: 1, borderBottomColor: "#000000", paddingBottom: 9, marginBottom: 2, flexGrow: 1, alignItems: isClassic ? "center" : "flex-start" },
    name: { fontSize: 16, fontWeight: 700, color: "#000000", letterSpacing: isClassic ? 0.5 : 0, textTransform: isClassic ? "uppercase" : "none", marginBottom: 3 },
    headline: { fontSize: 10, fontWeight: 700, color: isClassic ? "#000000" : accent, letterSpacing: isClassic ? 0.2 : 0, textTransform: isClassic ? "uppercase" : "none", marginBottom: 5 },
    contact: { flexDirection: "row", flexWrap: "wrap", color: "#000000", fontFamily: "Helvetica", fontSize: 8.5 },
    separator: { marginHorizontal: 4, color: "#000000" },
    link: { color: isClassic ? "#000000" : "#334155", textDecoration: "none" },
    section: { marginTop: 11, marginBottom: 0 },
    sectionTitle: { color: "#000000", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderBottomWidth: 0.8, borderBottomColor: "#000000", borderLeftWidth: 0, paddingLeft: 0, paddingBottom: 3, marginBottom: 5, letterSpacing: 0.2 },
    row: { marginBottom: 5 },
    rowHeader: { flexDirection: "row", justifyContent: "space-between", gap: 4 },
    titleBlock: { width: "78%", flexShrink: 1 },
    title: { fontSize: 10, fontWeight: 700, flexGrow: 1, flexShrink: 1 },
    date: { fontSize: 9.2, flexShrink: 0, width: 86, textAlign: "right" },
    muted: { color: "#000000", fontStyle: isClassic ? "italic" : "normal", fontSize: 9.5 },
    body: { fontSize: 10, lineHeight: 1.15, marginTop: 1, color: "#000000" },
    summaryBody: { fontSize: 10, lineHeight: 1.15, marginTop: 0, color: "#000000" },
    bulletList: { marginTop: 1 },
    bulletLine: { fontSize: 10, lineHeight: 1.15, marginBottom: 0, paddingLeft: 4, color: "#000000" },
    skill: { marginBottom: 3 },
    photo: { width: isMinimal ? 52 : 64, height: isMinimal ? 52 : 64, objectFit: "cover", marginLeft: 12, borderRadius: isMinimal ? 3 : 32, borderWidth: 1.5, borderColor: accent },
    headerRow: { flexDirection: "row", justifyContent: "space-between" },
  });
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => <View style={styles.section} wrap><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
  const LinkText = ({ href, children }: { href: string | null; children: React.ReactNode }) => href ? <Link src={href} style={styles.link}>{children}</Link> : <Text>{children}</Text>;
  const Bullets = ({ text }: { text?: string }) => {
    const bulletLines = lines(text);
    return bulletLines.length ? <View style={styles.bulletList}>{bulletLines.map((line, index) => <Text style={styles.bulletLine} key={`${line}-${index}`}>• {line}</Text>)}</View> : null;
  };
  const Entry = ({ title, subtitle, date, location, description }: { title: string; subtitle?: string; date?: string; location?: string; description?: string }) => <View style={styles.row} wrap><View style={styles.rowHeader}><View style={styles.titleBlock}><Text style={styles.title}>{title}</Text></View>{date ? <Text style={styles.date}>{date}</Text> : null}</View>{subtitle ? <View style={styles.rowHeader}><Text style={styles.muted}>{subtitle}</Text>{location ? <Text style={styles.muted}>{location}</Text> : null}</View> : null}<Bullets text={description} /></View>;
  const sectionTitle = (key: string, fallback: string) => data.metadata.sectionLabels?.[key] || (t.sections as Record<string, string>)[key] || fallback;
  const skillsByCategory: Record<string, string[]> = (data.skills as any[]).reduce((groups: Record<string, string[]>, item: any) => {
    const category = item.category?.trim() || (language === "en" ? "Skills" : "Keahlian Utama");
    (groups[category] ??= []).push(item.name);
    return groups;
  }, {});
  const contactParts = [
    info.email ? { text: info.email, href: safeMailto(info.email) } : null,
    info.phone ? { text: info.phone, href: null } : null,
    info.location ? { text: info.location, href: null } : null,
    ...([[info.linkedin, "LinkedIn"], [info.github, "GitHub"], [info.website, "Portfolio"]] as const).filter(([url]) => Boolean(url)).map(([url, label]) => ({ text: info.showFullLinks ? url : label, href: safeHttpUrl(url) })),
  ].filter(Boolean) as { text: string; href: string | null }[];

  return <Document title={`CV - ${info.fullName}`} author="CV Builder" subject="Curriculum Vitae"><Page size="A4" style={styles.page}>
    <View style={styles.headerRow}><View style={styles.header}><Text style={styles.name}>{info.fullName}</Text>{info.headline ? <Text style={styles.headline}>{info.headline}</Text> : null}<View style={styles.contact}>{contactParts.map((part, index) => <React.Fragment key={`${part.text}-${index}`}>{index > 0 ? <Text style={styles.separator}>{isClassic ? "|" : "  "}</Text> : null}<LinkText href={part.href}>{part.text}</LinkText></React.Fragment>)}</View></View></View>
    {data.summary.summary ? <Section title={sectionTitle("summary", "Summary")}><Text style={styles.summaryBody}>{data.summary.summary}</Text></Section> : null}
    {data.experience.length ? <Section title={sectionTitle("experience", "Experience")}>{data.experience.map((item: any) => <Entry key={item.id} title={item.position} subtitle={item.company} date={formatDateRange(item.startDate, item.endDate || "", item.current, language)} location={item.location} description={item.description} />)}</Section> : null}
    {data.education.length ? <Section title={sectionTitle("education", "Education")}>{data.education.map((item: any) => <View style={styles.row} key={item.id}><View style={styles.rowHeader}><Text style={styles.title}>{item.degree}{item.field ? ` — ${item.field}` : ""}</Text><Text style={styles.date}>{formatDateRange(item.startDate, item.endDate || "", false, language)}</Text></View><View style={styles.rowHeader}><Text style={styles.muted}>{item.institution}</Text>{item.location ? <Text style={styles.muted}>{item.location}</Text> : null}</View>{item.gpa ? <Text style={styles.body}>{language === "en" ? "GPA" : "IPK"}: {item.gpa}</Text> : null}<Bullets text={item.description} /></View>)}</Section> : null}
    {data.skills.length ? <Section title={sectionTitle("skills", "Skills")}>{Object.entries(skillsByCategory).map(([category, names]) => <Text style={styles.skill} key={category}><Text style={styles.title}>{category}: </Text>{(names as string[]).join(", ")}</Text>)}</Section> : null}
    {data.projects.length ? <Section title={sectionTitle("projects", "Projects")}>{data.projects.map((item: any) => <View style={styles.row} key={item.id}><View style={styles.rowHeader}><View style={styles.titleBlock}><Text style={styles.title}>{item.name}{item.role ? ` — ${item.role}` : ""}</Text></View>{item.startDate || item.endDate ? <Text style={styles.date}>{formatDateRange(item.startDate || "", item.endDate || "", false, language)}</Text> : null}</View>{item.technologies.length ? <Text style={styles.muted}>{language === "en" ? "Technology" : "Teknologi"}: {item.technologies.join(", ")}</Text> : null}{item.url ? <LinkText href={safeHttpUrl(item.url)}>{item.url}</LinkText> : null}<Bullets text={item.description} /></View>)}</Section> : null}
    {data.certifications.length ? <Section title={sectionTitle("certifications", "Certifications")}>{data.certifications.map((item: any) => <Entry key={item.id} title={item.name} subtitle={item.issuer} date={formatMonthYear(item.issueDate, language)} description={item.credentialUrl ? `Credential: ${item.credentialUrl}` : ""} />)}</Section> : null}
    {data.organizations.length ? <Section title={sectionTitle("organizations", "Organizations")}>{data.organizations.map((item: any) => <Entry key={item.id} title={item.position} subtitle={item.organization} date={formatDateRange(item.startDate, item.endDate || "", item.current, language)} description={item.description} />)}</Section> : null}
    {optional.portfolio.enabled && optional.portfolio.items.length ? <Section title={sectionTitle("portfolio", "Portfolio")}>{optional.portfolio.items.map((item: any) => <View style={styles.row} key={item.id}><LinkText href={safeHttpUrl(item.url)}>{item.label}</LinkText></View>)}</Section> : null}
    {optional.languages.enabled && optional.languages.items.length ? <Section title={sectionTitle("languages", "Languages")}>{optional.languages.items.map((item: any) => <Text style={styles.body} key={item.id}>{item.language} — {item.proficiency}</Text>)}</Section> : null}
    {optional.awards.enabled && optional.awards.items.length ? <Section title={sectionTitle("awards", "Awards")}>{optional.awards.items.map((item: any) => <Entry key={item.id} title={item.title} subtitle={item.issuer} date={formatMonthYear(item.date, language)} description={item.description} />)}</Section> : null}
    {optional.courses.enabled && optional.courses.items.length ? <Section title={sectionTitle("courses", "Courses")}>{optional.courses.items.map((item: any) => <Entry key={item.id} title={item.title} subtitle={item.provider} date={formatMonthYear(item.date, language)} description={item.description} />)}</Section> : null}
    {optional.licenses.enabled && optional.licenses.items.length ? <Section title={sectionTitle("licenses", "Licenses")}>{optional.licenses.items.map((item: any) => <Entry key={item.id} title={item.title} subtitle={item.issuer} date={item.issueDate} description={item.licenseNumber} />)}</Section> : null}
    {optional.volunteer.enabled && optional.volunteer.items.length ? <Section title={sectionTitle("volunteer", "Volunteer")}>{optional.volunteer.items.map((item: any) => <Entry key={item.id} title={item.role} subtitle={item.organization} date={formatDateRange(item.startDate, item.endDate || "", item.current, language)} description={item.description} />)}</Section> : null}
    {optional.publications.enabled && optional.publications.items.length ? <Section title={sectionTitle("publications", "Publications")}>{optional.publications.items.map((item: any) => <Entry key={item.id} title={item.title} subtitle={`${item.publisher}${item.type ? ` · ${item.type}` : ""}`} date={item.date} description={item.description} />)}</Section> : null}
    {optional.interests.enabled && optional.interests.items.length ? <Section title={sectionTitle("interests", "Interests")}><Text style={styles.body}>{optional.interests.items.join(", ")}</Text></Section> : null}
    {optional.references.enabled && !optional.references.onDemand && optional.references.items.length ? <Section title={sectionTitle("references", "References")}>{optional.references.items.map((item: any) => <View style={styles.row} key={item.id}><Text style={styles.title}>{item.name}</Text><Text>{item.position} — {item.company}</Text><Text style={styles.muted}>{item.email} {item.phone}</Text></View>)}</Section> : null}
  </Page></Document>;
}

export async function exportCVToPDF(data: CVData, language: Language = "id"): Promise<void> {
  try {
    const renderer = await import("@react-pdf/renderer");
    const pdfDocument = React.createElement(PdfDocument, { data, language, ...renderer });
    const blob = await renderer.pdf(pdfDocument).toBlob();
    const url = URL.createObjectURL(blob);
    const anchor = globalThis.document.createElement("a");
    anchor.href = url;
    anchor.download = `CV_${sanitizeFilename(data.personalInfo.fullName)}_${new Date().toISOString().slice(0, 10)}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("PDF CV berhasil dibuat.");
  } catch (error) {
    console.error("Gagal mengekspor CV ke PDF:", error);
    toast.error("PDF gagal dibuat. Silakan coba lagi.");
  }
}

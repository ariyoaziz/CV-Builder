import { Metadata } from "next";
import { AboutHelpView } from "@/features/about/about-help-view";

export const metadata: Metadata = {
  title: "Tentang, Bantuan & FAQ | CV Builder",
  description:
    "Pusat bantuan, panduan pembuatan CV, penjelasan template, privasi data, dan pertanyaan umum tentang CV Builder.",
};

export default function AboutPage() {
  return <AboutHelpView />;
}

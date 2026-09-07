import type { Metadata } from "next";
import { fontInter, fontOutfit, fontLora } from "@/lib/fonts";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Builder — Professional ATS-Conscious Resume Builder",
  description:
    "Create, customize, and print ATS-conscious professional CVs directly in your browser. 100% client-side and privacy-first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fontInter.variable} ${fontOutfit.variable} ${fontLora.variable}`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

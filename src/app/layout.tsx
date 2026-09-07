import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Builder — Professional ATS-Conscious Resume Builder",
  description:
    "Create, customize, and print ATS-conscious professional CVs directly in your browser. 100% client-side and privacy-first.",
  applicationName: "CVBuilder",
  openGraph: {
    type: "website",
    title: "CV Builder - Professional ATS-Conscious Resume Builder",
    description:
      "Create, customize, and print ATS-conscious professional CVs directly in your browser.",
    images: [
      {
        url: "/mylogo.png",
        width: 1536,
        height: 1024,
        alt: "CV Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Builder - Professional ATS-Conscious Resume Builder",
    description:
      "Create, customize, and print ATS-conscious professional CVs directly in your browser.",
    images: ["/mylogo.png"],
  },
  icons: {
    icon: "/mylogo.png",
    apple: "/mylogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}

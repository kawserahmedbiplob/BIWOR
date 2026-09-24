import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = getSettings();
  return {
    title: s.metaTitle || s.companyName,
    description: s.metaDescription,
    keywords: s.metaKeywords,
    icons: s.favicon ? [{ url: s.favicon }] : undefined,
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      siteName: s.companyName,
      images: s.ogImage ? [{ url: s.ogImage }] : [],
      type: "website",
    },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}

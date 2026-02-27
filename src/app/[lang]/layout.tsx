import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { languages } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "جنة الأطفال - منصة التعليم الإلكتروني",
    template: "%s | جنة الأطفال",
  },
  description: "منصة تعليمية إلكترونية متميزة للطلاب. دروس مباشرة، Courses التفاعلية، ومسارات تعلم شخصية.",
  keywords: ["تعليم", "تعلم", "دروس مباشرة", "منصة تعليمية", " LMS"],
  authors: [{ name: "جنة الأطفال" }],
  creator: "جنة الأطفال",
  openGraph: {
    type: "website",
    locale: "ar",
    url: "https://janatualatfal.com",
    siteName: "جنة الأطفال",
    title: "جنة الأطفال - منصة التعليم الإلكتروني",
    description: "منصة تعليمية إلكترونية متميزة للطلاب",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "جنة الأطفال - المنصة التعليمية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جنة الأطفال - منصة التعليم الإلكتروني",
    description: "منصة تعليمية إلكترونية متميزة للطلاب",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return languages.map((l) => ({ lang: l.code }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  if (!languages.some((l) => l.code === lang)) {
    notFound();
  }
  
  await getDictionary(lang);
  
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}

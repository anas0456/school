import type { Metadata } from "next";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "جنة الأطفال - منصة التعليم الإلكتروني",
  description: "منصة تعليمية إلكترونية متميزة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen bg-black text-white">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}

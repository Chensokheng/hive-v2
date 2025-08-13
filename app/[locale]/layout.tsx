import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import "../globals.css";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import Navbar from "@/components/hive/navbar";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIVE",
  description:
    "HIVE is an online food ordering platform that lets you browse restaurants, customize your meals, and place orders for fast delivery or convenient pickup—all from one easy-to-use app.",
  openGraph: {
    title: "HIVE",
    description:
      "HIVE is an online food ordering platform that lets you browse restaurants, customize your meals, and place orders for fast delivery or convenient pickup—all from one easy-to-use app.",
    type: "website",
    locale: "en_US",
    siteName: "HIVE",
  },
  twitter: {
    card: "summary_large_image",
    title: "HIVE",
    description:
      "HIVE is an online food ordering platform that lets you browse restaurants, customize your meals, and place orders for fast delivery or convenient pickup—all from one easy-to-use app.",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased p-5`}>
        <NextIntlClientProvider>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

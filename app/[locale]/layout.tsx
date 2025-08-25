import type { Metadata } from "next";
import { Inter, Kantumruy_Pro } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../globals.css";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";


const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const kantumruy = Kantumruy_Pro({
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevent zoom
  userScalable: false,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${locale === "kh" ? kantumruy.className : inter.className} antialiased`}
      >
        <NextIntlClientProvider>
          <NuqsAdapter>
            {children}
            {/* <Checkout /> */}
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

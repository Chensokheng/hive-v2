import React from "react";
import { routing } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return <div>{t("title")}</div>;
}

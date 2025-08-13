import React, { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("AboutPage");

  return <div>{t("title")}</div>;
}

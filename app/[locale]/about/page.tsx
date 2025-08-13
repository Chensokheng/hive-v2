import React from "react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return <div>{t("title")}</div>;
}

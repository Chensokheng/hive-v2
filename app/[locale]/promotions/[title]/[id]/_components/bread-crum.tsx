"use client";

import React from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";

export default function BreadCrumPromotion() {
  const { locale, title } = useParams() as {
    locale: string;
    title: string;
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: `/${locale}`,
      active: false,
    },
    {
      label: title,
      active: true,
    },
  ];
  return <Breadcrumb items={breadcrumbItems} />;
}

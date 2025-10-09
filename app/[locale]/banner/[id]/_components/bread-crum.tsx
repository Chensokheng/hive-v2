"use client";

import React from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";

export default function BreadCrumBanner() {
  const { locale } = useParams() as {
    locale: string;
    merchant: string;
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: `/${locale}`,
      active: false,
    },
    {
      label: "Banner",
      active: true,
    },
  ];
  return <Breadcrumb items={breadcrumbItems} />;
}

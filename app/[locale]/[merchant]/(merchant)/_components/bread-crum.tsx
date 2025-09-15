"use client";

import React from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";

export default function BreadCrumMerchnat() {
  const { locale, merchant } = useParams() as {
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
      label: merchant,
      active: true,
    },
  ];
  return <Breadcrumb items={breadcrumbItems} />;
}

"use client";

import React from "react";
import { useParams } from "next/navigation";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";

export default function BreadCrumOutlet() {
  const { locale, merchant, outlet } = useParams() as {
    locale: string;
    merchant: string;
    outlet: string;
  };

  const breadcrumbItems = [
    {
      label: "Home",
      href: `/${locale}`,
      active: false,
    },
    {
      label: merchant,
      href: `/${locale}/${merchant}`,
      active: false,
    },
    {
      label: outlet,
      active: true,
    },
  ];
  return <Breadcrumb items={breadcrumbItems} />;
}

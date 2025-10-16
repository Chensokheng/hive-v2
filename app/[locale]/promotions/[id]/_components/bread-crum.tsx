"use client";

import React from "react";
import { useParams } from "next/navigation";

import useGetHomePageSection from "@/hooks/use-get-home-page-sections";
import Breadcrumb from "@/components/hive/merchant/breadcrumb";

export default function BreadCrumPromotion() {
  const { locale, id } = useParams() as {
    locale: string;
    id: string;
  };
  const [promotionId] = id.split("-");
  const { data } = useGetHomePageSection();

  const promotion = data?.data.find((item) => item.id === Number(promotionId));

  const breadcrumbItems = [
    {
      label: "Home",
      href: `/${locale}`,
      active: false,
    },
    {
      label: promotion?.title || "",
      active: true,
    },
  ];
  return <Breadcrumb items={breadcrumbItems} />;
}

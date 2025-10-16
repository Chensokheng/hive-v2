import React from "react";

import PromotionPage from "@/components/hive/promotion/promotion-page";

import BreadCrumPromotion from "./_components/bread-crum";

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto py-5 p-5 min-h-[90vh]">
      <BreadCrumPromotion />
      <PromotionPage />
    </div>
  );
}

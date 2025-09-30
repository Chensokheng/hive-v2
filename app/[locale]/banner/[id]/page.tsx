import React from "react";

import BannerPage from "@/components/hive/banner/banner-page";

import BreadCrumBanner from "./_components/bread-crum";

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto py-5 p-5 min-h-[90vh]">
      <BreadCrumBanner />
      <BannerPage />
    </div>
  );
}

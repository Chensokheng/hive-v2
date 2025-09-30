import React from "react";

import { PromotionSections, StoreGrid } from "@/components/hive";
import CategoryGrid from "@/components/hive/category-grid";
import HeroCarousel from "@/components/hive/landing/HeroCarousel";

export default function Page() {
  return (
    <>
      <div className="min-h-[90vh] pb-20">
        <HeroCarousel />
        <div className="max-w-[1300px] mx-auto mt-6">
          <CategoryGrid />
        </div>
        <PromotionSections />
        <div className="max-w-[1200px] mx-auto mt-10">
          <StoreGrid />
        </div>
      </div>
    </>
  );
}

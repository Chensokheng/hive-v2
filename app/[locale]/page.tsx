import React from "react";

import {
  CategoryGrid,
  PromotionSections,
  StoreGrid,
} from "@/components/hive";
import HeroCarousel from "@/components/hive/landing/HeroCarousel";

export default function page() {
  return (
    <div className="w-full min-h-screen">
      <div className="lg:py-5">
        <HeroCarousel />
        <div className="max-w-[1300px] mx-auto mt-6">
          <CategoryGrid />
        </div>
        <PromotionSections />

        <div className="max-w-[1200px] mx-auto mt-10">
          <StoreGrid />
        </div>
      </div>
    </div>
  );
}

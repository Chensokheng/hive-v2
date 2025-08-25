"use client";

import React from "react";
import { DESKTOP_BANNERS } from "@/constants/banners";
import { useQueryState } from "nuqs";

import {
  BannerCarousel,
  BannerSlide,
  CategoryGrid,
  DesktopNav,
  PromotionSections,
  StoreGrid,
} from "@/components/hive-v2";
import { Carousel } from "@/components/hive/landingpage/hero-carousel";
import { MobileNav } from "@/components/mock/mobile-nav";

export default function DesktopPage() {
  const [categoryId] = useQueryState("category", {
    defaultValue: "",
  });
  const renderCustomSlide = (item: any, index: number) => (
    <BannerSlide item={item} index={index} key={index} />
  );

  return (
    <div className="bg-[#F2F6FF] min-h-screen relative overflow-hidden pb-10">
      <DesktopNav />
      <MobileNav />

      <div className="space-y-6 relative">
        {/* Desktop Banner Carousel */}
        <div className="max-w-[1200px] mx-auto mt-6 p-5 md:block hidden">
          <Carousel
            items={DESKTOP_BANNERS}
            height="h-[514px]"
            autoAdvance={true}
            autoAdvanceInterval={5000}
            showArrows={true}
            showDots={true}
            className="rounded-3xl"
            renderSlide={renderCustomSlide}
          />
        </div>

        {/* Mobile Banner Carousel */}
        <div className="md:hidden block">
          <BannerCarousel />
        </div>

        {/* Category Grid */}
        <div className="max-w-[1300px] mx-auto">
          <CategoryGrid />
        </div>

        {/* Background Effects */}
        {/* <BackgroundEffects /> */}
      </div>

      {/* Promotion Sections */}
      {!categoryId && <PromotionSections />}

      {/* Store Grid */}
      <div className="max-w-[1200px] mx-auto mt-10">
        <StoreGrid />
      </div>
    </div>
  );
}

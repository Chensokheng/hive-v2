"use client";

import React from "react";

import {
  BannerCarousel,
  BottomNav,
  CategoryGrid,
  HeaderNav,
  PromotionSections,
  SearchBar,
  StoreGrid,
} from "@/components/hive";

export default function Page() {
  return (
    <div className="w-full max-w-full sm:max-w-md mx-auto min-h-screen bg-[#F2F6FF] py-4 sm:py-5 space-y-4 sm:space-y-6 relative overflow-hidden pb-20">
      {/* Background gradient */}
      <div
        className="
          absolute
          w-[120vw] sm:w-[490px]
          left-[-30vw] sm:left-[-146px]
          top-[-80%]
          bottom-[72.09%]
          bg-[#0055DD]
          opacity-20
          blur-[150px] sm:blur-[200px]
          [transform:matrix(0.14,-0.99,-0.99,-0.14,0,0)]
        "
      />

      {/* Header Navigation */}
      <HeaderNav />

      {/* Search Bar */}
      <SearchBar />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Promotion Sections */}
      <PromotionSections />

      {/* Store Grid */}
      <StoreGrid />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

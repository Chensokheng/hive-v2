"use client";

import React from "react";
import { DESKTOP_BANNERS } from "@/constants/banners";
import { useSearchStore } from "@/store/search";

import { cn } from "@/lib/utils";

import BannerCarousel from "../banner-carousel";
import { BannerSlide } from "../banner-slide";
import { Carousel } from "../carousel";

export default function HeroCarousel() {
  const searchMerchantKeyword = useSearchStore(
    (state) => state.searchMerchantKeyword
  );
  const renderCustomSlide = (item: any, index: number) => (
    <BannerSlide item={item} index={index} key={index} />
  );
  return (
    <div
      className={cn("relative w-full overflow-hidden", {
        hidden: searchMerchantKeyword,
      })}
    >
      <div className="max-w-[1200px] mx-auto hidden lg:block p-2">
        <Carousel
          items={DESKTOP_BANNERS}
          height="h-[514px]"
          autoAdvance={true}
          autoAdvanceInterval={5000}
          showArrows={true}
          showDots={true}
          className="rounded-3xl hidden lg:block"
          renderSlide={renderCustomSlide}
        />
      </div>

      <div className="block lg:hidden">
        <BannerCarousel />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { DESKTOP_BANNERS } from "@/constants/banners";

import BannerCarousel from "../banner-carousel";
import { BannerSlide } from "../banner-slide";
import { Carousel } from "../carousel";

export default function HeroCarousel() {
  const renderCustomSlide = (item: any, index: number) => (
    <BannerSlide item={item} index={index} key={index} />
  );
  return (
    <div className="relative w-full overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
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

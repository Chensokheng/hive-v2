"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSearchStore } from "@/store/search";

import { cn, getImageUrl } from "@/lib/utils";
import useGetBanner from "@/hooks/use-get-banner";
import { Skeleton } from "@/components/ui/skeleton";

import BannerCarousel from "../banner-carousel";
import { BannerSlide } from "../banner-slide";
import { Carousel } from "../carousel";

export default function HeroCarousel() {
  const { data, isLoading } = useGetBanner();
  const { locale } = useParams<{ locale: string }>();

  const searchMerchantKeyword = useSearchStore(
    (state) => state.searchMerchantKeyword
  );
  const renderCustomSlide = (item: any, index: number) => (
    <BannerSlide item={item} index={index} key={index} />
  );

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-44 w-[calc(100vw-3rem)] bg-gray-300 mx-auto lg:hidden rounded-2xl" />
        <div className="max-w-[1200px] mx-auto hidden lg:block p-2">
          <Skeleton className="h-[514px] bg-gray-300 rounded-3xl" />
        </div>
      </>
    );
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden", {
        hidden: searchMerchantKeyword,
      })}
    >
      <div className="max-w-[1200px] mx-auto hidden lg:block p-2">
        <Carousel
          items={
            data?.data?.map((item) => ({
              id: item.id,
              image: getImageUrl(locale === "en" ? item.imageEn : item.image),
              alt: locale === "en" ? item.titleEn : item.title,
              title: locale === "en" ? item.titleEn : item.title,
              description: locale === "en" ? item.subtitleEn : item.subtitle,
              titleColor: item.titleColor,
              descriptionColor: item.subtitleColor,
              ctaButtonTitle: item.ctaButtonTitle,
              ctaButtonTitleColor: item.ctaButtonTitleColor,
              merchants: item.merchants || [],
              ctaButtonUrl: item.ctaButtonUrl || "",
            })) || []
          }
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

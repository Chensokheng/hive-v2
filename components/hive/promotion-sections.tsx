"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSearchStore } from "@/store/search";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useGetHomePageSection from "@/hooks/use-get-home-page-sections";

interface PromotionItem {
  id: string;
  image: string;
  title?: string;
  onClick?: () => void;
  url: string;
}

interface PromotionSectionProps {
  title: string;
  subtitle?: string;
  items?: PromotionItem[];
  hasGradientBackground?: boolean;
}

interface PromotionSectionsProps {
  premiumDelight?: PromotionSectionProps;
  bestDeal?: PromotionSectionProps;
}

function PromotionSection({
  title,
  subtitle,
  items = [],
  hasGradientBackground = false,
}: PromotionSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [_showLeftButton, setShowLeftButton] = useState(false);
  const [_showRightButton, setShowRightButton] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [items]);

  const containerClasses = hasGradientBackground
    ? "bg-[linear-gradient(180deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_50%,rgba(242,246,255,0.7)_100%)] pl-4 pt-7 rounded-xl "
    : "pl-4";
  return (
    <div className={containerClasses}>
      <div className="max-w-[1200px] mx-auto">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-l from-[#FF66CC] to-[#0055DD] bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#303D55]/60 text-sm lg:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center">
              {/* Left Navigation Button - Only show on lg screens and up */}

              {/* <button
                onClick={scrollLeft}
                className=" w-8 h-8 rounded-full transition-all duration-200 cursor-pointer hidden md:flex lg:items-center lg:justify-center"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-8 h-8 text-primary" />
              </button> */}

              {/* Right Navigation Button - Only show on lg screens and up */}

              {/* <button
                onClick={scrollRight}
                className=" w-8 h-8 rounded-full transition-all duration-200 cursor-pointer hidden md:flex lg:items-center lg:justify-center"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-8 h-8 text-primary" />
              </button> */}
            </div>
          </div>

          {/* Promotions Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-3 scroll-smooth snap-x snap-mandatory hide-scroll"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => {
              return (
                <Link
                  href={item.url}
                  className="relative w-[152px] h-[200px] lg:w-[282px] lg:h-[372px] flex-shrink-0 snap-start cursor-pointer hover:scale-95 transition-transform"
                  key={item.id}
                >
                  <AsyncImage
                    src={item.image}
                    Transition={Blur}
                    style={{ width: "100%", height: "100%", borderRadius: 20 }}
                    loader={<div className="bg-gray-300" />}
                  />
                </Link>
              );
            })}
          </div>

          {/* Hide scrollbar styles */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default function PromotionSections() {
  const { locale } = useParams();
  const searchMerchantKeyword = useSearchStore(
    (state) => state.searchMerchantKeyword
  );
  const filterMerchantCategoryId = useSearchStore(
    (state) => state.filterMerchantCategoryId
  );

  const { data, isLoading } = useGetHomePageSection();

  if (isLoading) {
    return (
      <div className="w-full py-8 px-3">
        <div className="max-w-[1200px] mx-auto">
          <div className="space-y-10">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {/* Title Skeleton */}
                <div className="h-8 lg:h-10 w-64 bg-gray-300 rounded-lg animate-pulse" />
                {/* Subtitle Skeleton */}
                <div className="h-4 lg:h-5 w-48 bg-gray-300 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Items Container Skeleton */}
            <div className="flex overflow-x-hidden gap-3">
              {/* Generate 5 skeleton items */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="relative w-[152px] h-[200px] lg:w-[282px] lg:h-[372px] flex-shrink-0 bg-gray-300 rounded-[20px] animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("mt-5 space-y-8", {
        hidden: searchMerchantKeyword || filterMerchantCategoryId,
      })}
    >
      {data?.data?.map((promotion, index) => {
        return (
          <PromotionSection
            {...{
              title: promotion?.title,
              subtitle: promotion?.subtitle,
              hasGradientBackground: index === 0,
              items: promotion?.homepageSectionItems?.map((item) => {
                // Prefetch the promotion page URL
                let url =
                  item.url ||
                  "/" +
                    locale +
                    "/promotions" +
                    "/" +
                    promotion.title.split(" ").join("-") +
                    "/" +
                    `${promotion.id}-${item.id}`;
                if (item.merchants.length === 1) {
                  url =
                    item.merchants[0].outlets.length === 1
                      ? `/${locale}/${item.merchants[0].subDomain}/${item.merchants[0].outlets[0].shortName}`
                      : `/${locale}/${item.merchants[0].subDomain}`;
                }

                return {
                  id: item.id.toString(),
                  image: getImageUrl(item.image),
                  url,
                };
              }),
            }}
            key={promotion.id}
          />
        );
      })}
    </div>
  );
}

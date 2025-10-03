"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSearchStore } from "@/store/search";
import { AsyncImage } from "loadable-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useFoodCategories from "@/hooks/use-food-categories";

import CategoryGridSkeleton from "../loading/categoy-grid-skeleton";

export default function CategoryGrid() {
  const params = useParams();
  const { locale } = params;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const filterMerchantCategoryId = useSearchStore(
    (state) => state.filterMerchantCategoryId
  );
  const setCategoryId = useSearchStore(
    (state) => state.setFilterMerchantCategoryId
  );

  const { data, isLoading } = useFoodCategories();

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

  const handleSelectCategory = (id: number) => {
    if (filterMerchantCategoryId === id.toString()) {
      setCategoryId("");
    } else {
      setCategoryId(id.toString());
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
  }, [data]);

  // Show skeleton loading when data is loading
  if (isLoading) {
    return <CategoryGridSkeleton />;
  }

  return (
    <div className="relative">
      {/* Left Navigation Button */}
      {showLeftButton && (
        <button
          onClick={scrollLeft}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full ransition-all duration-200  items-center justify-center cursor-pointer hidden lg:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </button>
      )}

      {/* Right Navigation Button */}
      {showRightButton && (
        <button
          onClick={scrollRight}
          className=" absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full  transition-all duration-200  items-center justify-center cursor-pointer hidden xl:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 text-primary" />
        </button>
      )}

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-start overflow-x-auto gap-2 pr-8 scroll-smooth snap-x snap-mandatory hide-scroll ml-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {data?.map((item) => (
          <div
            key={item.id}
            className={cn(
              "items-center h-[120px] py-2 w-[105px] lg:w-[148px] lg:h-[106px] flex-shrink-0 flex flex-col snap-start cursor-pointer transition-all sm:hover:bg-primary/5 rounded-lg gap-2 lg:justify-center",
              {
                "bg-primary/10":
                  filterMerchantCategoryId === item.id.toString(), // Keep index === 1 for backward compatibility
              }
            )}
            onClick={() => handleSelectCategory(item.id)}
          >
            <div className="w-13 h-13 relative mx-auto">
              <AsyncImage
                src={getImageUrl(item.image)}
                Transition={Blur}
                style={{ width: "100%", height: "100%", borderRadius: 1000 }}
                loader={<div className="bg-gray-200" />}
              />
            </div>

            <h1 className="text-sm font-medium text-[#161F2F] text-center">
              {locale === "en" ? item.nameEn : item.nameKH}
            </h1>
          </div>
        ))}
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PromotionItem {
  id: string;
  image: string;
  title?: string;
  onClick?: () => void;
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

const defaultPremiumDelight: PromotionSectionProps = {
  title: "Premium Delight",
  subtitle: "Save more when you order",
  hasGradientBackground: true,
  items: [
    { id: "1", image: "/assets/mini/promotion.png" },
    { id: "2", image: "/assets/mini/promotion.png" },
    { id: "3", image: "/assets/mini/promotion.png" },
    { id: "4", image: "/assets/mini/promotion.png" },
    { id: "5", image: "/assets/mini/promotion.png" },
    { id: "6", image: "/assets/mini/promotion.png" },
    { id: "7", image: "/assets/mini/promotion.png" },
  ],
};

const defaultBestDeal: PromotionSectionProps = {
  title: "Best Deal",
  hasGradientBackground: false,
  items: [
    { id: "1", image: "/assets/mini/best-deal.png" },
    { id: "2", image: "/assets/mini/best-deal.png" },
    { id: "3", image: "/assets/mini/best-deal.png" },
    { id: "4", image: "/assets/mini/best-deal.png" },
    { id: "5", image: "/assets/mini/best-deal.png" },
    { id: "6", image: "/assets/mini/best-deal.png" },
    { id: "7", image: "/assets/mini/best-deal.png" },
    { id: "8", image: "/assets/mini/best-deal.png" },
    { id: "9", image: "/assets/mini/best-deal.png" },
    { id: "10", image: "/assets/mini/best-deal.png" },
  ],
};

function PromotionSection({
  title,
  subtitle,
  items = [],
  hasGradientBackground = false,
}: PromotionSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

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
    ? "bg-[linear-gradient(180deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_50%,rgba(242,246,255,0.7)_100%)] pl-4 pt-7 rounded-xl"
    : "pl-4";

  return (
    <div className={containerClasses}>
      <div className="w-auto lg:max-w-[1200px] mx-auto">
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

              <button
                onClick={scrollLeft}
                className=" w-8 h-8 rounded-full transition-all duration-200 cursor-pointer hidden md:flex lg:items-center lg:justify-center"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-8 h-8 text-primary" />
              </button>

              {/* Right Navigation Button - Only show on lg screens and up */}

              <button
                onClick={scrollRight}
                className=" w-8 h-8 rounded-full transition-all duration-200 cursor-pointer hidden md:flex lg:items-center lg:justify-center"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-8 h-8 text-primary" />
              </button>
            </div>
          </div>

          {/* Promotions Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-3 lg:gap-6 scroll-smooth snap-x snap-mandatory hide-scroll"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item) => (
              <div
                className="relative w-[152px] h-[200px] lg:w-[282px] lg:h-[372px] flex-shrink-0 snap-start cursor-pointer hover:scale-95 transition-transform"
                key={item.id}
                onClick={item.onClick}
              >
                <Image
                  src={item.image}
                  alt={item.title || "promotion"}
                  fill
                  className="object-cover rounded-lg"
                />
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
      </div>
    </div>
  );
}

export default function PromotionSections({
  premiumDelight = defaultPremiumDelight,
  bestDeal = defaultBestDeal,
}: PromotionSectionsProps) {
  return (
    <div className="mt-5 space-y-8">
      <PromotionSection {...premiumDelight} />
      <PromotionSection {...bestDeal} />
    </div>
  );
}

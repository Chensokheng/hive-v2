"use client";

import React from "react";
import Image from "next/image";

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
  ],
};

const defaultBestDeal: PromotionSectionProps = {
  title: "Best Deal",
  hasGradientBackground: false,
  items: [
    { id: "1", image: "/assets/mini/best-deal.png" },
    { id: "2", image: "/assets/mini/best-deal.png" },
    { id: "3", image: "/assets/mini/best-deal.png" },
  ],
};

function PromotionSection({
  title,
  subtitle,
  items = [],
  hasGradientBackground = false,
}: PromotionSectionProps) {
  const containerClasses = hasGradientBackground
    ? "bg-[linear-gradient(180deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_50%,rgba(242,246,255,0.7)_100%)] pl-4 pt-7 rounded-xl"
    : "px-4";

  return (
    <div className={containerClasses}>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-l from-[#FF66CC] to-[#0055DD] bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && <p className="text-[#303D55]/60 text-sm">{subtitle}</p>}
      </div>
      <div className="flex overflow-x-auto gap-3 mt-4 scroll-smooth snap-x snap-mandatory hide-scroll">
        {items.map((item) => (
          <div
            className="relative w-[152px] h-[200px] flex-shrink-0 snap-start cursor-pointer hover:scale-105 transition-transform"
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

import React from "react";
import { flashSaleItems } from "@/fake/restaurant-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PromotionCard from "./promotion-card";

export default function SpecialPromotion() {
  const scrollLeft = () => {
    const container = document.getElementById("special-promotion-container");
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("special-promotion-container");
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold ">
          🎉{" "}
          <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
            Special Promotion
          </span>
        </h2>
        <div className="flex items-center gap-2 ">
          <ChevronLeft
            className="cursor-pointer hover:text-blue-600 transition-colors"
            onClick={scrollLeft}
          />
          <ChevronRight
            className="cursor-pointer hover:text-blue-600 transition-colors"
            onClick={scrollRight}
          />
        </div>
      </div>

      <div
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
        id="special-promotion-container"
      >
        {flashSaleItems.map((item) => (
          <PromotionCard
            key={item.id}
            {...item}
            expireBgColor="bg-gradient-to-r from-[rgba(51,136,255,0.1)] to-[rgba(255,255,255,0.1)]]"
            expireTextColor="text-primary"
          />
        ))}
      </div>

      <style jsx>{`
        #special-promotion-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

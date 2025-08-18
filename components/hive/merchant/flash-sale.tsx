import React from "react";
import { flashSaleItems } from "@/fake/restaurant-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PromotionCard from "./promotion-card";

export default function FlashSale() {
  const scrollLeft = () => {
    const container = document.getElementById("flash-sale-container");
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("flash-sale-container");
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold ">
          ⚡️{" "}
          <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
            Flash Sale
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
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-2"
        id="flash-sale-container"
      >
        {flashSaleItems.map((item) => (
          <PromotionCard
            key={item.id}
            {...item}
            expireBgColor="bg-gradient-to-r from-[rgba(255,87,87,0.1)] to-[rgba(255,255,255,0.1)]"
            expireTextColor="text-[#EC0000]"
          />
        ))}
      </div>

      <style jsx>{`
        #flash-sale-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

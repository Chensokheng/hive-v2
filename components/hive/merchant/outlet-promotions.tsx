"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetOutletPromotions from "@/hooks/use-get-outlet-promotions";
import { Skeleton } from "@/components/ui/skeleton";

import PromotionDetailsModal from "./promotion-details-modal";
import SetPromotionCard from "./set-promotion-card";

export default function OutletPromotions() {
  const { merchant, outlet } = useParams();
  const { data: outletInfo, isLoading: isOutletLoading } = useGetOutletInfo(
    merchant as string,
    outlet as string,
    null,
    null
  );

  const { data, isLoading } = useGetOutletPromotions(
    Number(outletInfo?.data.id)
  );

  const [selectedPromotion, setSelectedPromotion] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollLeft = () => {
    const container = document.getElementById("outlet-promotions-container");
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("outlet-promotions-container");
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleAddClick = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  if (isLoading || isOutletLoading) {
    return (
      <div className="px-4 space-y-5 mt-5">
        <Skeleton className=" h-10 w-30 bg-gray-300" />

        <div></div>
        <Skeleton className=" h-40 w-96 bg-gray-300" />
      </div>
    );
  }

  if (!data?.data || data?.data.length === 0) {
    return <></>;
  }

  const filteredPromotions = data?.data.filter(
    (promotion) =>
      promotion.type === "COMBO" || promotion.type === "BUY_GET_FREE"
  );

  if (filteredPromotions.length === 0) {
    return <></>;
  }

  return (
    <>
      <div className="space-y-5 mt-5">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold ">
            🎁{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF0080] bg-clip-text text-transparent">
              Special Promotions
            </span>
          </h2>
          {filteredPromotions.length > 2 && (
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
          )}
        </div>

        <div
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-2"
          id="outlet-promotions-container"
        >
          {filteredPromotions.map((promotion) => {
            return (
              <SetPromotionCard
                key={promotion.id}
                id={promotion.id}
                title={promotion.nameEn}
                totalItems={promotion.usageLimit}
                remainingItems={promotion.usageLimit - promotion.usageCount}
                image={promotion.image}
                expiryTime={promotion.endTime || ""}
                expireBgColor="bg-gradient-to-r from-[rgba(255,107,0,0.1)] to-[rgba(255,255,255,0.1)]"
                expireTextColor="text-[#FF6B00]"
                isUsed={
                  promotion.maxUsagePerUser !== null &&
                  promotion.maxUsagePerUser !== undefined
                    ? promotion.usageCount >= promotion.usageLimit
                    : false
                }
                onClick={() => handleCardClick(promotion)}
                onAddClick={() => handleAddClick(promotion)}
              />
            );
          })}
        </div>

        <style jsx>{`
          #outlet-promotions-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {selectedPromotion && (
        <PromotionDetailsModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          promotionType={selectedPromotion.type}
          title={selectedPromotion.nameEn}
          image={selectedPromotion.image}
          requiredProducts={selectedPromotion.requiredProducts || []}
          freeProducts={selectedPromotion.freeProducts || []}
          levels={selectedPromotion.levels || []}
          promotionProducts={selectedPromotion.promotionProducts || []}
          outletId={outletInfo?.data.id || 0}
        />
      )}
    </>
  );
}

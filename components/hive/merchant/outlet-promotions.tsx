"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useGetOrderPromotionCampaign from "@/hooks/use-get-order-promotion-campaign";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetOutletPromotions from "@/hooks/use-get-outlet-promotions";
import { Skeleton } from "@/components/ui/skeleton";

import OrderPromotionCard from "./order-promotion-card";
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

  const { data: orderPromotionData, isLoading: isOrderPromotionLoading } =
    useGetOrderPromotionCampaign(Number(outletInfo?.data.id));

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

  if (isLoading || isOutletLoading || isOrderPromotionLoading) {
    return (
      <div className="px-4 space-y-5 mt-5">
        <Skeleton className=" h-10 w-30 bg-gray-300" />

        <div></div>
        <Skeleton className=" h-40 w-96 bg-gray-300" />
      </div>
    );
  }

  const filteredPromotions =
    data?.data?.filter(
      (promotion) =>
        promotion.type === "COMBO" || promotion.type === "BUY_GET_FREE"
    ) || [];

  const orderPromotionCampaigns = orderPromotionData?.status
    ? orderPromotionData.data || []
    : [];

  // Show nothing if there are no promotions at all
  if (filteredPromotions.length === 0 && orderPromotionCampaigns.length === 0) {
    return <></>;
  }

  const totalPromotions =
    filteredPromotions.length + orderPromotionCampaigns.length;

  return (
    <>
      <div className="space-y-5 mt-5">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold ">
            🎁{" "}
            <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
              Special Promotions
            </span>
          </h2>
          {totalPromotions > 2 && (
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
          className="flex gap-2 lg:gap-5 overflow-x-auto scrollbar-hide pb-4 px-2"
          id="outlet-promotions-container"
        >
          {/* Order Promotion Campaign Cards */}
          {orderPromotionCampaigns.map((campaign) => {
            const discountedProduct = campaign.discounted_products?.[0];
            if (!discountedProduct) return null;

            return (
              <OrderPromotionCard
                key={`order-promo-${campaign.id}`}
                id={campaign.id}
                title={campaign.name_en || campaign.name}
                description={campaign.description_en || campaign.description}
                image={discountedProduct.menu_item.thumbnail_image_name}
                minBillAmount={campaign.min_bill_amount}
                freeItemName={discountedProduct.menu_item.name}
                freeItemPrice={discountedProduct.menu_item.base_price}
                quantity={discountedProduct.qty_per_usage}
                expiryTime={campaign.end_date || ""}
              />
            );
          })}

          {/* Regular Promotions (COMBO and BUY_GET_FREE) */}
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

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useGetGlashSale from "@/hooks/use-get-flash-sale";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Skeleton } from "@/components/ui/skeleton";

import PromotionCard from "./promotion-card";

export default function FlashSale() {
  const { merchant, outlet } = useParams();
  const { data: user } = useGetUserInfo();
  const { data: outletInfo, isLoading: isOutletLoading } = useGetOutletInfo(
    merchant as string,
    outlet as string,
    null,
    null
  );

  const { data, isLoading } = useGetGlashSale(
    Number(user?.userId),
    Number(outletInfo?.data.id)
  );

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
  if (isLoading || isOutletLoading) {
    return (
      <div className="px-4 space-y-5 mt-5">
        <Skeleton className=" h-10 w-30 bg-gray-300" />

        <div></div>
        <Skeleton className=" h-40 w-96 bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold ">
          ⚡️{" "}
          <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
            Flash Sale
          </span>
        </h2>
        {data?.data.items.length && data?.data.items.length! > 2 && (
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
        id="flash-sale-container"
      >
        {data?.data.items.map((item) => (
          <PromotionCard
            key={item.id}
            id={item.id.toString()}
            title={item.name}
            currentPrice={
              item.activated_custom_discounted_product?.selling_price || 0
            }
            originalPrice={item.base_price}
            currency={"$"}
            localCurrency={"៛"}
            localPrice={
              (item.activated_custom_discounted_product?.selling_price || 0) *
              4000
            }
            totalItems={
              item.activated_custom_discounted_product?.usage_limit || 0
            }
            remainingItems={
              (item.activated_custom_discounted_product?.usage_limit || 0) -
              (item.activated_custom_discounted_product?.total_used || 0)
            }
            image={item.thumbnail_image_name}
            discountPercentage={
              (item.activated_custom_discounted_product?.usage_limit || 0) -
              (item.activated_custom_discounted_product?.total_used || 0)
            }
            expiryTime={
              item.activated_custom_discounted_product?.end_date || ""
            }
            category={item.name}
            expireBgColor="bg-gradient-to-r from-[rgba(255,87,87,0.1)] to-[rgba(255,255,255,0.1)]"
            expireTextColor="text-[#EC0000]"
            outletId={outletInfo?.data.id}
            menuItemId={item.id}
            hasAddOn={item.hasAddon}
            isUsed={
              item.activated_custom_discounted_product?.max_usage_per_user ===
              item.activated_custom_discounted_product?.user_total_used
            }
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

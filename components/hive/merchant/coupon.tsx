"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetPromotionCode from "@/hooks/use-get-promotion-code";
import { Skeleton } from "@/components/ui/skeleton";

export interface CouponData {
  id: string;
  discount: string;
  minSpend: string;
  title: string;
  description?: string;
  expiryDate: string;
  code?: string;
  type: "discount" | "cashback" | "freebie";
  isExpired?: boolean;
  isUsed?: boolean;
}

export function CouponSection({ className }: { className?: string }) {
  const t = useTranslations();
  const { merchant, outlet } = useParams();

  const { data: outletInfo, isLoading: outletLoading } = useGetOutletInfo(
    merchant as string,
    outlet as string,
    null,
    null
  );

  const { data: promotionCodes, isLoading } = useGetPromotionCode(
    outletInfo?.data.id as number,
    outletInfo?.data.merchant_id as number
  );

  if (isLoading || outletLoading) {
    return (
      <div className="rounded-2xl py-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48 bg-gray-200" />
        </div>
        <div className="flex gap-5">
          <Skeleton className="h-21 w-40 bg-gray-300" />
          <Skeleton className="h-21 w-40 bg-gray-300" />
          <Skeleton className="h-21 w-40 bg-gray-300" />{" "}
        </div>
      </div>
    );
  }

  if (promotionCodes?.data.length === 0) {
    return <></>;
  }

  return (
    <div className={cn("rounded-2xl py-4 px-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold ">
          🔥{" "}
          <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
            {t("merchant.promotion.availableCoupons")}
          </span>
        </h2>
      </div>

      <div
        className=" flex gap-5 overflow-x-auto scrollbar-hide pb-4 items-center"
        id="coupon-container"
      >
        {promotionCodes?.data.map((coupon) => {
          return (
            <div className="flex items-center" key={coupon.id}>
              <div className="w-26 bg-primary text-white h-20 rounded-lg rounded-e-none flex flex-col items-center justify-center relative border-r border-dashed border-white">
                <span className="text-xl font-bold">
                  {" "}
                  {coupon.min_required_subtotal}
                </span>
                <span className="text-xs">
                  {" "}
                  {t("merchant.promotion.minSpend")}{" "}
                  {coupon.min_required_subtotal}
                </span>

                <div className="h-4 w-4 absolute -top-3 -right-2 bg-primary-bg rounded-full"></div>
                <div className="h-4 w-4 absolute -bottom-3 -right-2 bg-primary-bg rounded-full"></div>
              </div>
              <div className="w-48 h-20 bg-primary/10 rounded-e-lg p-5 gap-2 grid place-content-center">
                <h1 className="text-sm font-bold bg-gradient-to-l from-blue-500 from-[13.16%] to-blue-700 bg-clip-text text-transparent">
                  {coupon.name}
                </h1>
                <div className="flex text-xs gap-2">
                  <span className="text-[#303D55]/60 font-medium">
                    {t("merchant.promotion.expireOn")}
                  </span>
                  <span className="text-red-600 font-medium">
                    {coupon.valid_to
                      ? new Date(coupon.valid_to).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        #coupon-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

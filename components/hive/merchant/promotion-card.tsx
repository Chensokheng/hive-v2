import React from "react";
import Image from "next/image";
import { FlashSaleItem } from "@/fake/restaurant-data";
import { Plus } from "lucide-react";

interface PromotionCardProps {
  title?: string;
  currentPrice?: number;
  originalPrice?: number;
  currency?: string;
  localCurrency?: string;
  localPrice?: number;
  totalItems?: number;
  remainingItems?: number;
  image?: string;
  expireBgColor?: string;
  expireTextColor?: string;
}

export default function PromotionCard({
  title = "Menu Title",
  currentPrice = 2.5,
  originalPrice = 4,
  currency = "$",
  localCurrency = "៛",
  localPrice = 10000,
  totalItems = 100,
  remainingItems = 50,
  image = "/fake/promotions.png",
  expiryTime = "6d 10h 46m 5s",
  expireBgColor = "bg-gradient-to-r from-[rgba(255,87,87,0.1)] to-[rgba(255,255,255,0.1)]",
  expireTextColor = "text-[#EC0000]",
}: FlashSaleItem & PromotionCardProps) {
  // Calculate progress percentage
  const progressPercentage =
    totalItems > 0 ? ((totalItems - remainingItems) / totalItems) * 100 : 0;

  return (
    <div className="h-auto flex items-center relative w-[95%]">
      <div className="w-64 h-full bg-white rounded-s-xl">
        <div className={`py-1 px-3 ${expireBgColor} rounded-t-xl`}>
          <span className={`text-xs font-semibold ${expireTextColor}`}>
            Expire in: {expiryTime}
          </span>
        </div>
        <div className="px-4">
          <h1 className="text-[#161F2F] font-semibold">{title}</h1>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">
                {currency}
                {currentPrice}
              </span>
              <span className="text-[#303D55]/60 line-through">
                {currency}
                {originalPrice}
              </span>
            </div>
            <span className="text-xs font-medium text-[#363F4F]/60">
              ≈{localPrice.toLocaleString()}
              {localCurrency}{" "}
            </span>
          </div>

          {/* Progress bar and item counter */}
          <div className="mt-2 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-medium text-[#363F4F]">
              <span>{totalItems} items</span>
              <span>{remainingItems} items left</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-38 relative">
        <Image
          src={image}
          alt="promotion-card"
          fill
          className="object-cover rounded-e-xl"
        />
        <div className=" absolute top-3 right-3 h-9 w-9 rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer">
          <Plus className="text-primary" />
        </div>
      </div>
    </div>
  );
}

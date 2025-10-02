import React, { useEffect, useState } from "react";
import { FlashSaleItem } from "@/fake/restaurant-data";
import { useOutletStore } from "@/store/outlet";
import { AsyncImage } from "loadable-image";
import { Plus } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";

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
  expiryDate?: Date | string | number; // Accept Date object, ISO string, or timestamp
  outletId?: number;
  menuItemId?: number;
  hasAddOn?: boolean;
  isUsed?: boolean;
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
  expiryDate,
  expireBgColor = "bg-gradient-to-r from-[rgba(255,87,87,0.1)] to-[rgba(255,255,255,0.1)]",
  expireTextColor = "text-[#EC0000]",
  outletId,
  menuItemId,
  hasAddOn = false,
  isUsed = false,
}: FlashSaleItem & PromotionCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const setSelectedOutletMenu = useOutletStore(
    (state) => state.setSelectedOutletMenu
  );
  const { data: user } = useGetUserInfo();

  // Handle add to cart click
  const handleAddToCart = () => {
    if (!user?.userId) {
      document.getElementById("auth-trigger-dialog")?.click();
      return;
    }

    if (!outletId || !menuItemId) {
      console.warn("OutletId or MenuItemId is missing for add to cart");
      return;
    }

    // Create menu item object similar to outlet-menu-card
    const menuItem = {
      id: menuItemId,
      image: getImageUrl(image),
      name: title,
      hasAddOn: hasAddOn,
      price: originalPrice,
      promotionPrice: currentPrice,
      isCustomDiscounted: true,
    };

    setSelectedOutletMenu(menuItem, outletId);
  };

  // Function to format time remaining
  const formatTimeLeft = (milliseconds: number): string => {
    if (milliseconds <= 0) return "Expired";

    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  };

  // Function to parse expiryTime string format like "6d 10h 46m 5s"
  const parseExpiryTimeString = (timeString: string): Date | null => {
    const regex = /(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s)?/;
    const match = timeString.match(regex);

    if (!match) return null;

    const days = parseInt(match[1] || "0");
    const hours = parseInt(match[2] || "0");
    const minutes = parseInt(match[3] || "0");
    const seconds = parseInt(match[4] || "0");

    const now = new Date();
    const targetDate = new Date(
      now.getTime() +
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000
    );

    return targetDate;
  };

  // Calculate countdown
  useEffect(() => {
    let targetDate: Date | null = null;

    // Priority 1: Use expiryDate if provided
    if (expiryDate) {
      targetDate = new Date(expiryDate);
    }
    // Priority 2: Try to parse expiryTime as date string
    else if (expiryTime) {
      // First try to parse as date string (from API)
      const parsedDate = new Date(expiryTime);
      if (!isNaN(parsedDate.getTime())) {
        targetDate = parsedDate;
      }
      // If not a valid date, try to parse as time format "6d 10h 46m 5s"
      else {
        targetDate = parseExpiryTimeString(expiryTime);
      }
    }

    // If no valid target date found, show static text
    if (!targetDate) {
      setTimeLeft(expiryTime);
      setIsExpired(false);
      return;
    }

    const targetTime = targetDate.getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        setIsExpired(true);
        return;
      }

      setTimeLeft(formatTimeLeft(difference));
      setIsExpired(false);
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiryDate, expiryTime]);

  // Calculate progress percentage
  const progressPercentage =
    totalItems > 0 ? ((totalItems - remainingItems) / totalItems) * 100 : 0;

  return (
    <div
      className={cn("h-auto flex items-center relative w-[95%]", {
        "opacity-65": isUsed,
      })}
    >
      <div className="w-64 h-full bg-white rounded-s-xl pb-1">
        <div
          className={`py-1 px-3 ${isExpired ? "bg-gradient-to-r from-[rgba(128,128,128,0.1)] to-[rgba(255,255,255,0.1)]" : expireBgColor} rounded-t-xl`}
        >
          <span
            className={`text-xs font-semibold ${isExpired ? "text-gray-500" : expireTextColor}`}
          >
            {isExpired ? "Expired" : `Expire in: ${timeLeft}`}
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
        <AsyncImage
          src={getImageUrl(image)}
          alt={title}
          className="object-cover rounded-e-xl"
          Transition={Blur}
          style={{
            width: "100%",
            height: "100%",
          }}
          loader={<div className="bg-gray-300" />}
        />

        {!isUsed && (
          <div
            className=" absolute top-3 right-3 h-9 w-9 rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <Plus className="text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

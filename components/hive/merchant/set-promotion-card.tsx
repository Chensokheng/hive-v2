"use client";

import React, { useEffect, useState } from "react";
import { AsyncImage } from "loadable-image";
import { Plus } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";

interface SetPromotionCardProps {
  id: number;
  title: string;
  image: string;
  totalItems: number;
  remainingItems: number;
  expiryTime?: string;
  expireBgColor?: string;
  expireTextColor?: string;
  isUsed?: boolean;
  onClick?: () => void;
  onAddClick?: () => void;
}

export default function SetPromotionCard({
  title,
  image,
  totalItems,
  remainingItems,
  expiryTime,
  expireBgColor = "bg-gradient-to-r from-[rgba(255,107,0,0.1)] to-[rgba(255,255,255,0.1)]",
  expireTextColor = "text-[#FF6B00]",
  isUsed = false,
  onClick,
  onAddClick,
}: SetPromotionCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

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

  // Calculate countdown
  useEffect(() => {
    if (!expiryTime) {
      setTimeLeft("");
      setIsExpired(false);
      return;
    }

    const parsedDate = new Date(expiryTime);
    if (isNaN(parsedDate.getTime())) {
      setTimeLeft("");
      setIsExpired(false);
      return;
    }

    const targetTime = parsedDate.getTime();

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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  // Calculate progress percentage
  const progressPercentage =
    totalItems > 0 ? ((totalItems - remainingItems) / totalItems) * 100 : 0;

  return (
    <div
      className={cn(
        "h-auto flex items-center relative w-[95%] cursor-pointer",
        {
          "opacity-65": isUsed,
        }
      )}
      onClick={onClick}
    >
      <div className="w-64 h-full bg-white rounded-s-xl pb-2">
        {expiryTime && (
          <div
            className={`py-1 px-3 ${isExpired ? "bg-gradient-to-r from-[rgba(128,128,128,0.1)] to-[rgba(255,255,255,0.1)]" : expireBgColor} rounded-t-xl`}
          >
            <span
              className={`text-xs font-semibold ${isExpired ? "text-gray-500" : expireTextColor}`}
            >
              {isExpired ? "Expired" : `Expire in: ${timeLeft}`}
            </span>
          </div>
        )}
        <div className="px-4 pt-2">
          <h1 className="text-[#161F2F] font-semibold line-clamp-2">{title}</h1>

          {/* Progress bar and item counter */}
          <div className="mt-3 space-y-2">
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
          loader={<div className="bg-gray-300 h-full w-full" />}
        />

        {!isUsed && (
          <div
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
          >
            <Plus className="text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

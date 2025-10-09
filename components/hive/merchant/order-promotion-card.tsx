"use client";

import React, { useEffect, useState } from "react";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";

interface OrderPromotionCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  minBillAmount: number;
  freeItemName: string;
  freeItemPrice: number;
  quantity: number;
  expiryTime?: string;
  onClick?: () => void;
}

export default function OrderPromotionCard({
  id,
  title,
  description,
  image,
  minBillAmount,
  freeItemName,
  freeItemPrice,
  quantity,
  expiryTime,
  onClick,
}: OrderPromotionCardProps) {
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

  return (
    <div
      className={cn(
        "h-auto flex items-center relative w-[95%] cursor-pointer",
        {
          "opacity-65": isExpired,
        }
      )}
      onClick={onClick}
    >
      <div className="w-64 h-full bg-white rounded-s-xl pb-2">
        {expiryTime && (
          <div
            className={`py-1 px-3 ${
              isExpired
                ? "bg-gradient-to-r from-[rgba(128,128,128,0.1)] to-[rgba(255,255,255,0.1)]"
                : "bg-gradient-to-r from-[rgba(34,197,94,0.1)] to-[rgba(255,255,255,0.1)]"
            } rounded-t-xl`}
          >
            <span
              className={`text-xs font-semibold ${
                isExpired ? "text-gray-500" : "text-green-600"
              }`}
            >
              {isExpired ? "Expired" : `Expire in: ${timeLeft}`}
            </span>
          </div>
        )}
        <div className="px-4 pt-2 space-y-2">
          <h1 className="text-[#161F2F] font-semibold line-clamp-2">{title}</h1>

          {/* Promotion details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">Spend</span>
              <span className="text-sm font-bold text-primary">
                ${minBillAmount.toFixed(0)}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              Get{" "}
              <span className="font-semibold text-green-600">
                {quantity}x {freeItemName}
              </span>{" "}
              FREE
            </div>
            <div className="text-xs text-gray-500">
              (Worth ${freeItemPrice.toFixed(2)})
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
      </div>
    </div>
  );
}

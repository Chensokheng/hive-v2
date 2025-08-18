"use client";

import React from "react";

import { cn } from "@/lib/utils";

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

interface CouponProps {
  coupon: CouponData;
  className?: string;
  onClick?: (coupon: CouponData) => void;
}

export function Coupon({ coupon, className, onClick }: CouponProps) {
  const isDisabled = coupon.isExpired || coupon.isUsed;

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center">
      <div className="w-26 bg-primary text-white h-20 rounded-lg rounded-e-none flex flex-col items-center justify-center relative border-r border-dashed border-white">
        <span className="text-xl font-bold"> {coupon.discount}</span>
        {coupon.minSpend && (
          <span className="text-xs"> Min.spend {coupon.minSpend}</span>
        )}
        <div className="h-4 w-4 absolute -top-3 -right-2 bg-primary-bg rounded-full"></div>
        <div className="h-4 w-4 absolute -bottom-3 -right-2 bg-primary-bg rounded-full"></div>
      </div>
      <div className="w-48 h-20 bg-primary/10 rounded-e-lg grid place-content-center p-5 gap-2">
        <h1 className="text-sm font-bold bg-gradient-to-l from-blue-500 from-[13.16%] to-blue-700 bg-clip-text text-transparent">
          {coupon.title}
        </h1>
        <div className="flex text-xs gap-2">
          <span className="text-[#303D55]/60 font-medium">Expire on:</span>
          <span className="text-red-600 font-medium">{coupon.expiryDate}</span>
        </div>
      </div>
    </div>
  );
}

interface CouponSectionProps {
  coupons: CouponData[];
  title?: string;
  className?: string;
  onCouponClick?: (coupon: CouponData) => void;
  maxVisible?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export function CouponSection({
  coupons,
  title = "Available Coupons",
  className,
  onCouponClick,
  showViewAll = true,
  onViewAll,
}: CouponSectionProps) {
  if (!coupons || coupons.length === 0) {
    return null;
  }

  return (
    <div className={cn("rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold ">
          🔥{" "}
          <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
      </div>

      <div className="space-y-3 flex gap-5 overflow-x-auto scrollbar-hide pb-4">
        {coupons.map((coupon) => (
          <Coupon key={coupon.id} coupon={coupon} onClick={onCouponClick} />
        ))}
      </div>
    </div>
  );
}

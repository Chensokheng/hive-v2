import React from "react";

export default function CartItemCheckoutSkeleton() {
  return (
    <div className="w-full flex items-center gap-4 pt-4 pb-4 animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square w-14">
        <div className="w-full h-full bg-muted rounded-lg" />
      </div>

      {/* Content skeleton */}
      <div className="flex items-center justify-between flex-1 flex-col sm:flex-row gap-2">
        <div className="space-y-2 w-full sm:w-auto">
          {/* Item name skeleton */}
          <div className="h-5 bg-muted rounded w-32" />
          {/* Item note skeleton */}
          <div className="h-4 bg-muted rounded w-24" />
        </div>

        {/* Quantity controls skeleton */}
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-muted h-7 w-7" />
          <div className="h-5 bg-muted rounded w-4" />
          <div className="rounded-full bg-muted h-7 w-7" />
        </div>
      </div>

      {/* Price skeleton */}
      <div className="space-y-1">
        <div className="h-5 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-20" />
      </div>
    </div>
  );
}

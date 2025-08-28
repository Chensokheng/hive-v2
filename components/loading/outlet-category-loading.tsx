import React from "react";

import { Skeleton } from "../ui/skeleton";

export default function OutletCategoryLoading() {
  return (
    <div className="w-full space-y-4  border p-2">
      {/* Search Input Skeleton */}
      <div className="relative">
        <Skeleton className="h-12 w-full rounded-full" />
      </div>

      {/* Horizontal Category Chips Skeleton */}
      <div className="flex items-center gap-3">
        {/* Dropdown indicator skeleton */}
        <Skeleton className="flex-shrink-0 w-10 h-10 rounded-full" />

        {/* Scrollable category chips skeleton */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[80, 100, 90, 110, 85].map((width, index) => (
            <Skeleton
              key={index}
              className="flex-shrink-0 h-8 rounded-full"
              style={{ width: `${width}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

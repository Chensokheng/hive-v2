import React from "react";
import { breadcrumbItems } from "@/fake/restaurant-data";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";

export default function Loading() {
  return (
    <div className=" bg-primary-bg min-h-screen">
      <div className=" max-w-[900px] mx-auto">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="bg-white lg:rounded-2xl overflow-hidden lg:mb-8 shadow-sm lg:border border-gray-100 max-w-[900px] mx-auto">
        {/* Hero Image Skeleton */}
        <div className="relative w-full h-48 md:h-64 bg-gray-200 animate-pulse">
          {/* Logo positioned over hero image */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full animate-pulse border-4 border-white shadow-lg" />
          </div>
        </div>

        {/* Restaurant Info Skeleton */}
        <div className="p-6 pt-10 space-y-2">
          <div className="flex items-center justify-between">
            {/* Restaurant Name Skeleton */}
            <div className="h-8 md:h-9 bg-gray-200 rounded animate-pulse w-48" />

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
              <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Location Skeleton */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>

          {/* Additional Info Skeleton (for future rating/status) */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

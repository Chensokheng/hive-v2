"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletCategory from "@/hooks/use-get-outlet-category";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import SearchIcon from "@/components/icon/search";

interface CategoryItem {
  id: string;
  label: string;
  count?: number;
}

interface CategorySidebarProps {
  className?: string;
  isMobile: boolean;
  outletName: string;
  merchantName: string;
}

export default function CategorySidebar({
  className,
  outletName,
  merchantName,
  isMobile,
}: CategorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );
  const { data: categories } = useGetOutletCategory(foundOutlet?.id!);

  if (isLoading) {
    // Mobile skeleton loading
    if (isMobile) {
      return (
        <div className="w-full space-y-4 bg-white border p-2">
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

    // Desktop skeleton loading
    return (
      <div
        className={cn(
          "w-full lg:w-80 rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-6 lg:h-fit",
          className
        )}
      >
        {/* Search Input Skeleton */}
        <div className="relative mb-6">
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {/* Category List Skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-12 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!foundOutlet?.id && isLoading) {
    return redirect("/404");
  }

  // Mobile horizontal layout

  if (isMobile) {
    return (
      <div className="w-full space-y-4 bg-white border p-2">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5">
            <SearchIcon />
          </div>
          <Input
            type="text"
            placeholder="Search in menu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white border h-12 rounded-full text-gray-500"
          />
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-3">
          {/* Dropdown indicator (optional) */}
          <button className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>

          {/* Scrollable category chips */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories?.map((category) => (
              <button
                key={category.id}
                // onClick={() => onCategoryChange?.(category.id
                className={cn(
                  "flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category.nameEN}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop vertical layout
  return (
    <div
      className={cn(
        "w-full lg:w-80 rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-6 lg:h-fit",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4">
          <SearchIcon />
        </div>
        <Input
          type="text"
          placeholder="Search in menu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 h-12 rounded-full"
        />
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {categories?.map((category) => (
          <button
            key={category.id}
            // onClick={() => onCategoryChange?.(category.id)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl transition-colors text-sm cursor-pointer font-semibold",
              // activeCategory === category.id
              //   ? "bg-primary/10 text-primary  rounded-full"
              "text-[#161F2F] hover:bg-gray-50"
            )}
          >
            <div className="flex justify-between items-center">
              <span>{category.nameEN}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

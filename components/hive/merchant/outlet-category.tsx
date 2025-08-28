"use client";

import React, { useRef, useState } from "react";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletCategory from "@/hooks/use-get-outlet-category";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";
import OutletCategoryLoading from "@/components/loading/outlet-category-loading";

interface OutletCategoryProps {
  className?: string;
  outletName: string;
  merchantName: string;
}

export default function OutletCategory({
  className,
  outletName,
  merchantName,
}: OutletCategoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const atTopRef = useRef(false);

  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );
  const { data: categories } = useGetOutletCategory(foundOutlet?.id!);
  const [isSticky, setIsSticky] = useState(false);

  const elementRef = useRef<HTMLDivElement | null>(null);

  if (isLoading) {
    return <OutletCategoryLoading />;
  }

  if (!foundOutlet?.id && isLoading) {
    return redirect("/404");
  }

  // Mobile horizontal layout

  return (
    <>
      <div
        className=" sticky top-10 lg:top-0 z-30  bg-primary-bg/70 lg:bg-primary-bg/70  backdrop-blur-md "
        ref={elementRef}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="w-full space-y-4  p-2  ">
            {/* Search Input */}
            <div>
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
                  onFocus={() => {
                    const current = document.getElementById("outlet-page");
                  }}
                />
              </div>
            </div>

            {/* Horizontal Category Chips */}
            <div className="flex items-center gap-3 ">
              {/* Dropdown indicator (optional) */}

              {/* Scrollable category chips */}
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                <button
                  // onClick={() => onCategoryChange?.(category.id
                  className={cn(
                    "flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    "bg-primary text-white hover:bg-primary/80 cursor-pointer"
                  )}
                >
                  {"All"}
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    // onClick={() => onCategoryChange?.(category.id
                    className={cn(
                      "flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                      "bg-gray-200 border text-gray-700 hover:bg-gray-200 cursor-pointer border-zinc-400"
                    )}
                  >
                    {category.nameEN}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useOutletStore } from "@/store/outlet";
import autoAnimate from "@formkit/auto-animate";

import { cn } from "@/lib/utils";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletCategory from "@/hooks/use-get-outlet-category";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

export default function OutletCategoryMobile() {
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };
  const [searchQuery, setSearchQuery] = useState("");

  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchant);
  const setCategoryId = useOutletStore((state) => state.setCategoryId);
  const categoryId = useOutletStore((state) => state.categoryId);

  const foundOutlet = merchantInfo?.find((item) => item.shortName === outlet);
  const { data: categories } = useGetOutletCategory(foundOutlet?.id!);

  // Filter categories based on search query
  const filteredCategories = categories?.filter((category) =>
    category.nameEN.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);

    return () => {};
  }, [parent]);

  return (
    <>
      <div className="bg-white block lg:hidden my-3 w-full sticky top-14 z-50">
        <div className="px-3 py-3 space-y-5">
          <div className="w-full relative">
            <Input
              className=" rounded-full bg-[#EBEFF7] shadow-none w-full pl-12 py-5"
              placeholder="Search in menu"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className=" absolute top-3 left-4">
              <SearchIcon />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide w-full">
          <div
            ref={parent}
            className="flex gap-3.5 items-center snap-x snap-mandatory pb-2 px-3 min-w-max"
          >
            <div
              className={cn(
                "px-3 py-2 bg-[#0055DD1A]  rounded-full font-bold whitespace-nowrap snap-start flex-shrink-0",
                {
                  "bg-[#0055DD1A] text-primary": !categoryId,
                }
              )}
              onClick={() => setCategoryId(null)}
            >
              All
            </div>
            {filteredCategories?.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "cursor-pointer hover:bg-gray-200 py-2 px-3 rounded-full transition-all font-bold whitespace-nowrap snap-start flex-shrink-0",
                  {
                    "bg-[#0055DD1A] text-primary": categoryId === category.id,
                  }
                )}
                onClick={() => setCategoryId(category.id)}
              >
                {category.nameEN}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

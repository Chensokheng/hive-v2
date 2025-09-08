"use client";

import React, { useState } from "react";

import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletCategory from "@/hooks/use-get-outlet-category";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

interface OutletCategoryProps {
  className?: string;
  outletName: string;
  merchantName: string;
}

export default function OutletCategoryMobile({
  className,
  outletName,
  merchantName,
}: OutletCategoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );
  const { data: categories } = useGetOutletCategory(foundOutlet?.id!);

  // if (isLoading) {
  //   return <OutletCategoryLoading />;
  // }

  // if (!foundOutlet?.id && isLoading) {
  //   return redirect("/404");
  // }

  // Mobile horizontal layout

  return (
    <>
      <div className="bg-white block lg:hidden my-3 w-full">
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
          <div className="flex gap-3.5 items-center snap-x snap-mandatory pb-2 px-3 min-w-max">
            <div className="px-3 py-2 bg-[#0055DD1A] text-primary rounded-full font-bold whitespace-nowrap snap-start flex-shrink-0">
              All
            </div>
            {categories?.map((category) => (
              <div
                key={category.id}
                className="cursor-pointer hover:bg-gray-200 py-2 px-3 rounded-full transition-all font-bold whitespace-nowrap snap-start flex-shrink-0"
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

"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOutletStore } from "@/store/outlet";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletCategory from "@/hooks/use-get-outlet-category";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import SearchIcon from "@/components/icon/search";

export default function OutletCategorySidebar() {
  const t = useTranslations();
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };

  const categoryId = useOutletStore((state) => state.categoryId);
  const setCategoryId = useOutletStore((state) => state.setCategoryId);
  const setSearchMenu = useOutletStore((state) => state.setSearchMenu);

  const { data: merchantInfo } = useGetMerchantInfo(merchant);

  const foundOutlet = merchantInfo?.find((item) => item.shortName === outlet);
  const { data: categories, isLoading } = useGetOutletCategory(
    foundOutlet?.id!
  );

  // Filter categories based on search query
  const [parent] = useAutoAnimate();

  const handleChange = useDebouncedCallback((value: string) => {
    setSearchMenu(value);
    document
      .getElementById("outlet-menu")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 300);

  return (
    <div className="w-[230px] py-7 sticky top-15 self-start h-fit  hidden lg:block">
      <div className="w-full relative">
        <Input
          className=" rounded-full bg-white shadow-none w-full pl-12 py-5"
          placeholder={t("merchant.outlet.searchInMenu")}
          onChange={(e) => handleChange(e.target.value)}
        />
        <div className=" absolute top-3 left-4">
          <SearchIcon />
        </div>
      </div>
      <div
        className={cn(
          "font-bold px-4 py-2.5  rounded-full mt-6 mb-2 cursor-pointer transition-all hover:bg-sky-100",
          {
            "bg-[#0055DD1A] text-primary": !categoryId,
          }
        )}
        onClick={() => setCategoryId(null)}
      >
        {t("merchant.outlet.all")}
      </div>
      {isLoading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-10 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      )}

      <div className="space-y-2" ref={parent}>
        {categories?.map((category) => (
          <div
            key={category.id}
            className={cn(
              "font-bold text-[##161F2F] px-4 py-2.5 hover:bg-sky-100 rounded-full cursor-pointer transition-all",
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
  );
}

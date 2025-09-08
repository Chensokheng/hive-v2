import React, { useState } from "react";

import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletCategory from "@/hooks/use-get-outlet-category";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

export default function OutletCategorySidebar({
  merchantName,
  outletName,
}: {
  merchantName: string;
  outletName: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );
  const { data: categories } = useGetOutletCategory(foundOutlet?.id!);

  // Filter categories based on search query
  const filteredCategories = categories?.filter((category) =>
    category.nameEN.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[282px] py-7 sticky top-15 self-start h-fit  hidden lg:block">
      <div className="w-full relative">
        <Input
          className=" rounded-full bg-white shadow-none w-full pl-12 py-5"
          placeholder="Search in menu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className=" absolute top-3 left-4">
          <SearchIcon />
        </div>
      </div>
      <div className="font-bold text-primary px-4 py-2.5 bg-[#0055DD1A] rounded-full mt-6 mb-2">
        All
      </div>

      <div className="space-y-2">
        {filteredCategories?.map((category) => (
          <div
            key={category.id}
            className="font-bold text-[##161F2F] px-4 py-2.5 hover:bg-sky-100 rounded-full cursor-pointer"
          >
            {category.nameEN}
          </div>
        ))}
      </div>
    </div>
  );
}

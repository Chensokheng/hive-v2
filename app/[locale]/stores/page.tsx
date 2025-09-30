import React from "react";

import { StoreGrid } from "@/components/hive";
import SearchMerchant from "@/components/hive/landing/search-merchant";

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto py-10 min-h-screen space-y-5">
      <div className="px-3">
        <SearchMerchant />
      </div>
      <StoreGrid hidetitle={true} />
    </div>
  );
}

import React from "react";

import { PromotionSections, StoreGrid } from "@/components/hive";
import CategoryGrid from "@/components/hive/category-grid";
import Checkout from "@/components/hive/checkout";
import HeroCarousel from "@/components/hive/landing/HeroCarousel";
import OutletNearBy from "@/components/hive/outlet-near-by";
import RecentOrder from "@/components/hive/recent-order";

export default function Page() {
  return (
    <>
      <div className="min-h-[90vh] pb-20">
        <HeroCarousel />
        <div className="max-w-[1300px] mx-auto mt-6">
          <CategoryGrid />
        </div>
        <PromotionSections />
        <RecentOrder />
        <OutletNearBy />
        <div className="max-w-[1200px] mx-auto mt-10" id="home-page-stores">
          <StoreGrid hidetitle={false} />
        </div>
        <Checkout />
      </div>
    </>
  );
}

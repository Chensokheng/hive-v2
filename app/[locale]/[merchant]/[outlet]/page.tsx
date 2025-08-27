"use client";

import React, { use, useState } from "react";
import {
  breadcrumbItems,
  heroCarouselImages,
  merchantCoupons,
} from "@/fake/restaurant-data";

import { BottomNav } from "@/components/hive";
import { Carousel } from "@/components/hive/carousel";
import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import CategorySidebar from "@/components/hive/merchant/category-sidebar";
import { CouponSection } from "@/components/hive/merchant/coupon";
import FlashSale from "@/components/hive/merchant/flash-sale";
import Menus from "@/components/hive/merchant/menus";
import MerchantHeader from "@/components/hive/merchant/merchant-header";
import SpecialPromotion from "@/components/hive/merchant/special-promotion";

export default function MerchantPage({
  params,
}: {
  params: Promise<{ locale: string; merchant: string; outlet: string }>;
}) {
  const { locale, merchant, outlet } = use(params);
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <div className="min-h-screen bg-primary-bg pb-20">
        <div className="max-w-[1400px] mx-auto lg:py-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <CategorySidebar
                outletName={outlet}
                merchantName={merchant}
                isMobile={false}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Breadcrumb */}
              <div className="hidden lg:block">
                <Breadcrumb items={breadcrumbItems} />
              </div>
              {/* Merchant Header */}
              <MerchantHeader
                locale={locale}
                merchantName={merchant}
                outletName={outlet}
              />

              {/* Mobile Category Sidebar - Only shown on mobile */}
              <div className="lg:hidden mb-6">
                <CategorySidebar
                  outletName={outlet}
                  merchantName={merchant}
                  isMobile={true}
                />
              </div>

              <div className="p-2 lg:p-0">
                <Carousel
                  items={heroCarouselImages}
                  height="h-[200px] md:h-[400px]"
                  arrowClassName="bg-custom-tranparent-dark backdrop-blur-xl"
                  autoAdvance={true}
                  autoAdvanceInterval={5000}
                  className="rounded-lg"
                />
              </div>

              {/* Coupon Section */}
              <div className="p-2 lg:p-0 mt-6">
                <CouponSection
                  coupons={merchantCoupons}
                  title="Available Deals"
                  onCouponClick={(coupon) => {
                    console.log("Coupon clicked:", coupon);
                    // Handle coupon click - could open modal, copy code, etc.
                  }}
                />
              </div>
              <div className="space-y-5">
                <FlashSale />
                <SpecialPromotion />
              </div>

              <div className="mt-5 space-y-3">
                <Menus merchantName={merchant} outletName={outlet} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

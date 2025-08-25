"use client";

import React, { use, useState } from "react";
import {
  breadcrumbItems,
  categories,
  heroCarouselImages,
  merchantCoupons,
  merchantData,
} from "@/fake/restaurant-data";

import { Carousel } from "@/components/hive/carousel";
import AddMenuToCart from "@/components/hive/merchant/add-menu-to-cart";
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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <div className="min-h-screen bg-primary-bg">
        <div className="max-w-[1400px] mx-auto lg:py-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <CategorySidebar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Breadcrumb */}
              <div className="hidden lg:block">
                <Breadcrumb items={breadcrumbItems} />
              </div>
              {/* Merchant Header */}
              <MerchantHeader {...merchantData} />

              {/* Mobile Category Sidebar - Only shown on mobile */}
              <div className="lg:hidden mb-6">
                <CategorySidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
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
                <h1 className="font-bold text-black text-lg px-2">For You</h1>
                <Menus />
              </div>
              <AddMenuToCart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

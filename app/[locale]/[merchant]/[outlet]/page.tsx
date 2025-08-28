"use client";

import React, { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  breadcrumbItems,
  heroCarouselImages,
  merchantCoupons,
} from "@/fake/restaurant-data";
import { ChevronLeft } from "lucide-react";

import Auth from "@/components/hive/auth";
import { Carousel } from "@/components/hive/carousel";
import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import { CouponSection } from "@/components/hive/merchant/coupon";
import FlashSale from "@/components/hive/merchant/flash-sale";
import Menus from "@/components/hive/merchant/menus";
import MerchantHeader from "@/components/hive/merchant/merchant-header";
import OutletCategory from "@/components/hive/merchant/outlet-category";
import SpecialPromotion from "@/components/hive/merchant/special-promotion";

export default function MerchantPage({
  params,
}: {
  params: Promise<{ locale: string; merchant: string; outlet: string }>;
}) {
  const { locale, merchant, outlet } = use(params);

  const router = useRouter();

  return (
    <>
      <div
        className=" sticky top-0 w-full  z-50 h-10 bg-white lg:hidden"
        id="outlet-page"
      >
        <div
          className="flex py-2 items-center  lg:hidden"
          onClick={() => {
            router.back();
          }}
        >
          <ChevronLeft />
          <h1 className="flex-1 text-center font-bold text-lg">SeolahCafe</h1>
        </div>
      </div>
      <div className="min-h-screen bg-primary-bg  pb-20">
        <div className="p-5 border-b mb-2  items-center  justify-between hidden lg:flex">
          <div className="h-10 w-[5.875rem] relative">
            <Image src={"/assets/logo.png"} alt="logo" fill />
          </div>
          <Auth />
        </div>
        <div className=" max-w-[900px] mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <MerchantHeader
            locale={locale}
            merchantName={merchant}
            outletName={outlet}
          />
        </div>

        <OutletCategory outletName={outlet} merchantName={merchant} />

        <div className="max-w-[900px] mx-auto lg:py-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-4">
              {/* Mobile Category Sidebar - Only shown on mobile */}

              {/* Coupon Section */}
              <div className="p-2 lg:p-0 mt-6">
                <CouponSection
                  coupons={merchantCoupons}
                  title="Available Deals"
                  onCouponClick={(coupon) => {
                    console.log("Coupon clicked:", coupon);
                  }}
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
    </>
  );
}

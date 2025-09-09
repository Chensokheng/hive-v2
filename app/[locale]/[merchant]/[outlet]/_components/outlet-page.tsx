"use client";

import React from "react";
import { useParams } from "next/navigation";
import { heroCarouselImages, merchantCoupons } from "@/fake/restaurant-data";
import { BreadcrumbItem } from "@/types";

import { Carousel } from "@/components/hive/carousel";
import Checkout from "@/components/hive/checkout";
import AddMenuToCart from "@/components/hive/merchant/add-menu-to-cart";
import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import { CouponSection } from "@/components/hive/merchant/coupon";
import FlashSale from "@/components/hive/merchant/flash-sale";
import Menus from "@/components/hive/merchant/menus";
import MerchantHeader from "@/components/hive/merchant/merchant-header";
import OutletCategoryMobile from "@/components/hive/merchant/outlet-category-mobile";
import OutletCategorySidebar from "@/components/hive/merchant/outlet-category-sidebar";
import OutletNavbar from "@/components/hive/merchant/outlet-navbar";
import SpecialPromotion from "@/components/hive/merchant/special-promotion";

export default function OutletPage() {
  const { locale, merchant, outlet } = useParams() as {
    locale: string;
    merchant: string;
    outlet: string;
  };

  const items: BreadcrumbItem[] = [
    {
      label: "Home",
      href: `/`,
      active: false,
    },
    {
      label: merchant,
      href: `/${merchant}`,
      active: false,
    },
    {
      label: outlet,
      active: true,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-primary-bg  pb-20">
        <OutletNavbar outletName={outlet} />
        <div className="max-w-[1200px] lg:flex  justify-center lg:justify-between t mx-auto gap-10 ">
          <OutletCategorySidebar merchantName={merchant} outletName={outlet} />
          <div className="">
            <div className=" max-w-[900px] mx-auto lg:not-only-of-type:py-6">
              <Breadcrumb items={items} />
              <MerchantHeader
                locale={locale}
                merchantName={merchant}
                outletName={outlet}
              />
            </div>

            <div className="max-w-[900px] mx-auto">
              <OutletCategoryMobile
                outletName={outlet}
                merchantName={merchant}
              />
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-4">
                  {/* Mobile Category Sidebar - Only shown on mobile */}

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
            <Checkout merchantName={merchant} outletName={outlet} />
            <AddMenuToCart />
          </div>
        </div>
      </div>
    </>
  );
}

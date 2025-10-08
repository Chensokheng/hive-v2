import React from "react";

import AuthDialog from "@/components/hive/auth/auth-dialog";
import Checkout from "@/components/hive/checkout";
import EditMenuCartItem from "@/components/hive/checkout/edit-menu-cart-item";
import { CouponSection } from "@/components/hive/merchant/coupon";
import FlashSale from "@/components/hive/merchant/flash-sale";
import HappyHour from "@/components/hive/merchant/happy-hour";
import OutletCategoryMobile from "@/components/hive/merchant/outlet-category-mobile";
import OutletCategorySidebar from "@/components/hive/merchant/outlet-category-sidebar";
import OutletHeader from "@/components/hive/merchant/outlet-header";
import OutletMenu from "@/components/hive/merchant/outlet-menu";
import OutletMenuToCart from "@/components/hive/merchant/outlet-menu-to-cart";
import OutletMobileNav from "@/components/hive/merchant/outlet-mobile-nav";
import OutletPromotions from "@/components/hive/merchant/outlet-promotions";

import BreadCrumOutlet from "./_components/bread-crum";

export async function generateStaticParams() {
  return [];
}

export default function page() {
  return (
    <>
      <div className="min-h-screen bg-primary-bg  pb-20 relative">
        <OutletMobileNav />
        <div className="max-w-[1200px] lg:flex  justify-center lg:justify-between t mx-auto gap-10">
          <OutletCategorySidebar />
          <div className="flex-1">
            <div className=" w-full max-w-[900px] mx-auto  min-h-scren lg:py-6">
              <BreadCrumOutlet />
              <OutletHeader />
              <OutletCategoryMobile />
              <CouponSection />
              <OutletPromotions />
              <HappyHour />
              <FlashSale />
              <OutletMenu />
            </div>
          </div>
        </div>
      </div>
      <AuthDialog>
        <div></div>
      </AuthDialog>
      <OutletMenuToCart />
      <EditMenuCartItem />
      <Checkout />
    </>
  );
}

import React from "react";

import OutletCategorySidebar from "@/components/hive/merchant/outlet-category-sidebar";
import OutletHeader from "@/components/hive/merchant/outlet-header";

import BreadCrumOutlet from "./_components/bread-crum";

export async function generateStaticParams() {
  return [];
}

export default function page() {
  return (
    <>
      <div className="min-h-screen bg-primary-bg  pb-20 relative">
        <div className="max-w-[1200px] lg:flex  justify-center lg:justify-between t mx-auto gap-10">
          <OutletCategorySidebar />
          <div className="flex-1">
            <div className=" w-full max-w-[900px] mx-auto  h-[2000px] lg:py-6">
              <BreadCrumOutlet />
              <OutletHeader />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

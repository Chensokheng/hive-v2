"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { BreadcrumbItem } from "@/types";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import useGetMerchantOutlets from "@/hooks/use-get-merchant-outlets";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { BottomNav } from "@/components/hive";
import Auth from "@/components/hive/auth";
import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import MapIcon from "@/components/icon/map";
import MerchantOutletsSkeleton from "@/components/loading/merchant-outlet-skeleton";

export default function Page() {
  const t = useTranslations();

  const pathname = usePathname();

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: pathname.split("/")[1], href: pathname, active: true },
  ];

  const isInitialLoading = useRef(true);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);

  const { data: user } = useGetUserInfo();

  const {
    data: merchantOutlets,
    isLoading,
    refetch,
  } = useGetMerchantOutlets(pathname.split("/")[1], lat, lng);

  useEffect(() => {
    setLat(user?.latitude!);
    setLng(user?.longtitude!);
  }, [user?.latitude, user?.longtitude]);

  useEffect(() => {
    if (isInitialLoading.current) {
      isInitialLoading.current = false;
      return;
    }
    refetch();
  }, [lat, lng]);

  return (
    <div className=" bg-primary-bg min-h-screen ">
      <nav className="px-5 py-[1.125rem] bg-white flex items-center justify-between gap-10 xl:gap-50 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] z-[50] sticky top-0 w-full">
        <div className="flex items-center gap-7">
          <div className="h-10 w-[5.875rem] relative hidden lg:block">
            <Image src={"/assets/logo.png"} alt="logo" fill />
          </div>

          <div className="flex-1 flex gap-2 sm:gap-3 items-center cursor-pointer">
            <div className="h-10 w-10 bg-[#FF66CC]/10 rounded-full grid place-content-center">
              <MapPin color="#FF66CC" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[#303D55]/60 text-xs font-medium">
                {t("nav.deliveryAddress")}
              </h2>
              <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate">
                {t("nav.enterDeliveryAddress")}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Section */}

        <Auth />
      </nav>
      {/* main */}
      <main className="max-w-[1200px] mx-auto py-6 px-4 sm:p-0">
        <Breadcrumb items={breadcrumbItems} />
        {isLoading ? (
          <MerchantOutletsSkeleton />
        ) : (
          <>
            <h1 className="text-[##161F2F] text-2xl font-bold">
              {merchantOutlets?.marchantName}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-5 ">
              {merchantOutlets?.outlets.map((outlet, index) => {
                return (
                  <Link
                    href={pathname + "/" + outlet.shortName}
                    key={index}
                    className=" w-full md:max-w-[384px] bg-white p-5  rounded-2xl space-y-3 hover:shadow-sm transition-all"
                  >
                    <Image
                      src={outlet.image}
                      alt={outlet.name}
                      width={72}
                      height={72}
                      className="rounded-full"
                    />
                    <h1 className="text-[#161F2F] text-xl font-semibold">
                      {outlet.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <MapIcon />
                      <span>{outlet.distance / 1000} km away</span>
                      <span className="flex-1 text-[#303D5599]">
                        {outlet.address_en.slice(0, 25)}...
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

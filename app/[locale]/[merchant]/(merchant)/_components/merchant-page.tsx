"use client";

import React from "react";
import { useParams } from "next/navigation";

import useGetMerchantOutlets from "@/hooks/use-get-merchant-outlets";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import ListOutlets from "@/components/hive/merchant/list-outlets";
import SearchIcon from "@/components/icon/search";

export default function MerchantPage({
  merchantName,
}: {
  merchantName: string;
}) {
  const { locale } = useParams();

  const breadcrumbItems = [
    {
      label: "Home",
      href: `/${locale}`,
      active: false,
    },
    {
      label: merchantName,
      active: true,
    },
  ];
  const { data: user, isLoading: LoadingUser } = useGetUserInfo();
  const { data: merchantData, isLoading } = useGetMerchantOutlets(
    merchantName,
    user?.latitude,
    user?.longtitude,
    !LoadingUser
  );

  if (isLoading) {
    return (
      <div className="min-h-[90vh]">
        <div className="max-w-[1200px] mx-auto py-5 px-5">
          <div className="lg:flex items-center gap-2 hidden">
            <Skeleton className="w-10 h-3 bg-gray-300" />/{" "}
            <Skeleton className="w-20 h-3 bg-gray-300" />
          </div>
          <Skeleton className=" w-48 h-8 bg-gray-300 lg:mt-8" />

          <div className="relative z-10 flex-1 max-w-[384px] my-6">
            <Input
              className="bg-white rounded-full shadow-none h-10 w-full pl-10"
              placeholder="Search branch"
            />
            <div className="absolute top-3  left-4  cursor-pointer">
              <SearchIcon />
            </div>
          </div>
          <div className="grid  grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 w-full">
            <Skeleton className="w-full lg:max-w-[384px] h-44 bg-gray-200" />
            <Skeleton className="w-full lg:max-w-[384px] h-44 bg-gray-200" />
            <Skeleton className="w-full lg:max-w-[384px] h-44 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-[90vh]">
        <div className="max-w-[1200px] mx-auto py-5 p-5">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className=" text-2xl font-bold mb-6">{merchantName}</h1>
          <ListOutlets
            data={merchantData?.outlets || []}
            merchant={merchantName}
          />
        </div>
      </div>
    </div>
  );
}

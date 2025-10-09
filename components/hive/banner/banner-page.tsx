"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { getImageUrl } from "@/lib/utils";
import useGetBanner from "@/hooks/use-get-banner";
import { Skeleton } from "@/components/ui/skeleton";
import MapPin from "@/components/icon/map-pin";

export default function BannerPage() {
  const { data, isLoading } = useGetBanner();
  const { id, locale } = useParams() as { id: string; locale: string };

  if (isLoading) {
    return (
      <div className="space-y-12">
        {/* Header skeleton */}
        <div className="space-y-5">
          <Skeleton className="h-8 w-64 bg-gray-300" />
          <Skeleton className="h-5 w-96 bg-gray-300" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-[6px]">
              {/* Image skeleton */}
              <Skeleton className="w-full aspect-[3/2] rounded-2xl" />

              {/* Content skeleton */}
              <div className="px-2 lg:px-5 py-2 space-y-2">
                <Skeleton className="h-5 lg:h-6 w-3/4 bg-gray-300" />

                {/* Location skeleton */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full bg-gray-300" />
                  <Skeleton className="h-4 w-20 bg-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const banner = data?.data.find((item) => item.id === Number(id));

  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <h1 className="text-[#161F2F] text-2xl font-bold">{banner?.title}</h1>
        <p className="text-[#161F2F] font-normal">{banner?.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3  gap-2 lg:gap-6">
        {banner?.merchants.map((merchant) => (
          <Link
            href={"/" + locale + "/" + merchant.subDomain}
            key={merchant.id}
            className="bg-white rounded-2xl p-[6px] hover:shadow-md transition-shadow"
          >
            <div className="relative w-full aspect-[3/2]">
              <AsyncImage
                src={getImageUrl(merchant.image)}
                Transition={Blur}
                style={{ width: "100%", height: "100%", borderRadius: 20 }}
                loader={<div className="bg-gray-300" />}
              />
            </div>
            <div className="px-2 lg:px-5 py-2">
              <h3 className="font-semibold text-[#161F2F] lg:text-lg">
                {merchant.name}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin color="#FF66CC" />
                <span className="text-sm text-[#303D55]/60">
                  {merchant.address.districtEn}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

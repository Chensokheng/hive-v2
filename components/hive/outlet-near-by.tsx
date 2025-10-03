"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { getImageUrl } from "@/lib/utils";
import useGetOutletNearby from "@/hooks/use-get-outlet-nearby";
import useGetUserInfo from "@/hooks/use-get-user-info";

import MapPin from "../icon/map-pin";

export default function OutletNearBy() {
  const { locale } = useParams();
  const { data: user, isLoading: isLoadingUser } = useGetUserInfo();
  const { data, isLoading } = useGetOutletNearby(
    user?.latitude! ||
      (typeof window !== "undefined"
        ? Number(sessionStorage.getItem("lat"))
        : 0)!,
    user?.longtitude! ||
      (typeof window !== "undefined"
        ? Number(sessionStorage.getItem("lng"))
        : 0)!,
    ""
  );

  if (isLoading || isLoadingUser) {
    return (
      <>
        <div className="max-w-[1200px] mx-auto mt-10 px-2 space-y-5">
          <h1 className="text-3xl font-bold ">
            <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
              Nearby
            </span>
          </h1>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            <div className="bg-card rounded-2xl p-[6px] flex-shrink-0 w-64">
              {/* Image skeleton */}
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl bg-gray-300 animate-pulse" />

              <div className="px-2 lg:px-5 py-2 space-y-2">
                {/* Title skeleton */}
                <div className="h-5 lg:h-6 bg-gray-300 rounded animate-pulse w-3/4" />

                {/* Location skeleton */}
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted flex-shrink-0" />
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!data?.data.items.length) {
    return <></>;
  }

  return (
    <div className="max-w-[1200px] mx-auto mt-10 px-2 space-y-5">
      <h1 className="text-xl lg:text-3xl font-bold ">
        <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
          Nearby
        </span>
      </h1>
      <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
        {data?.data.items.map((item) => {
          return (
            <Link
              href={`${locale}/${item.sub_domain}`}
              key={item.id}
              className="bg-white rounded-2xl p-[6px] hover:shadow-md transition-shadow flex-shrink-0 w-1/2 sm:w-72"
            >
              <div className="relative w-full aspect-[3/2]">
                <AsyncImage
                  src={getImageUrl(item.image)}
                  Transition={Blur}
                  style={{ width: "100%", height: "100%", borderRadius: 20 }}
                  loader={<div className="bg-gray-300" />}
                />
              </div>
              <div className="px-2 lg:px-5 py-2">
                <h3 className="font-semibold text-[#161F2F] lg:text-lg">
                  {item.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1">
                  <MapPin color="#FF66CC" />
                  <span className="text-sm text-[#303D55]/60">
                    {item.distance} km
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

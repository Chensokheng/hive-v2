"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOutletStore } from "@/store/outlet";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { getImageUrl } from "@/lib/utils";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Skeleton } from "@/components/ui/skeleton";
import MapIcon from "@/components/icon/map";

import OutletBanner from "./outlet-banner";
import OutletWorkingHour from "./outlet-working-hour";

export default function OutletHeader() {
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };

  const { data: user, isLoading: isLoadingUser } = useGetUserInfo();

  const getSessionStorageValue = (key: string): number | null => {
    if (typeof window !== "undefined") {
      const value = sessionStorage.getItem(key);
      return value ? Number(value) : null;
    }
    return null;
  };
  const { data, isLoading, isEnabled } = useGetOutletInfo(
    merchant,
    outlet,
    user?.latitude || getSessionStorageValue("lat") || 0,
    user?.longtitude || getSessionStorageValue("lng") || 0
  );
  const setCheckoutNotes = useOutletStore((state) => state.setCheckoutNotes);

  useEffect(() => {
    return () => {
      setCheckoutNotes({
        addressNote: "",
        storeNote: "",
      });
    };
  }, []);

  if (!isLoading && !data?.status) {
    return <h1>Outlet Not Found</h1>;
  }

  return (
    <div className="bg-white md:rounded-2xl overflow-hidden border w-full">
      <OutletBanner outletId={data?.data?.id!} />
      <AsyncImage
        src={getImageUrl(data?.data?.outlet_images?.[0]?.image_name || "")}
        Transition={Blur}
        style={{ width: 80, height: 80, borderRadius: 10000 }}
        loader={<div className="bg-gray-300" />}
        className="shadow top-[-40px] left-4 absolute border-4 border-white object-center object-cover"
      />
      <div className="relative h-auto pt-2">
        {(isLoading && isEnabled) || isLoadingUser ? (
          <div className="relative left-4 space-y-3 w-full">
            <Skeleton className="h-6 w-3/4 bg-gray-300" />
            <Skeleton className="h-4 w-1/2 bg-gray-300" />
            <Skeleton className="h-4 w-1/2 bg-gray-300" />
          </div>
        ) : (
          <div className="relative pl-4 -top-5 space-y-3 pr-2">
            <h1 className="text-2xl font-bold">{data?.data?.name}</h1>
            <div className="text-sm text-[#303D5599] flex gap-2 flex-wrap">
              <MapIcon />
              <span className="text-[#161F2F]">
                {data?.data?.distance} km -
              </span>
              <span>
                {data?.data?.address?.address +
                  " " +
                  data?.data?.address?.district +
                  " " +
                  data?.data?.address?.ward +
                  " " +
                  data?.data?.address?.city}
              </span>
            </div>
            <OutletWorkingHour merchantName={merchant} outletName={outlet} />
          </div>
        )}
      </div>
    </div>
  );
}

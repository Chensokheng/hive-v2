"use client";

import React from "react";

import { getImageUrl } from "@/lib/utils";
import useGetOutletNanner from "@/hooks/use-get-outlet-banner";
import { Skeleton } from "@/components/ui/skeleton";

import { Carousel } from "../carousel";

export default function OutletBanner({ outletId }: { outletId: number }) {
  const { data, isLoading, isFetching, isEnabled } =
    useGetOutletNanner(outletId);

  if (isLoading || isFetching || !isEnabled) {
    return (
      <Skeleton className="w-full h-[184px] lg:h-[280px] lg:rounded-lg bg-gray-300" />
    );
  }

  const images = data?.data.map((item) => ({
    id: item.id,
    image: getImageUrl(item.image),
    alt: item.name,
  }));

  return (
    <div>
      {images?.length && images?.length > 0 ? (
        <Carousel
          showArrows={false}
          items={images || []}
          height="h-[184px] lg:h-[280px]"
          arrowClassName="bg-custom-tranparent-dark backdrop-blur-xl"
          autoAdvance={true}
          autoAdvanceInterval={5000}
          className="lg:rounded-lg w-full border-none"
          imageClassName="border-none"
        />
      ) : (
        <>
          {isEnabled && (
            <div className=" h-[184px] lg:h-[280px] w-full flex items-center justify-center border-b-[0.1px]">
              <div className="border w-40 h-40 lg:rounded-lg border-dashed grid place-content-center">
                <h1 className=" text-7xl text-gray-300">H</h1>
              </div>
            </div>
          )}{" "}
        </>
      )}
    </div>
  );
}

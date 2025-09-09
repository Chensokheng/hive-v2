import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import { Button } from "@/components/ui/button";
import HeartIcon from "@/components/icon/heart";
import MapIcon from "@/components/icon/map";
import ShareIcon from "@/components/icon/share";

export default function MerchantHeader({
  locale,
  merchantName,
  outletName,
}: {
  locale: string;
  merchantName: string;
  outletName: string;
}) {
  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);

  const outlet = merchantInfo?.find(
    (outlet) => outlet.shortName === outletName
  );

  return (
    <div className="bg-white md:rounded-2xl overflow-hidden border">
      {/* Hero Image */}
      <div className="relative w-full h-48 md:h-[240px]">
        {outlet?.banner ? (
          <Image
            src={outlet?.banner || outlet?.image || "/assets/logo.png"}
            alt={outlet?.name || "outlet"}
            fill
            className={cn("object-center object-cover")}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center  blur-2xl grayscale"></div>
        )}

        {/* Logo positioned over hero image */}
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 md:w-24 md:h-24 relative">
            {outlet?.image && (
              <Image
                src={outlet?.image || ""}
                alt={`${outlet?.name} logo`}
                fill
                className="object-cover border-4 border-white shadow-lg rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="p-6 pt-10 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
            {outlet?.name}
          </h1>
          {/* Action Buttons */}
          <div>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-white/50 shadow-none cursor-pointer"
            >
              <HeartIcon />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm border-white/50 shadow-none cursor-pointer"
            >
              <ShareIcon />
            </Button>
          </div>
        </div>

        {/* Rating and Category */}
        {/* <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span className="text-sm font-medium text-gray-900 ml-1">
              {rating}
            </span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-primary text-sm">{category}</span>
        </div> */}

        {/* Location */}
        <div className="flex items-center gap-2 ">
          <MapIcon />
          <span className="text-sm text-gray-600">
            {locale.toLowerCase() === "en"
              ? outlet?.addressEn
              : outlet?.addressKh}
          </span>
        </div>

        {/* Status */}
        {/* <div className="flex items-center gap-2">
          <ClockIcon />
          <span
            className={`text-sm ${
              status === "Open" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </span>
          {closingTime && status === "Open" && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-600">Close {closingTime}</span>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
}

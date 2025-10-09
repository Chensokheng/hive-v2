"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { getImageUrl } from "@/lib/utils";
import useGetHomePageSection from "@/hooks/use-get-home-page-sections";
import MapPin from "@/components/icon/map-pin";

export default function PromotionPage() {
  const { id, locale } = useParams() as { id: string; locale: string };

  const [promotionId, itemId] = id.split("-");

  const { data } = useGetHomePageSection();

  const promotion = data?.data.find((item) => item.id === Number(promotionId));
  const merchants = promotion?.homepageSectionItems.find(
    (item) => item.id === Number(itemId)
  );

  return (
    <div>
      <div className="space-y-12">
        <div className="space-y-5">
          <h1 className="text-[#161F2F] text-2xl font-bold">
            {promotion?.title}
          </h1>
          <p className="text-[#161F2F] font-normal">{promotion?.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3  gap-2 lg:gap-6">
          {merchants?.merchants.map((merchant) => (
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
    </div>
  );
}

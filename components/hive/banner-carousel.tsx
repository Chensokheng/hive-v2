"use client";

import React from "react";
import { useParams } from "next/navigation";
import { rowdies } from "@/fonts";
import { Link } from "@/i18n/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useGetBanner from "@/hooks/use-get-banner";

import { Skeleton } from "../ui/skeleton";

export default function BannerCarousel() {
  const { data, isLoading } = useGetBanner();
  const { locale } = useParams();
  if (isLoading) {
    return (
      <Skeleton className="h-44 w-[calc(100vw-3rem)] bg-gray-300 mx-auto" />
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pr-16 scroll-smooth snap-x snap-mandatory hide-scroll ml-5 ">
      {data?.data.map((banner) => {
        return (
          <div key={banner.id}>
            <div className="h-44 w-[calc(100vw-3rem)] sm:w-[calc(448px-3rem)] flex-shrink-0 relative snap-start">
              <AsyncImage
                src={getImageUrl(banner.image)}
                Transition={Blur}
                style={{ width: "100%", height: 176, borderRadius: 16 }}
                loader={<div className="bg-gray-300" />}
              />
              <div className="absolute bottom-5 left-5 text-white">
                <div>
                  <h1
                    className={cn(
                      "text-[22px] leading-[28px] font-bold traking-[-0.4px]",
                      rowdies.className
                    )}
                    style={{
                      color: banner.titleColor,
                    }}
                  >
                    {banner.title}
                  </h1>
                  <p
                    className={cn("text-sm leading-[18px]")}
                    style={{
                      color: banner.subtitleColor,
                    }}
                  >
                    {banner.subtitle}
                  </p>
                </div>

                {banner.ctaButtonTitle && (
                  <Link
                    href={
                      banner.ctaButtonUrl || `/${locale}/banner/` + banner.id
                    }
                    className={cn(
                      "bg-primary/10 backdrop-blur-md  shadow-lg shadow-black/20 font-semibold text-sm transition-all duration-300 py-2 px-4 inline-block mt-3 border-t border-b border-white/30 border-l-0 border-r-0 rounded-full hover:bg-primary/20"
                    )}
                    style={{
                      color: banner.ctaButtonTitleColor,
                    }}
                  >
                    {banner.ctaButtonTitle}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

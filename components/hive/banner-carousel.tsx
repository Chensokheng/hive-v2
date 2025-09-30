"use client";

import React from "react";
import { rowdies } from "@/fonts";
import { useRouter } from "@/i18n/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useGetBanner from "@/hooks/use-get-banner";

import { Skeleton } from "../ui/skeleton";

interface BannerItem {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

interface BannerCarouselProps {
  banners?: BannerItem[];
}

const defaultBanners: BannerItem[] = [
  {
    id: "1",
    image: "/assets/mini/banner.png",
    title: "Culinary Perfection",
    description: "Savor world-class dishes in an exquisite setting.",
    buttonText: "Reserve Table",
  },
  {
    id: "2",
    image: "/assets/mini/banner.png",
    title: "Culinary Perfection",
    description: "Savor world-class dishes in an exquisite setting.",
    buttonText: "Reserve Table",
  },
];

export default function BannerCarousel({
  banners = defaultBanners,
}: BannerCarouselProps) {
  const { data, isLoading } = useGetBanner();
  const router = useRouter();
  if (isLoading) {
    return (
      <Skeleton className="h-44 w-[calc(100vw-3rem)] bg-gray-300 mx-auto" />
    );
  }
  const handleCta = (
    url: string | null,
    merchantLength: number,
    id: number
  ) => {
    if (url) {
      router.push(url);
    } else if (merchantLength) {
      router.push("/banner/" + id);
    }
  };

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
                  <button
                    className={cn(
                      "bg-primary/10 backdrop-blur-md  shadow-lg shadow-black/20 font-semibold text-sm transition-all duration-300 py-2 px-4 inline-block mt-3 border-t border-b border-white/30 border-l-0 border-r-0 rounded-full hover:bg-primary/20"
                    )}
                    onClick={() =>
                      handleCta(
                        banner.ctaButtonUrl,
                        banner.merchants.length,
                        banner.id
                      )
                    }
                    style={{
                      color: banner.ctaButtonTitleColor,
                    }}
                  >
                    {banner.ctaButtonTitle}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

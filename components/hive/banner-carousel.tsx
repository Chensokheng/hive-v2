"use client";

import React from "react";
import Image from "next/image";
import { rowdies } from "@/fonts";

import { cn } from "@/lib/utils";

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
  return (
    <div className="flex overflow-x-auto gap-4 pr-16 scroll-smooth snap-x snap-mandatory hide-scroll ml-5 ">
      {banners.map((banner) => (
        <div
          className="h-44 w-[calc(100vw-3rem)] sm:w-[calc(448px-3rem)] flex-shrink-0 relative snap-start"
          key={banner.id}
        >
          <Image
            src={banner.image}
            alt="banner"
            fill
            sizes="(max-width: 640px) calc(100vw - 3rem), calc(448px - 3rem)"
            className="object-cover object-center rounded-3xl"
          />
          <div className="absolute bottom-5 left-5 text-white">
            <div>
              <h1
                className={cn(
                  "text-[22px] leading-[28px] font-bold traking-[-0.4px]",
                  rowdies.className
                )}
              >
                {banner.title}
              </h1>
              <p className="text-sm leading-[18px]">{banner.description}</p>
            </div>

            <button
              className="
                bg-primary/10 backdrop-blur-md 
                shadow-lg shadow-black/20
                text-white font-semibold text-sm
                transition-all duration-300
                py-2 px-4 inline-block mt-3
                border-t border-b border-white/30
                border-l-0 border-r-0 rounded-full
                hover:bg-primary/20
              "
              onClick={banner.onButtonClick}
            >
              {banner.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

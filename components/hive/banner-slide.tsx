"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { rowdies } from "@/fonts";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { cn } from "@/lib/utils";
import { CarouselItem } from "@/components/hive/carousel";

interface BannerSlideProps {
  item: CarouselItem;
  index: number;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ item }) => {
  const { locale } = useParams();

  return (
    <div className="w-full h-full flex-shrink-0 relative" key={item.id}>
      <AsyncImage
        src={item.image}
        Transition={Blur}
        style={{ width: "100%", height: "100%", borderRadius: 16 }}
        loader={<div className="bg-gray-300" />}
      />

      <div className="absolute bottom-20 left-12 text-white">
        <div>
          <h1
            className={cn("text-[3rem] font-bold", rowdies.className)}
            style={{
              color: item.titleColor,
            }}
          >
            {item.title}
          </h1>
          <p
            className={cn("text-xl font-normal")}
            style={{
              color: item.descriptionColor,
            }}
          >
            {item.description}
          </p>
        </div>

        {item.ctaButtonTitle && (
          <Link
            href={item.ctaButtonUrl || `/${locale}/banner/` + item.id}
            className="
          bg-primary/10 backdrop-blur-md 
          shadow-lg shadow-black/20
           font-semibold text-lg
          transition-all duration-300
          py-2 px-4 inline-block mt-3
          border-t border-b border-white/30
          border-l-0 border-r-0 rounded-full
          hover:bg-primary/20 cursor-pointer hover:scale-105
        "
            style={{
              color: item.ctaButtonTitleColor,
            }}
          >
            {item.ctaButtonTitle}
          </Link>
        )}
      </div>
    </div>
  );
};

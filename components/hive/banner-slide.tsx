import React from "react";
import Image from "next/image";
import { rowdies } from "@/fonts";

import { cn } from "@/lib/utils";
import { CarouselItem } from "@/components/hive/carousel";

interface BannerSlideProps {
  item: CarouselItem;
  index: number;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({ item, index }) => (
  <div className="w-full h-full flex-shrink-0 relative" key={item.id}>
    <Image
      src={item.image}
      alt={item.alt}
      fill
      sizes="1200px"
      className="object-cover object-center rounded-3xl"
      priority={index === 0}
      unoptimized
    />
    <div className="absolute bottom-20 left-12 text-white">
      <div>
        <h1 className={cn("text-[3rem] font-bold", rowdies.className)}>
          {item.title}
        </h1>
        <p className="text-xl font-normal">{item.description}</p>
      </div>

      <button
        className="
          bg-primary/10 backdrop-blur-md 
          shadow-lg shadow-black/20
          text-white font-semibold text-lg
          transition-all duration-300
          py-2 px-4 inline-block mt-3
          border-t border-b border-white/30
          border-l-0 border-r-0 rounded-full
          hover:bg-primary/20 cursor-pointer hover:scale-105
        "
      >
        Reserve Table
      </button>
    </div>
  </div>
);

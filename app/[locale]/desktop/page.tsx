"use client";

import React from "react";
import Image from "next/image";
import { rowdies } from "@/fonts";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  CategoryGrid,
  PromotionSections,
  StoreGrid,
} from "@/components/hive-v2";
import {
  Carousel,
  CarouselItem,
} from "@/components/hive/landingpage/hero-carousel";
import BellIcon from "@/components/icon/bell";
import MapPin from "@/components/icon/map-pin";
import SearchIcon from "@/components/icon/search";
import UserIcon from "@/components/icon/user";

export default function Page() {
  const banners: CarouselItem[] = [
    {
      id: "1",
      image: "/assets/mini/banner.png",
      alt: "Culinary Perfection Banner",
      title: "Culinary Perfection",
      description: "Savor world-class dishes in an exquisite setting.",
    },
    {
      id: "2",
      image: "/assets/mini/banner.png",
      alt: "Fine Dining Experience Banner",
      title: "Fine Dining Experience",
      description: "Indulge in premium flavors crafted by expert chefs.",
    },
    {
      id: "3",
      image: "/assets/mini/banner.png",
      alt: "Gourmet Delights Banner",
      title: "Gourmet Delights",
      description: "Discover exceptional cuisine in an elegant atmosphere.",
    },
  ];

  const renderCustomSlide = (item: CarouselItem, index: number) => (
    <div className="w-full h-full flex-shrink-0 relative" key={item.id}>
      <Image
        src={item.image}
        alt={item.alt}
        fill
        className="object-cover object-center rounded-3xl"
        priority={index === 0}
      />
      <div className="absolute bottom-20 left-12 text-white">
        <div>
          <h1 className={cn("text-[3rem] font-bold ", rowdies.className)}>
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

  return (
    <div className="bg-[#F2F6FF] min-h-screen relative overflow-hidden hidden lg:block pb-10">
      <DestopNav />
      <div className="space-y-6 relative">
        <div className="max-w-[1200px] mx-auto mt-6 ">
          <Carousel
            items={banners}
            height="h-[514px]"
            autoAdvance={true}
            autoAdvanceInterval={5000}
            showArrows={true}
            showDots={true}
            className="rounded-3xl"
            renderSlide={renderCustomSlide}
          />
        </div>
        <div className="max-w-[1300px] mx-auto">
          <CategoryGrid />
        </div>
        {/* color */}
        <div
          className="absolute left-[-218.15%] right-[253.99%] top-0 bottom-[-67.91%] 
         bg-[#FF66CC] opacity-20 blur-[200px] 
         [transform:matrix(0,-1,-1,0,0,0)]"
        ></div>
        <div
          className="absolute 
         w-[612.69px] h-[612px] 
         left-[calc(50%-612.69px/2+729.34px)] 
         top-[calc(50%-612px/2-619px)] 
         bg-[#FF8300] opacity-10 
         blur-[200px] 
         [transform:matrix(0,-1,-1,0,0,0)] rounded-full"
        ></div>
      </div>

      {/* Promotion */}
      <PromotionSections />

      {/* End Promotion */}
      <div className="max-w-[1200px] mx-auto mt-10">
        <StoreGrid />
      </div>
    </div>
  );
}

const DestopNav = () => {
  return (
    <nav className="px-5 py-[1.125rem] bg-white hidden  items-center gap-10 xl:gap-50 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] lg:flex">
      <div className="flex items-center gap-7">
        <div className="h-10 w-[5.875rem] relative">
          <Image src={"/assets/logo.png"} alt="logo" fill />
        </div>

        <div className="flex-1 flex gap-2 sm:gap-3 items-center cursor-pointer">
          <div className="h-10 w-10 bg-[#FF66CC]/10 rounded-full grid place-content-center">
            <MapPin color="#FF66CC" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[#303D55]/60 text-xs font-medium">
              Delivery Address
            </h2>
            <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate">
              Enter delivery address
            </h1>
          </div>
        </div>
      </div>
      {/* search */}
      <div className="relative z-10 flex-1">
        <Input
          className="bg-white rounded-full shadow-none h-10 w-full"
          placeholder="What do you want today?"
        />
        <div className="absolute top-2 sm:top-3 right-4 sm:right-6 cursor-pointer">
          <SearchIcon />
        </div>
      </div>
      {/* end search */}
      <div className="flex items-center gap-4">
        <div className="h-10 bg-[#EBEFF7] flex items-center px-3 rounded-full gap-2">
          <Image
            src={"/assets/en-flag.png"}
            alt="english flag"
            width={20}
            height={20}
          />
          <h1>English</h1>
        </div>
        <div className=" h-10 w-10 bg-[#EBEFF7] rounded-full grid place-content-center shadow-sm cursor-pointer">
          <BellIcon />
        </div>
        <div className="bg-gradient-to-b to-[#FF66CC] from-[#0055DD] h-10 w-10 rounded-full grid place-content-center">
          <UserIcon fill="white" />
        </div>
      </div>
    </nav>
  );
};

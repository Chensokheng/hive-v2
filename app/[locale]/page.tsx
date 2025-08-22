"use client";

import React from "react";
import Image from "next/image";
import { rowdies } from "@/fonts";
import { Link, usePathname } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import BellIcon from "@/components/icon/bell";
import CategoryIcon from "@/components/icon/category";
import HomeIcon from "@/components/icon/home";
import MapPin from "@/components/icon/map-pin";
import OrderIcon from "@/components/icon/order";
import SearchIcon from "@/components/icon/search";
import UserIcon from "@/components/icon/user";

export default function Page() {
  const categorty = [
    {
      image: "/assets/mini/dessert.png",
      text: "Dessert",
    },
    {
      image: "/assets/mini/fastfood.png",
      text: "Fastfood",
    },
    {
      image: "/assets/mini/fruit.png",
      text: "Fruits",
    },
    {
      image: "/assets/mini/coffee.png",
      text: "Coffee",
    },
    {
      image: "/assets/mini/dessert.png",
      text: "Dessert",
    },
    {
      image: "/assets/mini/fastfood.png",
      text: "Fastfood",
    },
    {
      image: "/assets/mini/fruit.png",
      text: "Fruits",
    },
    {
      image: "/assets/mini/coffee.png",
      text: "Coffee",
    },
  ];

  const bottomNavs = [
    {
      href: "/",
      icon: HomeIcon,
      label: "Home",
    },
    {
      href: "/category",
      icon: CategoryIcon,
      label: "Categories",
    },
    {
      href: "/order",
      icon: OrderIcon,
      label: "My Orders",
    },
    {
      href: "/profile",
      icon: UserIcon,
      label: "Profile",
    },
  ];
  const pathname = usePathname();

  return (
    <div className="w-full max-w-full sm:max-w-md mx-auto border min-h-screen bg-[#F2F6FF] py-4 sm:py-5 space-y-4 sm:space-y-6 relative overflow-hidden pb-10">
      <div
        className="
          absolute
          w-[120vw] sm:w-[490px]
          left-[-30vw] sm:left-[-146px]
          top-[-80%]
          bottom-[72.09%]
          bg-[#0055DD]
          opacity-20
          blur-[150px] sm:blur-[200px]
          [transform:matrix(0.14,-0.99,-0.99,-0.14,0,0)]
        "
      />
      <nav className="px-4 sm:px-5 flex items-center gap-2 relative z-10">
        <div className="flex-1 flex gap-2 items-center cursor-pointer">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full grid place-content-center shadow-sm">
            <MapPin color="#FF66CC" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[#303D55]/60 text-xs font-medium">
              Delivery Address
            </h2>
            <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate">
              Keystone Building
            </h1>
          </div>
        </div>

        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full grid place-content-center shadow-sm">
          <BellIcon />
        </div>
      </nav>
      {/* search */}
      <div className="mx-4 sm:mx-5 relative z-10">
        <Input
          className="bg-white rounded-full border-none shadow-none h-10 sm:h-12 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder="What do you want today?"
        />
        <div className="absolute top-2 sm:top-3 right-4 sm:right-6">
          <SearchIcon />
        </div>
      </div>

      {/* banner */}
      <div className="flex overflow-x-auto gap-4 pl-5 pr-16 scroll-smooth snap-x snap-mandatory hide-scroll ml-5">
        {[1, 2].map((index) => {
          return (
            <div
              className="h-44 w-[calc(100vw-3rem)] sm:w-[calc(448px-3rem)] flex-shrink-0 relative snap-start"
              key={index}
            >
              <Image
                src={"/assets/mini/banner.png"}
                alt="banner"
                fill
                className="object-cover object-center rounded-3xl"
              />
              <div className=" absolute bottom-5 left-5 text-white">
                <div className="">
                  <h1
                    className={cn(
                      "text-[22px] leading-[28px] font-bold traking-[-0.4px]",
                      rowdies.className
                    )}
                  >
                    Culinary Perfection
                  </h1>
                  <p className="text-sm leading-[18px]">
                    Savor world-class dishes in an exquisite setting.
                  </p>
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
            "
                >
                  Reserve Table
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* end banner */}
      {/* Categoy */}
      <div className="flex overflow-x-auto gap-2 pl-8 pr-8 scroll-smooth snap-x snap-mandatory hide-scroll ml-5">
        {categorty.map((item, index) => {
          return (
            <div
              key={index}
              className={cn(
                " items-center h-[98px] w-[98px] flex-shrink-0 grid place-content-center snap-start",
                {
                  "bg-primary/10 rounded-lg": index === 1,
                }
              )}
            >
              <div className="w-13 h-13 relative mx-auto">
                <Image
                  src={item.image}
                  alt="coffee"
                  fill
                  className=" object-cover object-center"
                />
              </div>

              <h1 className="text-sm font-medium text-[#161F2F] text-center">
                {item.text}
              </h1>
            </div>
          );
        })}
      </div>
      {/* Promotion */}

      <div className="pl-4 py-7 bg-[linear-gradient(180deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_50%,rgba(242,246,255,0.7)_100%)] rounded-xl mt-5 space-y-8">
        <div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-l from-[#FF66CC] to-[#0055DD] bg-clip-text text-transparent">
              Premium Delight
            </h1>
            <p className="text-[#303D55]/60 text-sm">
              Save more when you order
            </p>
          </div>
          <div className="flex overflow-x-auto gap-3 mt-4 scroll-smooth snap-x snap-mandatory hide-scroll">
            {[1, 2, 3].map((index) => {
              return (
                <div
                  className="relative w-[152px] h-[200px] flex-shrink-0 snap-start"
                  key={index}
                >
                  <Image
                    src={"/assets/mini/promotion.png"}
                    alt="promotion"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* best deal */}

        <div>
          <h1 className="text-xl font-bold bg-gradient-to-l from-[#FF66CC] to-[#0055DD] bg-clip-text text-transparent">
            Best Deal
          </h1>

          <div className="flex overflow-x-auto gap-3 mt-4 scroll-smooth snap-x snap-mandatory hide-scroll">
            {[1, 2, 3].map((index) => {
              return (
                <div
                  className="relative w-[152px] h-[200px] flex-shrink-0 snap-start"
                  key={index}
                >
                  <Image
                    src={"/assets/mini/best-deal.png"}
                    alt="promotion"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* end of promotion */}
      {/* bottom nav */}
      <nav className="block md:hidden fixed bottom-0 left-0 right-0 bg-white px-5 rounded-lg">
        <div className="flex items-center justify-between pb-5">
          {bottomNavs.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <div key={index}>
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center flex-col py-1"
                >
                  <item.icon fill={isActive ? "#FF66CC" : "#BDC5DB"} />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-primary" : "text-[#303D55]/60"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
      {/* end of bottom nav */}
    </div>
  );
}

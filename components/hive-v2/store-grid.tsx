"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Star } from "lucide-react";

import MapPin from "@/components/icon/map-pin";

interface Store {
  id: string;
  image: string;
  name: string;
  rating: number;
  category: string;
  location: string;
  tag: string;
  href?: string;
}

interface StoreGridProps {
  title?: string;
  stores?: Store[];
}

const defaultStores: Store[] = [
  {
    id: "1",
    image: "/assets/food1.png",
    name: "Merchant Name",
    rating: 4.5,
    category: "Category",
    location: "Location",
    tag: "Treading",
    href: "/",
  },
  {
    id: "2",
    image: "/assets/food1.png",
    name: "Merchant Name",
    rating: 4.5,
    category: "Category",
    location: "Location",
    tag: "10% OFF",
    href: "/",
  },
  {
    id: "3",
    image: "/assets/food1.png",
    name: "Merchant Name",
    rating: 4.5,
    category: "Category",
    location: "Location",
    tag: "10% OFF",
    href: "/",
  },
];

export default function StoreGrid({
  title = "All Store",
  stores = defaultStores,
}: StoreGridProps) {
  return (
    <div className="space-y-2">
      <h1 className="px-4 text-xl text-[#1A1D22] font-bold">{title}</h1>
      <div className="grid grid-cols-2 px-3 gap-2">
        {stores.map((store) => (
          <Link
            href={store.href || "/"}
            key={store.id}
            className="bg-white rounded-2xl p-[6px] hover:shadow-md transition-shadow"
          >
            <div className="relative w-full aspect-[3/2]">
              <Image
                src={store.image}
                alt={store.name}
                fill
                className="object-center object-cover rounded-xl"
              />
              {/* tag */}
              <div className="absolute top-0 left-0 rounded-tl-[8px] rounded-bl-[0px] rounded-tr-[0px] rounded-br-[8px] bg-primary text-white text-xs font-semibold px-2 py-1">
                {store.tag}
              </div>
            </div>
            <div className="px-4 py-2">
              <h3 className="font-semibold text-[#161F2F]">{store.name}</h3>

              {/* Rating and Category */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="text-sm font-medium text-[#161F2F]">
                    {store.rating}
                  </span>
                </div>
                <span className="text-gray-300">·</span>
                <button className="text-primary text-sm">
                  {store.category}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin color="#FF66CC" />
                <span className="text-sm text-[#303D55]/60">
                  {store.location}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

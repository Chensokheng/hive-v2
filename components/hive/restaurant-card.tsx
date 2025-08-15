import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Restaurant } from "@/types";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

import MapPin from "../icon/map-pin";

export default function RestaurantCard({
  restaurant,
  className,
}: {
  restaurant: Restaurant;
  className?: string;
}) {
  return (
    <Link href={"/merchant"}>
      <div
        key={restaurant.id}
        className={cn(
          "bg-white rounded-2xl overflow-hidden  border border-gray-100 flex-shrink-0 w-2/3 sm:w-80 p-1",
          className
        )}
      >
        {/* Restaurant Image with Tag */}
        <div className="relative w-full h-32 sm:h-48">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover rounded-lg"
            sizes="(min-width: 640px) 100vw, 100vw"
          />
          <div className="absolute top-1 left-0">
            <span className="bg-blue-600 text-white px-3 py-2 rounded-lg rounded-bl-none rounded-tr-none text-sm font-medium">
              Tag
            </span>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>

          {/* Rating and Category */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span className="text-sm font-medium text-gray-900">
                {restaurant.rating}
              </span>
            </div>
            <span className="text-gray-300">·</span>
            <button className="text-primay text-sm font-medium hover:underline">
              {restaurant.category}
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin color="#FF66CC" />

            <span className="text-sm text-gray-500">{restaurant.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

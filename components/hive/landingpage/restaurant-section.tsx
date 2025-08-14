"use client";

import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import MapPin from "@/components/icon/map-pin";

interface Restaurant {
  id: number;
  image: string;
  name: string;
  rating: number;
  category: string;
  location: string;
}

interface RestaurantSectionProps {
  title: string;
  restaurants: Restaurant[];
  containerId: string;
}

export function RestaurantSection({
  title,
  restaurants,
  containerId,
}: RestaurantSectionProps) {
  const scrollRight = () => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const t = useTranslations("HomePage.restaurants");

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-l from-[#FF66CC] to-[#0055DD] bg-clip-text text-transparent">
          {title}
        </h2>
        <button className="text-primary font-bold hover:underline">
          {t("seeAll")}
        </button>
      </div>

      <div className="relative">
        {/* Restaurant Cards Horizontal Scroll */}
        <div
          id={containerId}
          className="flex gap-1 sm:gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-2xl overflow-hidden  border border-gray-100 flex-shrink-0 w-2/3 sm:w-80 p-1"
            >
              {/* Restaurant Image with Tag */}
              <div className="relative">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  width={320}
                  height={192}
                  className="w-full h-28 sm:h-48 object-cover rounded-lg"
                />
                <div className="absolute top-1 left-0">
                  <span className="bg-blue-600 text-white px-3 py-2 rounded-lg rounded-bl-none rounded-tr-none text-sm font-medium">
                    Tag
                  </span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {restaurant.name}
                </h3>

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

                  <span className="text-sm text-gray-500">
                    {restaurant.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-custom-tranparent-dark  shadow-lg hover:shadow-xl transition-shadow hidden sm:flex items-center justify-center backdrop-blur-xl "
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      <style jsx>{`
        #${containerId}::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

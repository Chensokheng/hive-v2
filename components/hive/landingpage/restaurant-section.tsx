"use client";

import { Restaurant } from "@/types";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import RestaurantCard from "../restaurant-card";

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
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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

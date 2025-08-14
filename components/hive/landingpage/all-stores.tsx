import React from "react";
import { bestDealRestaurants } from "@/fake/restaurant-data";
import { useTranslations } from "next-intl";

import RestaurantCard from "../restaurant-card";

export default function AllStores() {
  const t = useTranslations("HomePage.restaurants");

  const restaurants = bestDealRestaurants;

  return (
    <section className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-l from-[#FF66CC] to-[#0055DD] bg-clip-text text-transparent">
          {t("allStore")}
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-2">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            className="w-full sm:w-auto"
            key={restaurant.id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </section>
  );
}

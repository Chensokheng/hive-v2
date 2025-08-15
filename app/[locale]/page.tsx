import { use } from "react";
import {
  bestDealRestaurants,
  forYouRestaurants,
  nearbyRestaurants,
} from "@/fake/restaurant-data";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import AllStores from "@/components/hive/landingpage/all-stores";
import { HeroCarousel } from "@/components/hive/landingpage/hero-carousel";
import { RestaurantSection } from "@/components/hive/landingpage/restaurant-section";
import Navbar from "@/components/hive/navbar";

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen bg-primary-bg">
      <Navbar />

      <HeroCarousel />

      <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-12">
        <RestaurantSection
          title={t("restaurants.nearby")}
          restaurants={nearbyRestaurants}
          containerId="nearby-container"
        />
        <RestaurantSection
          title={t("restaurants.bestDeal")}
          restaurants={bestDealRestaurants}
          containerId="best-deal-container"
        />
        <RestaurantSection
          title={t("restaurants.forYou")}
          restaurants={forYouRestaurants}
          containerId="for-you-container"
        />
        <AllStores />
      </main>
    </div>
  );
}

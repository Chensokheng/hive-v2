import { use } from "react";
import {
  bestDealRestaurants,
  forYouRestaurants,
  heroCarouselImages,
  nearbyRestaurants,
} from "@/fake/restaurant-data";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { Carousel } from "@/components/hive/carousel";
import AllStores from "@/components/hive/landingpage/all-stores";
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
    <div className="min-h-screen bg-primary/10">
      <Navbar />

      <Carousel
        items={heroCarouselImages}
        height="h-[200px] md:h-[500px]"
        arrowClassName="bg-custom-tranparent-dark backdrop-blur-xl"
        autoAdvance={true}
        autoAdvanceInterval={5000}
      />
      <Link href={"/mini"}>mini</Link>

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

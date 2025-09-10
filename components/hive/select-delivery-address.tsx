import React from "react";
import { useTranslations } from "next-intl";

import MapPin from "../icon/map-pin";

export default function SelectDeliveryAddress() {
  const t = useTranslations();

  return (
    <div className="flex-1 flex gap-2 sm:gap-3 items-center cursor-pointer">
      <div className="h-10 w-10 bg-white lg:bg-[#FF66CC]/10 rounded-full grid place-content-center">
        <MapPin color="#FF66CC" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-[#303D55]/60 text-xs font-medium">
          {t("nav.deliveryAddress")}
        </h2>
        <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate">
          {t("nav.enterDeliveryAddress")}
        </h1>
      </div>
    </div>
  );
}

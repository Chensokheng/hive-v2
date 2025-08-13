import React from "react";
import { useTranslations } from "next-intl";

import MapPin from "../../icon/map-pin";
import { Input } from "../../ui/input";

export default function DeliveryAddress() {
  const t = useTranslations("Navbar");

  return (
    <div className="relative flex-1">
      <MapPin
        color="#0055dd"
        className="absolute left-2 top-1/2 -translate-y-1/2"
      />
      <Input
        placeholder={t("deliveryAddressPlaceholder")}
        className="rounded-full  md:w-96 bg-[#EBEFF7] pl-8"
      />
    </div>
  );
}

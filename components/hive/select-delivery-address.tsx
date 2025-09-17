"use client";

import React, { useEffect, useState } from "react";
import { useAddresStore } from "@/store/address";
import { useTranslations } from "next-intl";

import useGetUserInfo from "@/hooks/use-get-user-info";

import MapPin from "../icon/map-pin";

export default function SelectDeliveryAddress() {
  const t = useTranslations();
  const { data: user } = useGetUserInfo();
  const unAuthAddress = useAddresStore((state) => state.unAuthAddress);
  const [address, setAdress] = useState(
    unAuthAddress || user?.placeAddress?.slice(0, 20)
  );

  const setOpenAddresSheet = useAddresStore(
    (state) => state.setOpenAddressSheet
  );

  useEffect(() => {
    setAdress(
      user?.placeAddress?.slice(0, 20) ||
        sessionStorage.getItem("address")?.slice(0, 20) ||
        unAuthAddress?.slice(0, 20)
    );
  }, [user?.placeAddress]);

  return (
    <div className="flex-1 flex gap-2 sm:gap-3 items-center cursor-pointer z-50">
      <div
        className="h-10 w-10 bg-white lg:bg-[#FF66CC]/10 rounded-full grid place-content-center z-50"
        onClick={() => {
          setOpenAddresSheet(true);
        }}
      >
        <MapPin color="#FF66CC" />
      </div>
      <div
        className="flex-1 min-w-0 z-50 w-50"
        onClick={() => setOpenAddresSheet(true)}
      >
        <h2 className="text-[#303D55]/60 text-xs font-medium">
          {t("nav.deliveryAddress")}
        </h2>
        <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate leading-6">
          {unAuthAddress
            ? unAuthAddress.slice(0, 22) + "..."
            : address
              ? address.slice(0, 22) + "..."
              : t("nav.enterDeliveryAddress")}
        </h1>
      </div>
    </div>
  );
}

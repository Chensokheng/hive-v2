import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import MapIcon from "@/components/icon/map";

import OutletWorkingHour from "./outlet-working-hour";

export default function OutletCard({
  merchant,
  outlet,
}: {
  merchant: string;
  outlet: {
    id: number;
    name: string;
    shortName: string;
    address: string;
    addressEn: string;
    image: string;
    joinedDeliveryProgram: boolean;
    joinedContactlessProgram: boolean;
    enableTableBooking: boolean;
    distance: number;
  };
}) {
  const { locale } = useParams();
  const address = locale === "en" ? outlet.addressEn : outlet.address;

  return (
    <Link
      href={"/" + locale + "/" + merchant + "/" + outlet.shortName}
      key={outlet.id}
      className="maw-w-[384px] bg-white rounded-[16px] block py-5 pl-5 space-y-3"
    >
      <AsyncImage
        src={outlet.image}
        Transition={Blur}
        style={{ width: 72, height: 72, borderRadius: 1000 }}
        className="shadow"
        loader={<div className="bg-gray-300" />}
      />

      <h1 className="text-[#161F2F] font-semibold">{outlet.name}</h1>
      <div className="text-sm text-[#303D5599] flex gap-2 flex-wrap">
        <MapIcon />
        <span className="text-[#161F2F]">{outlet.distance / 1000} km -</span>
        <span>{address.slice(0, 30)}...</span>
      </div>
      <OutletWorkingHour
        merchantName={merchant}
        outletName={outlet.shortName}
      />
    </Link>
  );
}

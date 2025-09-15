import React from "react";
import Link from "next/link";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import MapIcon from "@/components/icon/map";

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
  return (
    <Link
      href={"/" + merchant + "/" + outlet.shortName}
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
      <div className="text-sm text-[#303D5599] flex gap-2">
        <MapIcon />
        <span className="text-[#161F2F]">{outlet.distance / 1000} km -</span>

        <span>{outlet.addressEn.slice(0, 32)}...</span>
      </div>
    </Link>
  );
}

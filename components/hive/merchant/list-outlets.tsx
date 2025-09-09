"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";

import { Input } from "@/components/ui/input";
import MapIcon from "@/components/icon/map";
import SearchIcon from "@/components/icon/search";

import BlurImage from "../blur-image";

export default function ListOutlets({
  data,
  merchant,
}: {
  data:
    | {
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
      }[]
    | null;
  merchant: string;
}) {
  const [outlets, setOutlets] = useState(data || []);

  return (
    <div className="space-y-6">
      <div>
        <div className="relative z-10 flex-1 max-w-[384px]">
          <Input
            className="bg-white rounded-full shadow-none h-10 w-full pl-10"
            placeholder="Search branch"
          />
          <div className="absolute top-3  left-4  cursor-pointer">
            <SearchIcon />
          </div>
        </div>
      </div>
      <div className="grid  grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {outlets.map((outlet) => {
          return (
            <Link
              href={"/" + merchant + "/" + outlet.shortName}
              key={outlet.id}
              className="maw-w-[384px] bg-white rounded-[16px] block py-5 pl-5 space-y-3"
            >
              <BlurImage
                src={outlet.image}
                alt=""
                width={72}
                height={72}
                className=" rounded-full border"
                priority
              />

              <h1 className="text-[#161F2F] font-semibold">{outlet.name}</h1>
              <div className="text-sm text-[#303D5599] flex gap-2">
                <div className="flex items-center gap-1">
                  <MapIcon />
                  <span className="text-[#161F2F]">
                    {outlet.distance / 1000} km -
                  </span>
                </div>
                <span>{outlet.addressEn.slice(0, 32)}...</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

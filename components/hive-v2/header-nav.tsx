"use client";

import React from "react";

import BellIcon from "@/components/icon/bell";
import MapPin from "@/components/icon/map-pin";

interface HeaderNavProps {
  deliveryAddress?: string;
  onAddressClick?: () => void;
  onNotificationClick?: () => void;
}

export default function HeaderNav({
  deliveryAddress = "Keystone Building",
  onAddressClick,
  onNotificationClick,
}: HeaderNavProps) {
  return (
    <nav className="px-4 sm:px-5 flex items-center gap-2 relative z-10">
      <div
        className="flex-1 flex gap-2 items-center cursor-pointer"
        onClick={onAddressClick}
      >
        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full grid place-content-center shadow-sm">
          <MapPin color="#FF66CC" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-[#303D55]/60 text-xs font-medium">
            Delivery Address
          </h2>
          <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate">
            {deliveryAddress}
          </h1>
        </div>
      </div>

      <div
        className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-full grid place-content-center shadow-sm cursor-pointer"
        onClick={onNotificationClick}
      >
        <BellIcon />
      </div>
    </nav>
  );
}

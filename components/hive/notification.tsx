"use client";

import React from "react";
import Link from "next/link";

import useGetUserInfo from "@/hooks/use-get-user-info";
import useGetUserOrderHistory from "@/hooks/use-get-user-order-history";

import BellIcon from "../icon/bell";

export default function Notification() {
  const { data: user } = useGetUserInfo();

  const { data: history } = useGetUserOrderHistory(
    user?.token!,
    user?.phone!,
    "processing"
  );

  return (
    <Link href="/history" className="relative">
      <div className="h-10 w-10 bg-[#EBEFF7] rounded-full grid place-content-center shadow-sm cursor-pointer ">
        <BellIcon />

        {history?.data?.items?.length && history.data.items.length > 0 && (
          <span className="text-xs text-white w-4 h-4 rounded-full font-bold absolute -top-1 -right-1 bg-red-500 grid place-content-center">
            {history?.data.items.length}
          </span>
        )}
      </div>
    </Link>
  );
}

"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";

import useGetUserInfo from "@/hooks/use-get-user-info";
import useGetUserOrders from "@/hooks/use-get-user-orders";

export default function OrderListener() {
  const { data: user } = useGetUserInfo();

  const { data } = useGetUserOrders(Number(user?.userId), user?.token!);

  return (
    <div className="fixed right-10 bottom-10">
      <div className=" h-10 w-10 bg-[#EBEFF7] rounded-full grid place-content-center shadow-sm cursor-pointer relative">
        <div className="h-4 w-4 rounded-full bg-red-500 absolute -top-1 -right-1 grid place-content-center text-white text-sm animate-pulse">
          {data?.data.orders.length}
        </div>
        <ShoppingCart />
      </div>
    </div>
  );
}

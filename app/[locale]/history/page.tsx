"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGlobalState } from "@/store";
import { AsyncImage } from "loadable-image";
import { ChevronLeft } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn, formatDate, getImageUrl } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetUserInfo from "@/hooks/use-get-user-info";
import useGetUserOrderHistory from "@/hooks/use-get-user-order-history";
import { OrderCardSkeleton } from "@/components/loading/order-skeleton";

export default function Page() {
  const { locale } = useParams();
  const { data, isLoading: isLoadingUser } = useGetUserInfo();
  const [tab, setTab] = useState("processing");

  const { data: history, isLoading } = useGetUserOrderHistory(
    data?.token!,
    data?.phone!,
    tab
  );
  const { data: rate } = useGetExchangeRate();

  const jsBridgeStatus = useGlobalState((state) => state.jsBridgeStatus);

  return (
    <div className="min-h-screen">
      <div className="max-w-[800px] mx-auto  min-h-screen lg:bg-white">
        {jsBridgeStatus === "success" ? (
          <div
            className=" fixed top-0 right-0 w-full flex items-center justify-between px-5"
            style={{
              zIndex: 1000,
            }}
          >
            <Link href={"/"}>
              <ChevronLeft />
            </Link>
            <h1 className="text-lg font-bold flex-1 text-center">My Orders</h1>
            <span></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-6 lg:px-10 border-b px-2">
            <Link href={"/" + locale}>
              <ChevronLeft className="text-primary" />
            </Link>
            <h1 className="text-lg lg:text-3xl font-bold text-[#161F2F] text-center flex-1">
              My Orders
            </h1>
          </div>
        )}

        <div>
          <div className="flex px-6">
            <button
              onClick={() => setTab("processing")}
              className={cn(
                "flex-1 py-4  font-semibold text-lg  border-b-4 cursor-pointer",
                {
                  "text-[#161F2F] border-primary": tab === "processing",
                  "text-[#03D5599]  border-transparent": tab !== "processing",
                }
              )}
            >
              Processing
            </button>
            <button
              onClick={() => setTab("history")}
              className={cn(
                "flex-1 py-4  font-semibold text-lg cursor-pointer border-b-4",
                {
                  "text-[#161F2F]  border-primary": tab === "history",
                  "text-[#303D5599] border-transparent": tab !== "history",
                }
              )}
            >
              History
            </button>
          </div>

          <div className="py-6 space-y-2 lg:space-y-6">
            {(isLoading || isLoadingUser) && (
              <>
                <OrderCardSkeleton />
                <OrderCardSkeleton />
                <OrderCardSkeleton />
              </>
            )}
            {history?.data.items.length === 0 && (
              <div className="text-center text-gray-500">No orders found</div>
            )}
            {history?.data.items.map((item) => {
              return (
                <Link
                  href={
                    "/" +
                    locale +
                    "/" +
                    item.outlet.merchant.sub_domain +
                    "/" +
                    item.outlet.short_name +
                    "/order/" +
                    item.id
                  }
                  key={item.id}
                  className="space-y-3 border-b-4 border-primary-bg px-6 pb-3 cursor-pointer hover:bg-primary/10 py-4 transition-all bg-white block"
                >
                  <div className="flex gap-2 items-start">
                    <AsyncImage
                      src={getImageUrl(item.outlet.outlet_images[0].image_name)}
                      Transition={Blur}
                      style={{
                        width: "48px",
                        height: "48px",
                      }}
                      className="object-center object-cover rounded-full"
                      loader={<div className="bg-gray-300" />}
                      alt={item.outlet.name}
                    />
                    <div className="flex-1">
                      <h1 className="text-[#161F2F] font-semibold">
                        {item.outlet.name}
                      </h1>
                      <p className="text-sm text-primary">
                        Order ID: {item.id}
                      </p>
                    </div>
                    <div className="text-primary">
                      {item.qty} {item.qty > 1 ? "items" : "item"}
                    </div>
                  </div>
                  <div>
                    <div className="text-right">
                      <h1 className="font-bold">${item.final_total}</h1>
                      <p className="text-[#363F4F99] text-sm">
                        ≈{item.final_total * (rate ? rate : 0)}៛
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center flex-wrap text-sm">
                      <span className="text-[#303D5599] font-semibold capitalize">
                        {item.type}
                      </span>
                      -<span>{formatDate(item.created_at)}</span>
                    </div>
                    <div>
                      <span
                        className={cn(
                          " capitalize font-semibold text-sm text-primary",
                          {
                            "text-[#FF66CC]": item.status === "completed",
                            "text-red-400": item.status === "canceled",
                            "animate-pulse": tab === "processing",
                          }
                        )}
                      >
                        {tab === "processing" ? "processing.." : item.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

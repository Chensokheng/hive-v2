"use client";

import React from "react";
import { useOutletStore } from "@/store/outlet";
import { AsyncImage } from "loadable-image";
import { Plus } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";

export default function OutletMenuCard({
  item,
  rate,
  outletId,
  existingItemQuantity,
}: {
  item: {
    id: number;
    image: string;
    name: string;
    hasAddOn: boolean;
    price: number;
    promotionPrice: number;
  };
  rate: number;
  outletId: number;
  existingItemQuantity: number;
}) {
  const setSelectedOutletMenu = useOutletStore(
    (state) => state.setSelectedOutletMenu
  );
  const { data: user } = useGetUserInfo();

  return (
    <div
      className=" block w-full max-w-full rounded-lg bg-white hover:shadow transition-all cursor-pointer"
      onClick={() => {
        if (!user?.userId) {
          document.getElementById("auth-trigger-dialog")?.click();
          return;
        }
        setSelectedOutletMenu({ ...item, isCustomDiscounted: false }, outletId);
      }}
    >
      <div className="w-full aspect-square relative">
        <AsyncImage
          src={item.image}
          Transition={Blur}
          style={{
            width: "100%",
            height: "100%",
          }}
          className="rounded-t-lg object-center object-cover"
          loader={<div className="bg-gray-300" />}
          alt={item.name}
        />
        <div
          className={cn(
            " absolute top-3 right-3  rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer"
          )}
        >
          <div
            className={cn(" h-9 w-9 grid place-content-center rounded-full", {
              "ring-primary ring-2": existingItemQuantity > 0,
            })}
          >
            {existingItemQuantity ? (
              <span className="font-bold">{existingItemQuantity}</span>
            ) : (
              <Plus className="text-primary" />
            )}
          </div>
        </div>

        <div className="px-3 py-4 w-full">
          <h1 className="text-[#161F2F] font-semibold break-words overflow-hidden text-ellipsis truncate">
            {item.name}
          </h1>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">
                ${" "}
                {item.promotionPrice !== item.price
                  ? item.promotionPrice
                  : item.price}
              </span>
              {item.promotionPrice !== item.price && (
                <span className=" line-through text-gray-400">
                  ${item.price}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-[#363F4F]/60">
              ≈{Math.round(rate ? rate * item.price : 0)}៛
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

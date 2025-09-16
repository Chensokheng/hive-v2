"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOutletStore } from "@/store/outlet";
import { AsyncImage } from "loadable-image";
import { Plus } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletMenu from "@/hooks/use-get-outlet-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function OutletMenu() {
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };
  const { data: merchantInfo, isLoading: isUserLoading } =
    useGetMerchantInfo(merchant);

  const setCategoryId = useOutletStore((state) => state.setCategoryId);

  const categoryId = useOutletStore((state) => state.categoryId);

  const foundOutlet = merchantInfo?.find((item) => item.shortName === outlet);

  const { data: menus, isLoading } = useGetOutletMenu(
    foundOutlet?.id!,
    categoryId
  );
  const { data: rate } = useGetExchangeRate();

  useEffect(() => {
    return () => {
      setCategoryId(null);
    };
  }, []);

  if (isLoading || isUserLoading) {
    return (
      <div className="py-6 space-y-4">
        <div className="px-3">
          <Skeleton className="h-8 w-30 bg-gray-300" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-5 lg:px-0  py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className=" block w-full max-w-full rounded-xl bg-white"
                key={index}
              >
                <div className="w-full aspect-square relative">
                  <Skeleton className="h-full w-full bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {menus?.map((menu, index) => {
        return (
          <div key={index}>
            <section className="px-3 lg:px-none">
              <h1 className="text-[#161F2F] text-[22px] font-bold">
                {menu.name}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-5 lg:px-0  py-3">
                {menu.items.map((item, index) => {
                  return (
                    <div
                      className=" block w-full max-w-full rounded-xl bg-white"
                      key={index}
                    >
                      <div className="w-full aspect-square relative">
                        <AsyncImage
                          src={item.image}
                          Transition={Blur}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                          className="rounded-t-xl object-center object-cover"
                          loader={<div className="bg-gray-300" />}
                          alt={item.name}
                        />
                        <div
                          className={cn(
                            " absolute top-3 right-3  rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer"
                          )}
                        >
                          <div
                            className={cn(
                              " h-9 w-9 grid place-content-center rounded-full"
                            )}
                          >
                            <Plus className="text-primary" />
                          </div>
                        </div>

                        <div className="px-3 py-4 w-full">
                          <h1 className="text-[#161F2F] font-semibold break-words overflow-hidden text-ellipsis">
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
                })}
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}

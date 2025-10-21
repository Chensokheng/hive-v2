"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useOutletStore } from "@/store/outlet";

import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletMenu from "@/hooks/use-get-outlet-menu";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Skeleton } from "@/components/ui/skeleton";

import OutletMenuCard from "./outlet-menu-card";

export default function OutletMenu() {
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };
  const { data: merchantInfo, isLoading: isUserLoading } =
    useGetMerchantInfo(merchant);

  const setCategoryId = useOutletStore((state) => state.setCategoryId);
  const searchMenu = useOutletStore((state) => state.searchMenu);

  const categoryId = useOutletStore((state) => state.categoryId);
  const { data: user } = useGetUserInfo();
  const foundOutlet = merchantInfo?.find((item) => item.shortName === outlet);

  const { data: menus, isLoading } = useGetOutletMenu(
    foundOutlet?.id!,
    categoryId,
    searchMenu
  );
  const { data: rate } = useGetExchangeRate();
  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    Number(foundOutlet?.id)
  );

  useEffect(() => {
    return () => {
      setCategoryId(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="py-6 space-y-6" id="outlet-menu">
      {menus?.map((menu, index) => {
        return (
          <div key={index}>
            <section className="px-3 lg:px-none">
              <h1 className="text-[#161F2F] text-[22px] font-bold">
                {menu.name}
              </h1>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-5 lg:px-0  py-3">
                {menu.items.map((item, index) => {
                  // Sum up quantities for all unpaid items with the same menuItemId
                  const totalQuantity =
                    unpaidItem?.items
                      ?.filter(
                        (unpaidItem) =>
                          unpaidItem.menuItemId === item.id &&
                          (((unpaidItem.cartDiscountedProduct?.sellingPrice >
                            0 ||
                            !unpaidItem.cartDiscountedProduct) &&
                            unpaidItem.promotionCartItem?.price > 0) ||
                            !unpaidItem.promotionCartItem)
                      )
                      ?.reduce(
                        (sum, unpaidItem) => sum + unpaidItem.quantity,
                        0
                      ) || 0;

                  return (
                    <OutletMenuCard
                      item={item}
                      rate={rate || 0}
                      key={index}
                      outletId={foundOutlet?.id!}
                      existingItemQuantity={totalQuantity}
                    />
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

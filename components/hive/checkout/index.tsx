"use client";

import React from "react";
import { OutletUnpaidItemsDto } from "@/types-v2/dto";

import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";

import { FloatingCart } from "../floating-cart";
import CheckoutSheet from "./checkout-sheet";

export default function Checkout({
  merchantName,
  outletName,
}: {
  merchantName: string;
  outletName: string;
}) {
  const { data: user } = useGetUserInfo();

  const { data: merchantInfo } = useGetMerchantInfo(merchantName);

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );

  const {
    data: unpaidItem,
    isFetching,
    isLoading,
  } = useGetOutletUnpaidItem(Number(user?.userId!), foundOutlet?.id!);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="w-full">
      <FloatingCart
        quantity={unpaidItem?.totalQuantity || 0}
        isFetching={isFetching}
      />

      <CheckoutSheet
        unpaidItem={unpaidItem as OutletUnpaidItemsDto}
        isFetching={isFetching}
      />
    </div>
  );
}

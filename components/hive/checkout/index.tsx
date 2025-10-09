"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCheckoutStore } from "@/store/checkout";

import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";

import { FloatingCart } from "../floating-cart";
import CheckoutSheet from "./checkout-sheet";

export default function Checkout() {
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };
  const { data: user } = useGetUserInfo();

  const { data: merchantInfo } = useGetMerchantInfo(merchant);

  const foundOutlet = merchantInfo?.find((item) => item.shortName === outlet);

  const { data: unpaidItem, isLoading } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    foundOutlet?.id!
  );

  const resetPromotCode = useCheckoutStore((state) => state.resetPromotCode);

  useEffect(() => {
    resetPromotCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <div className="w-full">
      {(unpaidItem?.totalQuantity || 0) > 0 && (
        <FloatingCart quantity={unpaidItem?.totalQuantity || 0} />
      )}

      {foundOutlet?.id && <CheckoutSheet outletId={foundOutlet?.id} />}
    </div>
  );
}

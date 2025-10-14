"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCheckoutStore } from "@/store/checkout";

import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";

import { FloatingCart } from "../floating-cart";
import CheckoutSheet from "./checkout-sheet";

export default function Checkout() {
  const params = useParams() as {
    merchant?: string;
    outlet?: string;
  };
  const { data: user } = useGetUserInfo();
  const [outletId, setOutletId] = useState<number | null>(null);
  const [merchantName, setMerchantName] = useState<string>("");

  // Determine which merchant to use (from params or localStorage)
  useEffect(() => {
    if (params.merchant) {
      setMerchantName(params.merchant);
    } else if (typeof window !== "undefined") {
      const lastSelectedMerchant = localStorage.getItem("lastSelectedMerchant");
      if (lastSelectedMerchant) {
        setMerchantName(lastSelectedMerchant);
      }
    }
  }, [params.merchant]);

  const { data: merchantInfo } = useGetMerchantInfo(merchantName);

  const foundOutlet =
    params.merchant && params.outlet
      ? merchantInfo?.find((item) => item.shortName === params.outlet)
      : undefined;

  // Get outlet ID from params or localStorage
  useEffect(() => {
    if (foundOutlet?.id) {
      setOutletId(foundOutlet.id);
    } else if (typeof window !== "undefined") {
      const lastSelectedOutlet = localStorage.getItem("lastSelectedOutlet");
      if (lastSelectedOutlet) {
        setOutletId(Number(lastSelectedOutlet));
      }
    }
  }, [foundOutlet?.id]);

  const { data: unpaidItem, isLoading } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    outletId!
  );

  const resetPromotCode = useCheckoutStore((state) => state.resetPromotCode);

  useEffect(() => {
    resetPromotCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !outletId) {
    return <></>;
  }

  return (
    <div className="w-full">
      {(unpaidItem?.totalQuantity || 0) > 0 && (
        <FloatingCart quantity={unpaidItem?.totalQuantity || 0} />
      )}

      {outletId && <CheckoutSheet outletId={outletId} />}
    </div>
  );
}

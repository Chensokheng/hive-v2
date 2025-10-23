import React from "react";
import { useCheckoutStore } from "@/store/checkout";
import { useOutletStore } from "@/store/outlet";
import { useTranslations } from "next-intl";

import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";

export default function CheckOutFee({ outletId }: { outletId: number }) {
  const t = useTranslations("checkout");
  const { data: user } = useGetUserInfo();
  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    outletId
  );
  const selectedPromotionCode = useCheckoutStore(
    (state) => state.selectedPromotionCode
  );

  const cardDiscount = unpaidItem?.discountDetails?.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const isDelivery = useOutletStore((state) => state.isDelivery);

  return (
    <div className="px-5 space-y-4 pb-2">
      <h1 className="text-[#161F2F] font-bold">{t("summary")}</h1>
      <div className="flex items-center justify-between pl-2">
        <div className="space-x-2">
          <span className="text-[#303D5599]">{t("subtotal")}:</span>
          <span className="font-semibold text-[#161F2F]">
            {unpaidItem?.totalQuantity} {t("items")}
          </span>
        </div>
        <span className="font-semibold text-[#161F2F]">
          ${unpaidItem?.subtotal}
        </span>
      </div>
      {isDelivery && (
        <div className="flex items-center justify-between pl-2">
          <div className="space-x-2">
            <span className="text-[#303D5599]">{t("deliveryFee")}:</span>
            <span className="font-semibold text-[#161F2F]">
              {unpaidItem?.distance || 0} km
            </span>
          </div>
          <span className="font-semibold text-[#161F2F]">
            ${unpaidItem?.shippingFee?.toFixed(2)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between pl-2">
        <div className="space-x-2">
          <span className="text-[#303D5599]">{t("vat")}:</span>
        </div>
        <span className="font-semibold text-[#161F2F]">
          ${unpaidItem?.totalVat}
        </span>
      </div>
      {(selectedPromotionCode.discoundAmount || cardDiscount) !== 0 && (
        <div className="flex items-center justify-between pl-2">
          <div className="space-x-2">
            <span className="text-[#303D5599]">{t("promotion")}:</span>
          </div>
          <span className="font-semibold text-[#161F2F]">
            -${cardDiscount + selectedPromotionCode.discoundAmount}
          </span>
        </div>
      )}
    </div>
  );
}

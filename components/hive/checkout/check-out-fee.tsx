import React from "react";

import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";

export default function CheckOutFee({ outletId }: { outletId: number }) {
  const { data: user } = useGetUserInfo();
  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    outletId
  );

  return (
    <div className="px-5 space-y-4 pb-2">
      <h1 className="text-[#161F2F] font-bold">Summary</h1>
      <div className="flex items-center justify-between pl-2">
        <div className="space-x-2">
          <span className="text-[#303D5599]">Subtotal:</span>
          <span className="font-semibold text-[#161F2F]">
            {unpaidItem?.totalQuantity} items
          </span>
        </div>
        <span className="font-semibold text-[#161F2F]">
          ${unpaidItem?.subtotal}
        </span>
      </div>
      <div className="flex items-center justify-between pl-2">
        <div className="space-x-2">
          <span className="text-[#303D5599]">Delivery Fee:</span>
          <span className="font-semibold text-[#161F2F]">
            {unpaidItem?.distance || 0} km
          </span>
        </div>
        <span className="font-semibold text-[#161F2F]">
          ${unpaidItem?.shippingFee}
        </span>
      </div>
      <div className="flex items-center justify-between pl-2">
        <div className="space-x-2">
          <span className="text-[#303D5599]">Vat:</span>
        </div>
        <span className="font-semibold text-[#161F2F]">
          ${unpaidItem?.totalVat}
        </span>
      </div>
    </div>
  );
}

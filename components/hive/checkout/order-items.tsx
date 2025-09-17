import React from "react";
import { useOutletStore } from "@/store/outlet";
import { AsyncImage } from "loadable-image";
import { Minus, Plus } from "lucide-react";
import { Blur } from "transitions-kit";

import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Button } from "@/components/ui/button";

import OrderAddonDetail from "./order-addon-detail";

export default function OrderItems({ outletId }: { outletId: number }) {
  const setOpenCheckoutSheet = useOutletStore(
    (state) => state.setOpenCheckoutSheet
  );

  const { data: user } = useGetUserInfo();
  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    outletId
  );

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#161F2F] font-bold">Your order:</h1>
        <Button
          variant={"ghost"}
          className="font-medium text-primary cursor-pointer"
          onClick={() => setOpenCheckoutSheet(false)}
        >
          <span className="w-5 h-5 rounded-full bg-primary grid place-content-center text-white">
            <Plus />
          </span>
          Add More Items
        </Button>
      </div>
      <div>
        <div className="space-y-3">
          {unpaidItem?.items?.map((item) => {
            const isFree = item.cartDiscountedProduct || item.promotionCartItem;

            return (
              <div key={item.id} className="pb-4 border-b border-[#D8DEEE]">
                <div className="flex gap-3 items-start">
                  <AsyncImage
                    src={item.image}
                    Transition={Blur}
                    style={{
                      width: "56px",
                      height: "56px",
                    }}
                    className="object-center object-cover rounded-md"
                    loader={<div className="bg-gray-300" />}
                    alt={item.name}
                  />
                  <div className="flex-1">
                    <h1 className="font-semibold text-[#161F2F] ">
                      {item.name}
                    </h1>
                    {isFree && (
                      <p className="text-sm text-[#303D55]/60">
                        {item.quantity} Free
                      </p>
                    )}
                    <OrderAddonDetail text={item.formatedAddonItems} />
                  </div>
                  {!isFree && (
                    <div>
                      <h1 className="font-bold text-[#161F2F] text-right">
                        ${item.promotionPrice * item.quantity}
                      </h1>
                      <p className="text-sm text-[#303D55]/60">
                        ≈{item.promotionPrice * item.quantity * 4000}
                      </p>
                    </div>
                  )}
                </div>
                {!isFree && (
                  <div className="w-full flex justify-between items-end pl-[68px]">
                    <div className="flex flex-col items-start gap-2">
                      {item.note && (
                        <button className="text-primary font-semibold text-sm">
                          Edit
                        </button>
                      )}

                      {item.note && (
                        <span className="border-l-4 pl-2.5 py-1 border-[#FF66CC] text-[#161F2F] text-sm">
                          Note: {item.note} asdfasdfasfds
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center justify-end">
                      <button className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer">
                        <Minus className="w-4 h-4" />
                      </button>
                      {item.quantity}
                      <button className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

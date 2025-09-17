import React from "react";
import { useOutletStore } from "@/store/outlet";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export default function CheckoutHeader() {
  const setOpenCheckoutSheet = useOutletStore(
    (state) => state.setOpenCheckoutSheet
  );
  const isDelivery = useOutletStore((state) => state.isDelivery);
  const setIsDelivery = useOutletStore((state) => state.setIsDelivery);

  return (
    <>
      <div className="bg-white px-4 pt-15 sticky top-0 left-0 w-full z-50">
        <div
          className="flex items-center py-3 border-primary-bg absolute top-0 left-0 w-full bg-white"
          onClick={() => setOpenCheckoutSheet(false)}
        >
          <ChevronLeft className="text-primary w-8 h-8 cursor-pointer" />
          <h1 className="flex-1 text-center text-lg font-bold">Checkout</h1>
        </div>
      </div>

      <div className="flex px-4">
        <div className="flex p-1 bg-[#EBEFF7] rounded-full">
          <button
            className={cn(
              "py-2 px-4.5  rounded-full font-semibold cursor-pointer transition-all text-sm",
              {
                "bg-white text-[#161F2F]": isDelivery,
              }
            )}
            onClick={() => setIsDelivery(true)}
          >
            Delivery
          </button>

          <button
            className={cn(
              "py-2 px-4.5  rounded-full font-semibold cursor-pointer transition-all text-sm",
              {
                "bg-white text-[#161F2F]": !isDelivery,
              }
            )}
            onClick={() => setIsDelivery(false)}
          >
            Pickup
          </button>
        </div>
      </div>
    </>
  );
}

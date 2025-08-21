import React from "react";
import { useGlobalState } from "@/store";
import { ChevronLeft } from "lucide-react";

export default function CheckoutHeader() {
  const setCheckoutSheetOpen = useGlobalState(
    (state) => state.setCheckoutSheetOpen
  );
  return (
    <div
      className="flex items-center py-3 border-b border-primary-bg absolute top-0 left-0 w-full bg-white"
      onClick={() => setCheckoutSheetOpen(false)}
    >
      <ChevronLeft className="text-primary w-8 h-8 cursor-pointer" />
      <h1 className="flex-1 text-center text-lg font-bold">Checkout</h1>
    </div>
  );
}

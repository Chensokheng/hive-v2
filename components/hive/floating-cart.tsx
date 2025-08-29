"use client";

import { useGlobalState } from "@/store";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import CartIcon from "../icon/cart";
import EyeIcon from "../icon/eye";

export function FloatingCart({
  quantity,
  isFetching,
}: {
  quantity: number;
  isFetching: boolean;
}) {
  const setCheckoutSheetOpen = useGlobalState(
    (state) => state.setCheckoutSheetOpen
  );

  return (
    <>
      {/* Floating Cart Button */}
      <div
        className={cn(
          "fixed  right-3 z-50 transition-all ",
          quantity === 0 ? "-bottom-50" : "bottom-10"
        )}
      >
        <button
          className="relative bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-15 sm:w-auto sm:px-6 h-15 flex items-center justify-center cursor-pointer"
          onClick={() => setCheckoutSheetOpen(true)}
        >
          {/* Cart Count Badge */}
          <div className="absolute -top-4 right-1 sm:-top-2 sm:-left-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
            {isFetching ? <Loader2 className=" animate-spin" /> : quantity}
          </div>

          {/* Icons */}
          <div className="flex items-center sm:space-x-4 text-white">
            <CartIcon />
            <div className="w-px h-6 bg-white/30 hidden sm:block" />
            <div className="hidden sm:block">
              <EyeIcon />
            </div>
          </div>
        </button>
      </div>
    </>
  );
}

"use client";

import { useGlobalState } from "@/store";
import { Eye, ShoppingBag } from "lucide-react";

export function FloatingCart() {
  const setCheckoutSheetOpen = useGlobalState(
    (state) => state.setCheckoutSheetOpen
  );
  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="relative bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => setCheckoutSheetOpen(true)}
        >
          {/* Cart Count Badge */}
          <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            {2}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 text-white">
            <ShoppingBag size={24} />
            <div className="w-px h-6 bg-white/30" />
            <Eye size={24} />
          </div>
        </button>
      </div>
    </>
  );
}

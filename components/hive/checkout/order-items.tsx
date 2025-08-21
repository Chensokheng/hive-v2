import React from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function OrderItems() {
  const orders = [1, 2];

  return (
    <div className="px-4  bg-white border-t-4 border-primary-bg">
      <div className="divide-y">
        {orders.map((order) => {
          return (
            <div
              className="w-full flex items-start gap-4 pt-4 pb-4"
              key={order}
            >
              <div className="relative aspect-square w-14 ">
                <Image
                  src="/fake/menu-popup.png"
                  alt="Example"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className=" flex items-start sm:items-start justify-between flex-1 flex-col sm:flex-row gap-2">
                <div className="space-y-2">
                  <h1 className=" font-semibold text-[#161F2F]">
                    Tendercrip + King Nuggets 4pcs
                  </h1>
                  <p className="text-sm text-[#303D55]/60">
                    No Ice, Extra shot
                  </p>

                  <p className="text-sm text-[#303D55]/60">
                    {"Note from user"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button className="rounded-full bg-primary/10 h-7 w-7 grid place-content-center cursor-pointer text-primary disabled:text-primary/50 ">
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-[#161F2F] font-bold">{1}</span>
                  <button className="rounded-full bg-primary/10 h-7 w-7 grid place-content-center cursor-pointer">
                    <Plus className="text-primary h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <h1 className=" font-semibold text-[#161F2F] text-right">$6</h1>
                <p className="text-sm text-[#303D55]/60"> ≈10000៛</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* summary */}
      <div className="py-6 space-y-4 border-t">
        <h2 className="font-bold text-[#161F2F]">Summary</h2>

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">
              Subtotal:{" "}
              <span className="font-semibold text-[#161F2F]">
                {orders.length} items
              </span>
            </span>
            <span className="font-semibold text-[#161F2F]">$6</span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">
              Delivery Fee:{" "}
              <span className="font-semibold text-[#161F2F]">0 km</span>
            </span>
            <span className="font-semibold text-[#161F2F]">$6</span>
          </div>

          {/* Promotion */}
          <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">Promotion:</span>
            <span className="font-semibold text-[#161F2F]">$6</span>
          </div>
        </div>

        {/* Note textarea */}
        <div className="mt-6">
          <Input
            className="rounded-2xl h-14"
            placeholder="Any note for this store?"
            autoFocus={false}
            tabIndex={-1}
          />
        </div>
      </div>
    </div>
  );
}

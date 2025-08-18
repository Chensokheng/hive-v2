import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function MenuCard() {
  return (
    <div className="bg-white inline-block rounded-xl">
      <div className="h-40 w-full   sm:h-70 sm:w-70 relative">
        <Image
          src={"/fake/promotions.png"}
          alt=""
          className=" object-cover rounded-t-xl"
          fill
        />
        <div className=" absolute top-3 right-3 h-9 w-9 rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer">
          <Plus className="text-primary" />
        </div>
      </div>
      <div className="px-5 py-4">
        <h1 className="text-[#161F2F] font-semibold">Menu title</h1>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary">$ 2.5$</span>
          </div>
          <span className="text-xs font-medium text-[#363F4F]/60">≈10000៛</span>
        </div>
      </div>
    </div>
  );
}

import React from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import SearchIcon from "@/components/icon/search";

export default function loading() {
  return (
    <div className="min-h-[90vh]">
      <div className="max-w-[1200px] mx-auto py-5 px-5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-3 bg-gray-300" />/{" "}
          <Skeleton className="w-20 h-3 bg-gray-300" />
        </div>
        <Skeleton className=" w-48 h-8 bg-gray-300 mt-8" />

        <div className="relative z-10 flex-1 max-w-[384px] my-6">
          <Input
            className="bg-white rounded-full shadow-none h-10 w-full pl-10"
            placeholder="Search branch"
          />
          <div className="absolute top-3  left-4  cursor-pointer">
            <SearchIcon />
          </div>
        </div>
        <div className="grid  grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="max-w-[384px] h-44 bg-gray-200" />
          <Skeleton className="max-w-[384px] h-44 bg-gray-200" />
          <Skeleton className="max-w-[384px] h-44 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

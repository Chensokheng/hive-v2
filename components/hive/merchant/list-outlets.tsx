"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import useGetMerchantOutlets from "@/hooks/use-get-merchant-outlets";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import SearchIcon from "@/components/icon/search";

import OutletCard from "./outlet-card";

export default function ListOutlets() {
  const { merchant } = useParams() as { merchant: string };

  const { data: user, isLoading: LoadingUser } = useGetUserInfo();

  // Helper function to safely get sessionStorage values
  const getSessionStorageValue = (key: string): number | null => {
    if (typeof window !== "undefined") {
      const value = sessionStorage.getItem(key);
      return value ? Number(value) : null;
    }
    return null;
  };

  const { data: merchantData, isLoading } = useGetMerchantOutlets(
    merchant,
    user?.latitude || getSessionStorageValue("lat") || 0,
    user?.longtitude || getSessionStorageValue("lng") || 0,
    !LoadingUser
  );

  const filterOptions = [2000, 5000, 7000, 10000];
  const [selectedFilter, setSelectedFilter] = useState(10000);
  const [ouletName, setOuletName] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-2">
        <div className="relative z-10 flex-1 max-w-[384px]">
          <Input
            className="bg-white rounded-full shadow-none h-10 w-full pl-10 border-none text-base"
            placeholder="Search branch"
            onChange={(e) => setOuletName(e.target.value)}
          />
          <div className="absolute top-2.5  left-3  cursor-pointer">
            <SearchIcon />
          </div>
        </div>
        <div className="flex lg:items-center flex-col lg:flex-row gap-2 lg:gap-5">
          <h1 className="fold-bold text-[#161F2F] font-semibold">Filter by:</h1>
          <div className="flex items-center gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={cn(
                  " text-[#303D5599] bg-[#EBEFF7] font-semibold px-4 py-2.5 rounded-full cursor-pointer hover:bg-[#0055DD1A] hover:text-primary transition-all",
                  {
                    "text-primary bg-[#0055DD1A]": selectedFilter === option,
                  }
                )}
                onClick={() => setSelectedFilter(option)}
              >
                {option === 10000 ? "<" : ""} {option / 1000} km
              </button>
            ))}
          </div>
        </div>
      </div>
      {!isLoading && merchantData?.outlets.length === 0 && (
        <div className="text-center text-gray-500">No outlets found</div>
      )}
      {isLoading && (
        <div className="grid  grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              className="maw-w-[384px] bg-white rounded-[16px] block py-5 pl-5 space-y-3"
              key={item}
            >
              <div>
                <Skeleton className="w-[72px] h-[72px] rounded-full bg-gray-300" />
              </div>

              <Skeleton className="w-50 h-[20px] rounded-md bg-gray-300" />
              <Skeleton className="w-[90%] h-[20px] rounded-md bg-gray-300" />
            </div>
          ))}
        </div>
      )}

      <div className="grid  grid-cols-1 gap-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {merchantData?.outlets
          .filter(
            (outlet) =>
              outlet.distance <= selectedFilter &&
              outlet.name.toLowerCase().includes(ouletName.toLowerCase())
          )
          .map((outlet) => {
            return (
              <OutletCard key={outlet.id} outlet={outlet} merchant={merchant} />
            );
          })}
      </div>
    </div>
  );
}

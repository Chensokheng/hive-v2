"use client";

import React, { useRef, useState } from "react";
import { seachAddressKeyword } from "@/services/address/search-address-keyword";
import { updateDeliveryAddress } from "@/services/address/update-delivery-address";
import { useAddresStore } from "@/store/address";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import useGetAddressByKeyword from "@/hooks/use-get-address-by-keyword";
import useGetUserInfo from "@/hooks/use-get-user-info";

import MapIcon from "../icon/map";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SearchAddress() {
  const [isLoading, setLoading] = useState(false);
  const setUnAuthAddress = useAddresStore((state) => state.setUnAuthAddress);
  const [search, setSearch] = useState("");
  const { data, isFetching } = useGetAddressByKeyword(search);
  const { data: user } = useGetUserInfo();
  const handleSearch = useDebouncedCallback((value: string) => {
    const userExistinLocatoin =
      user && user.latitude && user.longtitude
        ? `&lat=${user?.latitude}&lng=${user?.longtitude}`
        : "";

    const searchParam = "?keyword=" + value + userExistinLocatoin;
    setSearch(searchParam);
  }, 500);
  const [animationParent] = useAutoAnimate();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const sessoinsLocation = sessionStorage.getItem("address");

  const handleSelectAddress = async (value: {
    id: string;
    address: string;
  }) => {
    setLoading(true);
    if (user?.userId && user.token) {
      const res = await updateDeliveryAddress({
        userId: Number(user.userId),
        placeId: value.id,
        token: user.token,
      });
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      setSearch("");
      inputRef.current!.value = res.data.address;
    } else {
      const searchParam = "?keyword=" + value + "&placeId=" + value.id;

      const res = await seachAddressKeyword(searchParam);
      if (res.data.length) {
        inputRef.current!.value = res.data[0].address;
        setUnAuthAddress(res.data[0].address);
        sessionStorage.setItem("address", res.data[0].address);
        sessionStorage.setItem("lat", res.data[0].lat?.toString() ?? "");
        sessionStorage.setItem("lng", res.data[0].lng?.toString() ?? "");
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-3">
      <Label className="font-bold text-base">{"Choose Address"}</Label>

      <div className="relative">
        <div className=" absolute left-3 top-1/2 transform -translate-y-1/2">
          <MapIcon fill="#0055DD" />
        </div>

        <Input
          defaultValue={user?.placeAddress || sessoinsLocation || ""}
          ref={inputRef}
          className=" rounded-full bg-[#EBEFF7] h-10 border-none pl-10 w-full pr-10"
          tabIndex={-1}
          placeholder="Enter delivery address"
          onChange={(e) => handleSearch(e.target.value)}
        />
        {(isFetching || isLoading) && (
          <div className=" absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <Loader className=" animate-spin" />
          </div>
        )}

        {(user?.placeAddress || sessoinsLocation) && !isLoading && (
          <button
            className=" absolute top-1/2 right-3 transform -translate-y-1/2  cursor-pointer z-50"
            onClick={() => {
              inputRef.current!.value = "";
              setSearch("");
              inputRef.current!.focus();
            }}
          >
            <X className=" w-4 h-4" />
          </button>
        )}

        <div
          className={cn(
            "absolute mt-2 -bottom-auto right-0 h-auto w-full rounded-xl bg-white  transition-all duration-300 divide-y",
            {
              "border  ": data?.data.length,
            }
          )}
          ref={animationParent}
        >
          {data?.data.map((value, index) => {
            return (
              <button
                key={value.id}
                className={cn(
                  "p-5 border-gray-200 cursor-pointer hover:bg-primary/10 transition-all text-left w-full",
                  {
                    "rounded-b-lg": index === data?.data.length - 1,
                    "rounded-t-lg": index === 0,
                    "opacity-0": isFetching,
                    "animate-pulse": isLoading,
                  }
                )}
                onClick={() => handleSelectAddress(value)}
                disabled={isLoading}
              >
                <h1 className="text-sm lg:text-base">{value.address}</h1>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

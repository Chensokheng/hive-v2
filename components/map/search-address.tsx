"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
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

export default function SearchAddress({ className }: { className?: string }) {
  const [isLoading, setLoading] = useState(false);
  const { merchant } = useParams() as { merchant: string };

  const setUnAuthAddress = useAddresStore((state) => state.setUnAuthAddress);
  const [search, setSearch] = useState("");
  const { data, isFetching } = useGetAddressByKeyword(search);
  const { data: user } = useGetUserInfo();
  const handleSearch = useDebouncedCallback((value: string) => {
    // const userExistinLocatoin =
    //   user && user.latitude && user.longtitude
    //     ? `&lat=${user?.latitude}&lng=${user?.longtitude}`
    //     : "";

    const searchParam = "?keyword=" + value;
    setSearch(searchParam);
  }, 500);
  const [animationParent] = useAutoAnimate();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionsLocation = sessionStorage.getItem("address");

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
      await queryClient.invalidateQueries({ queryKey: ["user-info"] });
      queryClient.invalidateQueries({
        queryKey: ["merchant-outlets", merchant],
      });
      await queryClient.invalidateQueries({
        queryKey: ["outlet-menu-nearby"],
      });
      setSearch("");
      inputRef.current!.value = res.data.address;
      // setOpenAddressSheet(false);
    } else {
      const searchParam = "?keyword=" + value + "&placeId=" + value.id;

      const res = await seachAddressKeyword(searchParam);
      if (res.data.length) {
        setSearch("");
        inputRef.current!.value = res.data[0].address;
        setUnAuthAddress(res.data[0].address);
        sessionStorage.setItem("address", res.data[0].address);
        sessionStorage.setItem("lat", res.data[0].lat?.toString() ?? "");
        sessionStorage.setItem("lng", res.data[0].lng?.toString() ?? "");
        queryClient.setQueryData(["user-info"], {
          ...user,
          placeAddress: res.data[0].address,
          latitude: res.data[0].lat,
          longtitude: res.data[0].lng,
        });
        queryClient.invalidateQueries({
          queryKey: ["merchant-outlets", merchant],
        });
        // setOpenAddressSheet(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className={className}>
      <Label className="font-bold text-base">{"Choose Address"}</Label>

      <div className="relative">
        <div className=" absolute left-3 top-1/2 transform -translate-y-1/2">
          <MapIcon fill="#0055DD" />
        </div>

        <Input
          defaultValue={user?.placeAddress || sessionsLocation || ""}
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

        {(user?.placeAddress || sessionsLocation) &&
          !isLoading &&
          !isFetching && (
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
            "absolute mt-2 -bottom-auto right-0 h-auto w-full rounded-xl bg-white  transition-all duration-300 divide-y z-10",
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

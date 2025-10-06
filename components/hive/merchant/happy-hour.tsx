"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AsyncImage } from "loadable-image";
import { ChevronDown, Clock, Plus } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetHappyHourAvailableTimes from "@/hooks/use-get-happy-hour-available-times";
import useGetHappyHours from "@/hooks/use-get-happy-hours";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



import HappyHourCountDown from "./happy-hour-count-down";

export default function HappyHour() {
  const { merchant, outlet } = useParams();

  const { data: outletInfo, isLoading: isOutletLoading } = useGetOutletInfo(
    merchant as string,
    outlet as string,
    null,
    null
  );

  const { data: happyHourAvailableTimes, isLoading } =
    useGetHappyHourAvailableTimes(Number(outletInfo?.data.id));

  const [availableTimeId, setAvailableTimeId] = useState<number | undefined>(
    undefined
  );

  const {
    data: happyHour,
    isLoading: isHappyHourLoading,
    isRefetching,
  } = useGetHappyHours(Number(outletInfo?.data.id), availableTimeId!);
  const { data: rate } = useGetExchangeRate();

  useEffect(() => {
    setAvailableTimeId(Number(happyHourAvailableTimes?.data[0]?.id));
  }, [happyHourAvailableTimes]);

  if (isHappyHourLoading || isLoading || isOutletLoading || isRefetching) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h1 className="text-xl font-bold ">
            <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
              Discount Happy Hours!
            </span>
          </h1>
        </div>
        <div className="bg-[linear-gradient(270deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_100%),linear-gradient(270deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_100%)] p-5 lg:rounded-xl space-y-5">
          <div className="flex justify-between items-start lg:items-center flex-wrap lg:flex-row flex-col gap-2">
            {/* countdown placeholder */}
            <div className="animate-pulse flex items-center gap-3">
              <div className="h-6 w-20 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-24 bg-gray-200 rounded" />
            </div>

            {/* time selector placeholder (same size as button) */}
            <div className="animate-pulse">
              <div className="bg-gray-200 py-2 px-3 rounded-full h-9 w-40" />
            </div>
          </div>

          {/* cards row skeleton - match widths/heights */}
          <div className="flex items-center gap-2 overflow-x-auto flex-nowrap">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div className="shrink-0 w-[272px] rounded-lg bg-white" key={idx}>
                <div className="w-full aspect-square relative">
                  <div className="animate-pulse h-full w-full bg-gray-200 rounded-t-lg" />
                  <div className="absolute top-3 right-3 rounded-full bg-[#F7F7F7] grid place-content-center border border-white">
                    <div className="h-9 w-9 bg-gray-200 rounded-full" />
                  </div>

                  <div className="px-3 py-4 w-full space-y-2">
                    <div className="animate-pulse h-5 w-3/4 bg-gray-200 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse h-6 w-16 bg-gray-200 rounded" />
                      <div className="animate-pulse h-4 w-14 bg-gray-200 rounded" />
                    </div>
                    <div className="animate-pulse h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (happyHour?.data.length === 0 || !happyHour?.data) {
    return <></>;
  }

  const selectHappyHourAvailableTime = happyHourAvailableTimes?.data.find(
    (item) => item.id === availableTimeId
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-xl font-bold ">
          🤩{" "}
          <span className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent">
            Discount Happy Hours!
          </span>
        </h1>
      </div>
      <div className="bg-[linear-gradient(270deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_100%),linear-gradient(270deg,rgba(255,102,204,0.1)_0%,rgba(0,85,221,0.1)_100%)]  p-5 lg:rounded-xl space-y-5">
        <div className="flex justify-between items-start lg:items-center flex-wrap lg:flex-row flex-col gap-2">
          <HappyHourCountDown
            startTime={selectHappyHourAvailableTime?.availableTime.from!}
            endTime={selectHappyHourAvailableTime?.availableTime.to!}
          />

          <DropdownMenu>
            <DropdownMenuTrigger>
              {" "}
              <div className="bg-primary py-2 px-3 rounded-full text-white font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {selectHappyHourAvailableTime?.name}
                <ChevronDown className="w-4 h-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              {happyHourAvailableTimes?.data.map((item) => {
                return (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setAvailableTimeId(item.id)}
                    className={cn(
                      {
                        "bg-primary/10 text-primary":
                          item.id === availableTimeId,
                      },
                      "cursor-pointer text-center grid place-content-center font-medium"
                    )}
                  >
                    {item.name}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap">
          {happyHour?.data.map((item) => {
            return (
              <div
                className="shrink-0 w-[272px] rounded-lg bg-white hover:shadow transition-all cursor-pointer"
                key={item.id}
              >
                <div className="w-full aspect-square relative">
                  <AsyncImage
                    src={getImageUrl(item.thumbnail_image_name)}
                    Transition={Blur}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="rounded-t-lg object-center object-cover"
                    loader={<div className="bg-gray-300" />}
                    alt={item.name}
                  />
                  <div
                    className={cn(
                      " absolute top-3 right-3  rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer"
                    )}
                  >
                    <div
                      className={cn(
                        " h-9 w-9 grid place-content-center rounded-full"
                      )}
                    >
                      <Plus className="text-primary" />
                    </div>
                  </div>

                  <div className="px-3 py-4 w-full">
                    <h1 className="text-[#161F2F] font-semibold break-words overflow-hidden text-ellipsis">
                      {item.name}
                    </h1>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-primary">
                          ${item.happyHoursPrice}
                        </span>
                        {item.happyHoursPrice !== item.base_price && (
                          <span className=" line-through text-gray-400">
                            ${item.base_price}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#363F4F]/60">
                        ≈{Math.round(rate ? rate * item.happyHoursPrice : 0)}៛
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

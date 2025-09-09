import React from "react";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="min-h-screen">
      <nav className="flex lg:hidden items-center gap-2 sticky top-0 bg-white py-5 z-20 pr-8">
        <ChevronLeft />
        <div className="flex-1 items-center flex justify-center">
          <Skeleton className="h-5 w-20 bg-gray-200" />
        </div>
      </nav>
      <div className="max-w-[1200px] lg:flex  justify-center lg:justify-between t mx-auto gap-10 ">
        <div className="w-[282px] py-7 sticky top-15 self-start h-fit hidden lg:block">
          {/* Search input skeleton */}
          <div className="w-full relative">
            <div className="rounded-full bg-gray-200 animate-pulse w-full h-12 pl-12 py-5" />
            <div className="absolute top-3 left-4">
              <div className="w-6 h-6 bg-gray-300 animate-pulse rounded" />
            </div>
          </div>

          {/* "All" category skeleton */}
          <div className="px-4 py-2.5 bg-gray-200 animate-pulse rounded-full mt-6 mb-2 h-10 w-16" />

          {/* Category list skeleton */}
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className="px-4 py-2.5 bg-gray-200 animate-pulse rounded-full h-10"
                style={{
                  width: `${Math.random() * 60 + 120}px`, // Random widths between 120-180px
                }}
              />
            ))}
          </div>
        </div>
        {/* main content skeleton */}

        <div className=" w-full max-w-[900px] mx-auto lg:not-only-of-type:py-6 ">
          <nav
            className={cn(
              "items-center space-x-1 text-sm text-gray-600 mb-6 hidden  lg:flex"
            )}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-1">
                {index > 0 && <span className="text-gray-400">{"/"}</span>}
                <Skeleton
                  className={cn(
                    "h-4 rounded px-1 py-1 bg-gray-200",
                    // Vary the widths to make it look more realistic
                    index === 0 ? "w-12" : index === 3 - 1 ? "w-20" : "w-16"
                  )}
                />
              </div>
            ))}
          </nav>

          <div className="bg-white lg:rounded-2xl overflow-hidden lg:mb-8 shadow-sm lg:border border-gray-100 max-w-[900px] mx-auto">
            {/* Hero Image Skeleton */}
            <div className="relative w-full h-48 md:h-64 bg-gray-200 animate-pulse">
              {/* Logo positioned over hero image */}
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full animate-pulse border-4 border-white shadow-lg" />
              </div>
            </div>

            {/* Restaurant Info Skeleton */}
            <div className="p-6 pt-10 space-y-2">
              <div className="flex items-center justify-between">
                {/* Restaurant Name Skeleton */}
                <div className="h-8 md:h-9 bg-gray-200 rounded animate-pulse w-48" />

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
                  <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>

              {/* Location Skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
              </div>
            </div>
          </div>
          <div className=" my-6">
            <div className="bg-white block lg:hidden my-3 w-full">
              <div className="px-3 py-3 space-y-5">
                {/* Search skeleton */}
                <div className="w-full relative">
                  <Skeleton className="h-12 w-full rounded-full" />
                  <div className="absolute top-3 left-4">
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Categories skeleton */}
              <div className="overflow-x-auto scrollbar-hide w-full">
                <div className="flex gap-3.5 items-center snap-x snap-mandatory pb-2 px-3 min-w-max">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-8 w-20 rounded-full flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Skeleton className=" h-[200px] md:h-[400px] w-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

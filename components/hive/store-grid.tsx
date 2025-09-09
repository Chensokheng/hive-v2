"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import useGetAllMerchants from "@/hooks/use-get-all-merchants";
import MapPin from "@/components/icon/map-pin";

import BlurImage from "./blur-image";

export default function StoreGrid({ title = "All Store" }) {
  const params = useParams();
  const { locale } = params;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetAllMerchants();

  const allMerchants = data?.pages.flatMap((page) => page.merchants) ?? [];
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastMerchantElementRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  // Show error state
  if (error) {
    return (
      <div className="space-y-2">
        <h1 className="px-4 text-xl lg:text-3xl text-[#1A1D22] font-bold">
          {title}
        </h1>
        <div className="px-4 py-8 text-center">
          <p className="text-red-500">
            Error loading merchants. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show initial loading state
  if (isLoading) {
    return (
      <div className="space-y-2">
        <h1 className="px-4 text-xl lg:text-3xl text-[#1A1D22] font-bold">
          {title}
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 px-3 gap-2 lg:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-[6px] animate-pulse"
            >
              <div className="w-full aspect-[3/2] bg-gray-200 rounded-xl"></div>
              <div className="px-4 py-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h1 className="px-4 text-xl lg:text-3xl text-[#1A1D22] font-bold">
        {title}
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 px-3 gap-2 lg:gap-6">
        {allMerchants.map((merchant, index) => (
          <Link
            href={"/" + locale + merchant.href}
            key={merchant.id}
            ref={
              index === allMerchants.length - 1 ? lastMerchantElementRef : null
            }
            className="bg-white rounded-2xl p-[6px] hover:shadow-md transition-shadow"
          >
            <div className="relative w-full aspect-[3/2]">
              <BlurImage
                src={merchant.image}
                alt={merchant.name}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-center object-cover rounded-xl"
              />

              {/* tag */}
              {merchant.tag && (
                <div className="absolute top-0 left-0 rounded-tl-[8px] rounded-bl-[0px] rounded-tr-[0px] rounded-br-[8px] bg-primary text-white text-sm font-semibold px-2 py-1">
                  {merchant.tag}
                </div>
              )}
            </div>
            <div className="px-4 py-2">
              <h3 className="font-semibold text-[#161F2F] lg:text-lg">
                {merchant.name}
              </h3>

              {/* Rating and Category */}
              {merchant.category && (
                <div className="flex items-center gap-1">
                  {/* <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <span className="text-sm font-medium text-[#161F2F]">
                      {merchant.rating}
                    </span>
                  </div> */}
                  {/* <span className="text-gray-300">·</span> */}
                  <button className="text-primary text-sm">
                    {merchant.category}
                  </button>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-1">
                <MapPin color="#FF66CC" />
                <span className="text-sm text-[#303D55]/60">
                  {merchant.districtKh}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading indicator for fetching next page */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading more...</span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && allMerchants.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {"You've reached the end of the list"}
          </p>
        </div>
      )}

      {/* No results */}
      {!isLoading && allMerchants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No merchants found</p>
        </div>
      )}
    </div>
  );
}

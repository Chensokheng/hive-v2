"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PromotionSkeletonProps {
  itemCount?: number;
}

export default function PromotionSkeleton({
  itemCount = 6,
}: PromotionSkeletonProps) {
  return (
    <div className="w-auto lg:max-w-[1200px] mx-auto">
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div>
            {/* Title skeleton */}
            <div className="h-6 lg:h-8 w-48 lg:w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2" />

            {/* Subtitle skeleton */}
            <div className="h-4 lg:h-5 w-32 lg:w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex items-center">
            {/* Left Navigation Button skeleton */}
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse hidden md:flex lg:items-center lg:justify-center mr-2">
              <ChevronLeft className="w-8 h-8 text-gray-400" />
            </div>

            {/* Right Navigation Button skeleton */}
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse hidden md:flex lg:items-center lg:justify-center">
              <ChevronRight className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Skeleton Cards Container */}
        <div className="flex overflow-x-auto gap-3 lg:gap-6 scroll-smooth snap-x snap-mandatory hide-scroll">
          {Array.from({ length: itemCount }).map((_, index) => (
            <div
              key={index}
              className="relative w-[152px] h-[200px] lg:w-[282px] lg:h-[372px] flex-shrink-0 snap-start"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />

              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Hide scrollbar styles */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}

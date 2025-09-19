import { cn } from "@/lib/utils";

interface OrderCardSkeletonProps {
  className?: string;
}

export function OrderCardSkeleton({ className }: OrderCardSkeletonProps) {
  return (
    <div
      className={cn(
        "space-y-3 border-b-4 border-gray-200 px-6 pb-3 py-4 bg-white animate-pulse",
        className
      )}
    >
      {/* Header section with image, name, and quantity */}
      <div className="flex gap-2 items-start">
        {/* Outlet image skeleton */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0" />

        <div className="flex-1 space-y-2">
          {/* Outlet name skeleton */}
          <div className="h-5 bg-gray-300 rounded w-3/4" />
          {/* Order ID skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Quantity skeleton */}
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      {/* Price section */}
      <div>
        <div className="text-right space-y-1">
          {/* Price skeleton */}
          <div className="h-6 bg-gray-300 rounded w-20 ml-auto" />
          {/* Local currency skeleton */}
          <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
        </div>
      </div>

      {/* Footer section with type, date, and status */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {/* Order type skeleton */}
          <div className="h-4 bg-gray-200 rounded w-16" />
          <span className="text-gray-300">-</span>
          {/* Date skeleton */}
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>

        {/* Status skeleton */}
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

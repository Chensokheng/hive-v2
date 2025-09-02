export default function MerchantOutletsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Merchant name skeleton */}
      <div className="h-8 bg-gray-200 rounded-md w-64 mb-6"></div>

      {/* Outlets grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-5">
        {/* Generate 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full md:max-w-[384px] bg-white p-5 rounded-2xl space-y-3"
          >
            {/* Image skeleton */}
            <div className="w-[72px] h-[72px] bg-gray-200 rounded-full"></div>

            {/* Outlet name skeleton */}
            <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>

            {/* Distance and address skeleton */}
            <div className="flex items-center gap-2">
              {/* Map icon skeleton */}
              <div className="w-4 h-4 bg-gray-200 rounded"></div>

              {/* Distance skeleton */}
              <div className="h-4 bg-gray-200 rounded w-16"></div>

              {/* Address skeleton */}
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

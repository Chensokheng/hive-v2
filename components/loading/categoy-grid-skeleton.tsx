import { Skeleton } from "../ui/skeleton";

// Skeleton loading component for categories
export default function CategoryGridSkeleton() {
  return (
    <div className="relative">
      {/* Categories Container */}
      <div
        className="flex items-start overflow-x-auto gap-2 pr-8 scroll-smooth snap-x snap-mandatory hide-scroll ml-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Generate 8 skeleton items */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="items-center h-[120px] py-2 w-[105px] lg:w-[148px] lg:h-[106px] flex-shrink-0 flex flex-col snap-start gap-2 lg:justify-center"
          >
            {/* Image skeleton */}
            <Skeleton className="w-13 h-13 rounded-full mx-auto bg-gray-200" />

            {/* Text skeleton */}
            <Skeleton className="h-10 w-16 mx-auto bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

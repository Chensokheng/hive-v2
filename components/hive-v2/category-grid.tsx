"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";

import { cn, getImageUrl } from "@/lib/utils";
import useFoodCategories from "@/hooks/use-food-categories";

import CategoryGridSkeleton from "../loading/categoy-grid-skeleton";

interface CategoryItem {
  id: string;
  image: string;
  text: string;
  onClick?: () => void;
}

interface CategoryGridProps {
  categories?: CategoryItem[];
  selectedCategoryId?: string;
}

const defaultCategories: CategoryItem[] = [
  {
    id: "dessert",
    image: "/assets/mini/dessert.png",
    text: "Dessert",
  },
  {
    id: "fastfood",
    image: "/assets/mini/fastfood.png",
    text: "Fastfood",
  },
  {
    id: "fruit",
    image: "/assets/mini/fruit.png",
    text: "Fruits",
  },
  {
    id: "coffee",
    image: "/assets/mini/coffee.png",
    text: "Coffee",
  },
  {
    id: "dessert2",
    image: "/assets/mini/dessert.png",
    text: "Dessert",
  },
  {
    id: "fastfood2",
    image: "/assets/mini/fastfood.png",
    text: "Fastfood",
  },
  {
    id: "fruit2",
    image: "/assets/mini/fruit.png",
    text: "Fruits",
  },
  {
    id: "coffee2",
    image: "/assets/mini/coffee.png",
    text: "Coffee",
  },
  {
    id: "dessert3",
    image: "/assets/mini/dessert.png",
    text: "Dessert",
  },
  {
    id: "fastfood3",
    image: "/assets/mini/fastfood.png",
    text: "Fastfood",
  },
  {
    id: "fruit3",
    image: "/assets/mini/fruit.png",
    text: "Fruits",
  },
  {
    id: "coffee3",
    image: "/assets/mini/coffee.png",
    text: "Coffee",
  },
  {
    id: "dessert4",
    image: "/assets/mini/dessert.png",
    text: "Dessert",
  },
  {
    id: "fastfood4",
    image: "/assets/mini/fastfood.png",
    text: "Fastfood",
  },
  {
    id: "fruit4",
    image: "/assets/mini/fruit.png",
    text: "Fruits",
  },
  {
    id: "coffee4",
    image: "/assets/mini/coffee.png",
    text: "Coffee",
  },
];

export default function CategoryGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [categoryId, setCategoryId] = useQueryState("category", {
    defaultValue: "",
  });

  const { data, isLoading } = useFoodCategories();

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (id: number) => {
    if (categoryId === id.toString()) {
      setCategoryId("");
    } else {
      setCategoryId(id.toString());
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [data]);

  // Show skeleton loading when data is loading
  if (isLoading) {
    return <CategoryGridSkeleton />;
  }

  return (
    <div className="relative">
      {/* Left Navigation Button */}
      {showLeftButton && (
        <button
          onClick={scrollLeft}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full ransition-all duration-200  items-center justify-center cursor-pointer hidden lg:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 text-primary" />
        </button>
      )}

      {/* Right Navigation Button */}
      {showRightButton && (
        <button
          onClick={scrollRight}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full  transition-all duration-200  items-center justify-center cursor-pointer hidden lg:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 text-primary" />
        </button>
      )}

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-start overflow-x-auto gap-2 pl-8 pr-8 scroll-smooth snap-x snap-mandatory hide-scroll ml-5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {data?.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "items-center h-[98px] w-[98px] lg:w-[148px] lg:h-[106px] flex-shrink-0 flex flex-col snap-start cursor-pointer transition-all hover:bg-primary/5 rounded-lg gap-2 lg:justify-center",
              {
                "bg-primary/10": categoryId === item.id.toString(), // Keep index === 1 for backward compatibility
              }
            )}
            onClick={() => handleSelectCategory(item.id)}
          >
            <div className="w-13 h-13 relative mx-auto">
              <Image
                src={getImageUrl(item.image)}
                alt={item.name}
                fill
                className="object-cover object-center rounded-full"
              />
            </div>

            <h1 className="text-sm font-medium text-[#161F2F] text-center">
              {item.name_en}
            </h1>
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

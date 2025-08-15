import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

interface CategoryItem {
  id: string;
  label: string;
  count?: number;
}

interface CategorySidebarProps {
  categories: CategoryItem[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  className?: string;
}

export default function CategorySidebar({
  categories,
  activeCategory = "All",
  onCategoryChange,
  className,
}: CategorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        "w-full lg:w-80 rounded-2xl p-6 border border-gray-100",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4">
          <SearchIcon />
        </div>
        <Input
          type="text"
          placeholder="Search in menu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 h-12 rounded-full"
        />
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl transition-colors text-sm cursor-pointer font-semibold",
              activeCategory === category.id
                ? "bg-primary/10 text-primary  rounded-full"
                : "text-[#161F2F] hover:bg-gray-50"
            )}
          >
            <div className="flex justify-between items-center">
              <span>{category.label}</span>
              {/* {category.count && (
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full min-w-[24px] text-center",
                    activeCategory === category.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {category.count}
                </span>
              )} */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

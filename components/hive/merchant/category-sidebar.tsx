import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  isMobile?: boolean;
}

export default function CategorySidebar({
  categories,
  activeCategory = "All",
  onCategoryChange,
  className,
  isMobile = false,
}: CategorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <div className="w-full space-y-4 bg-white border p-2">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5">
            <SearchIcon />
          </div>
          <Input
            type="text"
            placeholder="Search in menu"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-white border h-12 rounded-full text-gray-500"
          />
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-3">
          {/* Dropdown indicator (optional) */}
          <button className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>

          {/* Scrollable category chips */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {filteredCategories.slice(0, 4).map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.id)}
                className={cn(
                  "flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  activeCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop vertical layout
  return (
    <div
      className={cn(
        "w-full lg:w-80 rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-6 lg:h-fit",
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

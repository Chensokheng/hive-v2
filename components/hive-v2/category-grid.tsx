"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

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
];

export default function CategoryGrid({
  categories = defaultCategories,
  selectedCategoryId,
}: CategoryGridProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pl-8 pr-8 scroll-smooth snap-x snap-mandatory hide-scroll ml-5">
      {categories.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "items-center h-[98px] w-[98px] flex-shrink-0 grid place-content-center snap-start cursor-pointer transition-all hover:bg-primary/5",
            {
              "bg-primary/10 rounded-lg":
                selectedCategoryId === item.id || index === 1, // Keep index === 1 for backward compatibility
            }
          )}
          onClick={item.onClick}
        >
          <div className="w-13 h-13 relative mx-auto">
            <Image
              src={item.image}
              alt={item.text}
              fill
              className="object-cover object-center"
            />
          </div>

          <h1 className="text-sm font-medium text-[#161F2F] text-center">
            {item.text}
          </h1>
        </div>
      ))}
    </div>
  );
}

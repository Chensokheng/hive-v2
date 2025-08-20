"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { AddonCategory, SelectedAddon } from "@/types";
import { ChevronLeft, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";


import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import AddonCategoryComponent from "./addon-category";

// Sample addon data - in real app this would come from props or API
const sampleAddonCategories: AddonCategory[] = [
  {
    id: 107,
    name: "Ice",
    required: 1,
    maximum_purchase: 1,
    minimum_purchase: 1,
    items: [
      {
        id: 330,
        status: 1,
        price: 0,
        name: "Ice In",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 107,
        master_addon_id: 330,
      },
      {
        id: 331,
        status: 1,
        price: 0,
        name: "Ice Out",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 107,
        master_addon_id: 331,
      },
    ],
  },
  {
    id: 108,
    name: "Sugar Level",
    required: 1,
    maximum_purchase: 1,
    minimum_purchase: 1,
    items: [
      {
        id: 332,
        status: 1,
        price: 0,
        name: "Sugar 0%",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 108,
        master_addon_id: 332,
      },
      {
        id: 333,
        status: 1,
        price: 0,
        name: "Sugar 50%",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 108,
        master_addon_id: 333,
      },
      {
        id: 334,
        status: 1,
        price: 0,
        name: "Sugar 30%",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 108,
        master_addon_id: 334,
      },
      {
        id: 335,
        status: 1,
        price: 0,
        name: "Sugar 20%",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 108,
        master_addon_id: 335,
      },
      {
        id: 336,
        status: 1,
        price: 0,
        name: "Sugar 10%",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 108,
        master_addon_id: 336,
      },
    ],
  },
  {
    id: 109,
    name: "Extra Toppings",
    required: 0,
    maximum_purchase: 3,
    minimum_purchase: 0,
    items: [
      {
        id: 337,
        status: 1,
        price: 0.5,
        name: "Extra Cheese",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 109,
        master_addon_id: 337,
      },
      {
        id: 338,
        status: 1,
        price: 0.75,
        name: "Extra Bacon",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 109,
        master_addon_id: 338,
      },
      {
        id: 339,
        status: 1,
        price: 0.25,
        name: "Extra Sauce",
        name_vi: "",
        name_th: "",
        minimum_purchase: 0,
        maximum_purchase: 1,
        addon_category_id: 109,
        master_addon_id: 339,
      },
    ],
  },
];

export default function AddMenuToCart() {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const basePrice = 4.75;

  const handleAddonChange = (
    categoryId: number,
    item: any,
    selected: boolean
  ) => {
    setSelectedAddons((prev) => {
      if (selected) {
        // Add the addon
        return [
          ...prev,
          {
            categoryId,
            itemId: item.id,
            name: item.name,
            price: item.price,
          },
        ];
      } else {
        // Remove the addon
        return prev.filter(
          (addon) =>
            !(addon.categoryId === categoryId && addon.itemId === item.id)
        );
      }
    });
  };

  const totalAddonPrice = useMemo(() => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  }, [selectedAddons]);

  const totalPrice = (basePrice + totalAddonPrice) * quantity;

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      if (increment) return prev + 1;
      return prev > 1 ? prev - 1 : 1;
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add Menu to Cart</Button>
      </SheetTrigger>
      <SheetContent
        showCloseBtn={false}
        className="max-w-full sm:max-w-[400px] w-full  border-0"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Menu Item</SheetTitle>
          <SheetDescription>Menu drawer to add menu to cart</SheetDescription>
        </SheetHeader>
        <div className=" overflow-y-auto relative hide-scroll">
          <div className="fixed sm:hidden top-0 left-0 z-50  backdrop-blur-2xl w-full p-2">
            <div className="  bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300 ">
              <ChevronLeft />
            </div>
          </div>

          <div className="relative aspect-square w-full">
            <Image
              src="/fake/menu-popup.png"
              alt="Example"
              fill
              className="object-cover"
            />
          </div>

          <div className="py-4 px-5">
            <h1 className=" font-semibold text-[#161F2F]">
              Tendercrip + King Nuggets 4pcs
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                ${basePrice.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-[#363F4F]/60">
                ≈10000៛
              </span>
            </div>
            <p className="text-sm text-[#303D55]/60">
              King Nuggets 4pcs, Include 2X Ketchup
            </p>

            {/* Addon Categories */}
            <div className="py-6 space-y-6">
              {sampleAddonCategories.map((category) => (
                <AddonCategoryComponent
                  key={category.id}
                  category={category}
                  selectedAddons={selectedAddons}
                  onAddonChange={handleAddonChange}
                />
              ))}
            </div>

            <div className="py-4 space-y-3 pb-32">
              <h1 className="text-sm font-semibold text-[#161F2F]">
                Note to merchant
              </h1>
              <Input
                className="rounded-2xl h-14"
                placeholder="e.g No onions, extra sauce, etc."
                autoFocus={false}
                tabIndex={-1}
              />
            </div>
          </div>
          {/* Add to cart button */}
          <div className="fixed flex-col bottom-0 gap-4 w-[400px] py-5 flex items-center justify-center bg-white px-5">
            <div className="flex items-center gap-4">
              <button
                className="rounded-full bg-primary/10 h-8 w-8 grid place-content-center cursor-pointer text-primary disabled:text-primary/50"
                disabled={quantity <= 1}
                onClick={() => handleQuantityChange(false)}
              >
                <Minus />
              </button>
              <span className="text-[#161F2F] font-bold">{quantity}</span>
              <button
                className="rounded-full bg-primary/10 h-8 w-8 grid place-content-center cursor-pointer"
                onClick={() => handleQuantityChange(true)}
              >
                <Plus className="text-primary" />
              </button>
            </div>
            <button className="font-bold text-lg rounded-full bg-primary py-3 w-full text-white">
              Add to Cart - ${totalPrice.toFixed(2)}{" "}
              <span className="text-xs font-medium">
                ≈{Math.round(totalPrice * 4100)}៛
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

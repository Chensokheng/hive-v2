"use client";

import React from "react";
import { AddonCategory, AddonItem, SelectedAddon } from "@/types";

interface AddonCategoryProps {
  category: AddonCategory;
  selectedAddons: SelectedAddon[];
  onAddonChange: (
    categoryId: number,
    item: AddonItem,
    selected: boolean
  ) => void;
}

export default function AddonCategoryComponent({
  category,
  selectedAddons,
  onAddonChange,
}: AddonCategoryProps) {
  const isMultipleSelection = category.maximum_purchase > 1;
  const isRequired = category.required === 1;

  const isItemSelected = (itemId: number) => {
    return selectedAddons.some(
      (addon) => addon.categoryId === category.id && addon.itemId === itemId
    );
  };

  const handleItemClick = (item: AddonItem) => {
    const isSelected = isItemSelected(item.id);

    if (!isMultipleSelection && !isSelected) {
      // For single selection, deselect all other items in this category first
      const currentSelectedInCategory = selectedAddons.find(
        (addon) => addon.categoryId === category.id
      );
      if (currentSelectedInCategory) {
        const currentItem = category.items.find(
          (i) => i.id === currentSelectedInCategory.itemId
        );
        if (currentItem) {
          onAddonChange(category.id, currentItem, false);
        }
      }
    }

    onAddonChange(category.id, item, !isSelected);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        <h3 className="text-sm font-semibold text-[#161F2F]">
          {category.name}
        </h3>
        {isRequired && <span className="text-red-500 text-sm">*</span>}
        {isMultipleSelection && (
          <span className="text-xs text-[#303D55]/60 ml-1">
            Multiple Option
          </span>
        )}
      </div>

      <div className="space-y-3 divide-y divide-gray-200">
        {category.items
          .filter((item) => item.status === 1)
          .map((item) => {
            const isSelected = isItemSelected(item.id);
            const priceDisplay =
              item.price > 0 ? `$${item.price.toFixed(2)}` : "$0";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between cursor-pointer pb-5"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {isMultipleSelection ? (
                      // Checkbox for multiple selection
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    ) : (
                      // Radio button for single selection
                      <div
                        className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                          isSelected ? "border-primary" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm ${isSelected ? "text-[#161F2F]" : "text-[#303D55]/60"}`}
                  >
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-[#161F2F]">
                  +{priceDisplay}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

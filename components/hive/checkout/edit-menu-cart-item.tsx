"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { useOutletStore } from "@/store/outlet";
import { SelectedAddon } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMenuAddOn from "@/hooks/use-get-menu-detail";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import XIcon from "@/components/icon/x";

import AddonCategoryComponent from "../merchant/addon-category";

// Utility function to convert cart addon items to SelectedAddon format
const convertCartAddonsToSelectedAddons = (
  cartAddonItems: any[],
  menuAddOn: any
): SelectedAddon[] => {
  if (!cartAddonItems || !menuAddOn?.addOn) return [];

  const selectedAddons: SelectedAddon[] = [];

  cartAddonItems.forEach((cartAddon) => {
    // Find the category and item details from menuAddOn
    for (const category of menuAddOn.addOn) {
      const item = category.items.find(
        (item: any) => item.id === cartAddon.addon_detail_id
      );
      if (item) {
        selectedAddons.push({
          categoryId: category.id,
          itemId: item.id,
          name: item.name,
          price: item.price,
        });
        break;
      }
    }
  });

  return selectedAddons;
};

export default function EditMenuCartItem() {
  const editCartItemData = useOutletStore((state) => state.editCartItemData);
  const editCartItemSheetOpen = useOutletStore(
    (state) => state.editCartItemSheetOpen
  );
  const setEditCartItemSheetOpen = useOutletStore(
    (state) => state.setEditCartItemSheetOpen
  );

  const [quantity, setQuantity] = useState(editCartItemData?.quantity || 1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>(
    editCartItemData?.selectedAddons || []
  );
  const noteRef = useRef(editCartItemData?.note || "");
  const [isPending, startTranstition] = useTransition();
  const queryClient = useQueryClient();

  const { data: menuAddOn } = useGetMenuAddOn(
    editCartItemData?.outletId || 0,
    editCartItemData?.menuItemId || 0
  );

  const { data: user } = useGetUserInfo();

  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId),
    Number(editCartItemData?.outletId || 0)
  );

  const [basePrice, setBasePrice] = useState(menuAddOn?.price || 0);

  const { data: rate } = useGetExchangeRate();

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

  // Check if all required addon categories have at least one selection
  const areRequiredAddonsSelected = useMemo(() => {
    if (!menuAddOn?.addOn) return true;

    const requiredCategories = menuAddOn.addOn.filter(
      (category) => category.required === 1
    );

    return requiredCategories.every((requiredCategory) =>
      selectedAddons.some((addon) => addon.categoryId === requiredCategory.id)
    );
  }, [menuAddOn?.addOn, selectedAddons]);

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      if (increment) return prev + 1;
      return prev > 1 ? prev - 1 : 1;
    });
  };

  const handleUpdateCart = async (isRemove: boolean = false) => {
    startTranstition(async () => {
      const addonDetails = selectedAddons.map((addon) => ({
        qty: 1,
        addon_detail_id: addon.itemId,
      }));

      const res = await addItemtoCart({
        cartItemId: editCartItemData?.cartItemId || null,
        userId: Number(user?.userId),
        outletId: editCartItemData?.outletId || 0,
        qty: isRemove ? 0 : quantity,
        menuItemId: editCartItemData?.menuItemId || 0,
        addNew: false, // This is an update, not a new item
        addonDetails: addonDetails,
        note: noteRef.current,
        token: user?.token,
      });

      if (!res.status) {
        toast.error("Failed to update cart item");
      } else {
        toast.success("Cart item updated successfully");
      }

      setEditCartItemSheetOpen(false);
      queryClient.invalidateQueries({
        queryKey: [
          "outlet-unpaid-item",
          user?.userId,
          editCartItemData?.outletId,
        ],
      });
    });
  };

  useEffect(() => {
    const isHasVariationAddOn = menuAddOn?.addOn.find(
      (item) => item.name.toLowerCase() === "variation"
    );
    if (!isHasVariationAddOn) {
      setBasePrice(menuAddOn?.price || 0);
    } else {
      setBasePrice(0);
    }
  }, [menuAddOn]);

  // Reset form when opening with new data
  useEffect(() => {
    if (editCartItemSheetOpen && editCartItemData && menuAddOn) {
      setQuantity(editCartItemData.quantity);
      // Convert cart addon items to SelectedAddon format
      const convertedAddons = convertCartAddonsToSelectedAddons(
        editCartItemData.selectedAddons,
        menuAddOn
      );
      setSelectedAddons(convertedAddons);
      noteRef.current = editCartItemData.note;
    }
  }, [editCartItemSheetOpen, editCartItemData, menuAddOn]);

  return (
    <Sheet open={editCartItemSheetOpen} onOpenChange={setEditCartItemSheetOpen}>
      <SheetContent
        showCloseBtn={false}
        className="max-w-full sm:max-w-[400px] w-full border-0"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Edit Menu Item</SheetTitle>
          <SheetDescription>Edit menu item in cart</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto relative hide-scroll">
          <div className="fixed sm:hidden top-0 left-0 z-50 backdrop-blur-2xl w-full p-2">
            <div
              className="bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => setEditCartItemSheetOpen(false)}
            >
              <ChevronLeft />
            </div>
          </div>

          <div className="hidden sm:block absolute top-0 right-0 z-50 p-2">
            <div
              className="bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => setEditCartItemSheetOpen(false)}
            >
              <XIcon />
            </div>
          </div>

          <div className="relative aspect-square w-full">
            <Image
              src={menuAddOn?.image || "/fake/menu-popup.png"}
              alt="Example"
              fill
              className="object-cover"
            />
          </div>

          <div className="py-4 px-5">
            <h1 className="font-semibold text-[#161F2F]">{menuAddOn?.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                ${menuAddOn?.price}
              </span>
              <span className="text-xs font-medium text-[#363F4F]/60">
                ≈{((menuAddOn?.price || 0) * (rate || 0)).toFixed(2)}៛
              </span>
            </div>
            <p className="text-sm text-[#303D55]/60">
              {menuAddOn?.description}
            </p>

            {/* Addon Categories */}
            <div className="py-6 space-y-6">
              {menuAddOn?.addOn.map((category) => (
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
                defaultValue={editCartItemData?.note || ""}
                onChange={(e) => (noteRef.current = e.target.value)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="fixed flex-col bottom-0 gap-4 w-full sm:w-[400px] py-5 flex items-center justify-center bg-white px-5">
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

            <div className="flex gap-3 w-full">
              <button
                className={cn(
                  "font-bold text-sm rounded-full bg-red-500 py-3 px-6 text-white flex-shrink-0",
                  isPending && "animate-pulse"
                )}
                onClick={() => handleUpdateCart(true)}
                disabled={isPending}
              >
                Remove
              </button>

              <button
                className={cn(
                  "font-bold  rounded-full py-3 flex-1 text-white transition-all duration-200",
                  isPending && "animate-pulse",
                  !areRequiredAddonsSelected
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                )}
                onClick={() => handleUpdateCart()}
                disabled={isPending || !areRequiredAddonsSelected}
              >
                {!areRequiredAddonsSelected
                  ? "Please select required options"
                  : `Update - $${totalPrice.toFixed(2)}`}{" "}
                {areRequiredAddonsSelected && (
                  <span className="text-xs font-medium">
                    ≈{(totalPrice * (rate || 0)).toFixed(2)}៛
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

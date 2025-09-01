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
import { useGlobalState } from "@/store";
import { SelectedAddon } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMenuAddOn from "@/hooks/use-get-menu-addOn";
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

import AddonCategoryComponent from "./addon-category";

export default function AddMenuToCart() {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const addOnMenuKey = useGlobalState((state) => state.addOnMenuKey);
  const noteRef = useRef("");
  const [isPending, startTranstition] = useTransition();
  const queryClient = useQueryClient();

  const { data: menuAddOn } = useGetMenuAddOn(
    addOnMenuKey.outletId,
    addOnMenuKey.menuItemId
  );

  const { data: user } = useGetUserInfo();

  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId),
    Number(addOnMenuKey.outletId)
  );

  const [basePrice, setBasePrice] = useState(menuAddOn?.price || 0);

  const addOnSheetOpen = useGlobalState((state) => state.addOnSheetOpen);
  const setAddOnSheetOpen = useGlobalState((state) => state.setAddOnSheetOpen);

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

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      if (increment) return prev + 1;
      return prev > 1 ? prev - 1 : 1;
    });
  };

  const handleAddToCart = async () => {
    startTranstition(async () => {
      const existingItem = unpaidItem?.items?.find(
        (item) => item.menuItemId === addOnMenuKey.menuItemId
      );

      const addonDetails = selectedAddons.map((addon) => ({
        qty: 1,
        addon_detail_id: addon.itemId,
      }));

      const isSameAddOn = addonDetails.every((addon) =>
        existingItem?.cartAddonItems.some(
          (item) => item.addon_detail_id === addon.addon_detail_id
        )
      );

      const cartId =
        isSameAddOn && existingItem?.note === noteRef.current
          ? existingItem?.id
          : null;

      const res = await addItemtoCart({
        cartItemId: cartId,
        userId: Number(user?.userId),
        outletId: addOnMenuKey?.outletId,
        qty: cartId ? quantity + (existingItem?.quantity || 0) : quantity,
        menuItemId: addOnMenuKey?.menuItemId,
        addNew: true,
        addonDetails: addonDetails,
        note: noteRef.current,
      });
      if (!res.status) {
        toast.error("Faild to add this item to cart");
      }
      setAddOnSheetOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", user?.userId, addOnMenuKey.outletId],
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

  return (
    <Sheet open={addOnSheetOpen} onOpenChange={setAddOnSheetOpen}>
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

          <div className=" hidden sm:block absolute top-0 right-0 z-50  p-2">
            <div className="  bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300 ">
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
            <h1 className=" font-semibold text-[#161F2F]">{menuAddOn?.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                ${menuAddOn?.price}
              </span>
              <span className="text-xs font-medium text-[#363F4F]/60">
                ≈{(menuAddOn?.price || 0) * (rate || 0)}៛
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
                onChange={(e) => (noteRef.current = e.target.value)}
              />
            </div>
          </div>
          {/* Add to cart button */}
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
            <button
              className={cn(
                "font-bold text-lg rounded-full bg-primary py-3 w-full text-white",
                isPending && " animate-pulse"
              )}
              onClick={() => handleAddToCart()}
            >
              Add to Cart - ${totalPrice.toFixed(2)}{" "}
              <span className="text-xs font-medium">
                ≈{Math.round(totalPrice * (rate || 0))}៛
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

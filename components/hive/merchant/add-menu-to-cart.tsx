"use client";

import React from "react";
import Image from "next/image";
import { useGlobalState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  note: z.string().optional(),
  quantity: z.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
});

export default function AddMenuToCart() {
  const openMenuToCartSheet = useGlobalState(
    (state) => state.openMenuToCartSheet
  );
  const setOpenMenuToCartSheet = useGlobalState(
    (state) => state.setOpenMenuToCartSheet
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      quantity: 1,
    },
  });

  const quantity = form.watch("quantity");
  const basePrice = 2.5;
  const totalPrice = quantity * basePrice;

  const incrementQuantity = () => {
    const currentQuantity = form.getValues("quantity");
    form.setValue("quantity", currentQuantity + 1);
  };

  const decrementQuantity = () => {
    const currentQuantity = form.getValues("quantity");
    if (currentQuantity > 1) {
      form.setValue("quantity", currentQuantity - 1);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    console.log("Total price:", totalPrice);
    // Here you can add the item to cart logic
    setOpenMenuToCartSheet(false);
  }

  return (
    <Drawer
      open={openMenuToCartSheet}
      onOpenChange={setOpenMenuToCartSheet}
      direction="right"
    >
      <DrawerContent className="w-full sm:max-w-md flex flex-col">
        <DrawerHeader className="hidden">
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>

        <div className="w-full h-96 relative">
          <Image
            src={"/fake/menu-popup.png"}
            alt=""
            fill
            className="object-cover object-center"
          />
          <div
            className=" absolute top-5 right-5 bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => setOpenMenuToCartSheet(false)}
          >
            <X />
          </div>
        </div>
        <div className="py-4 px-5">
          <h1 className="font-medium">Tendercrip + King Nuggets 4pcs</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">
                $ {basePrice}
              </span>
            </div>
            <span className="text-xs font-medium text-[#363F4F]/60">
              ≈10000៛
            </span>
          </div>
          <p className="text-sm text-[#303D55]/60">
            King Nuggets 4pcs, Include 2X Ketchup
          </p>
        </div>

        <div className="px-5 flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" h-full flex flex-col py-4"
            >
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Note to merchant
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Note for the driver"
                        {...field}
                        className="h-14 rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1 flex justify-end gap-2 flex-col">
                <div className="flex items-center justify-center gap-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus />
                  </Button>
                  <span className="font-medium">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-primary/10 text-primary"
                    onClick={incrementQuantity}
                  >
                    <Plus />
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full font-bold text-lg"
                >
                  Add to Cart - ${totalPrice.toFixed(2)}{" "}
                  <span className="text-xs font-normal">
                    ≈{(totalPrice * 4000).toLocaleString()}៛
                  </span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

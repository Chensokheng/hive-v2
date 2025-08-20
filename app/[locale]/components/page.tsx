"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import AddMenuToCart from "@/components/hive/merchant/add-menu-to-cart";

export default function Page() {
  return (
    <div>
      <Button onClick={() => {}}>AddToCart</Button>
      <AddMenuToCart />
    </div>
  );
}

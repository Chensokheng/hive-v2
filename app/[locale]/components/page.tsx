"use client";

import React from "react";

import AddMenuToCart from "@/components/hive/merchant/add-menu-to-cart";

export default function Page() {
  return (
    <div className="bg-primary/10 min-h-screen">
      <AddMenuToCart />
      <div className="bg-white h-96 flex items-center justify-center p-5"></div>
    </div>
  );
}

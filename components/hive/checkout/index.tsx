"use client";

import React from "react";

import { FloatingCart } from "../floating-cart";
import CheckoutSheet from "./checkout-sheet";

export default function Checkout() {
  return (
    <div className="w-full">
      <FloatingCart />
      <CheckoutSheet />
    </div>
  );
}

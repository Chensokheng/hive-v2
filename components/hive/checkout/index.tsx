"use client";

import React from "react";

import { FloatingCart } from "../floating-card";
import CheckoutSheet from "./checkout-sheet";

export default function Checkout() {
  return (
    <div className="w-full bg-blue-500">
      <FloatingCart />
      <CheckoutSheet />
    </div>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { AddressDrawer } from "./AddressDrawer";

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-20">
        <h1 className="text-2xl font-bold text-center mb-8">
          Food Delivery App
        </h1>
        <Button onClick={() => setIsDrawerOpen(true)} className="w-full">
          Select Delivery Address
        </Button>
      </div>

      <AddressDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

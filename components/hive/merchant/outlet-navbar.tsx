"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function OutletNavbar({ outletName }: { outletName: string }) {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <nav className="flex lg:hidden items-center gap-2 sticky top-0 bg-white py-2 z-20 pr-8">
      <ChevronLeft onClick={handleBack} />
      <h1 className="flex-1 text-center font-bold text-lg">{outletName}</h1>
    </nav>
  );
}

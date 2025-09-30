"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import ShareIcon from "@/components/icon/share";

export default function OutletMobileNav() {
  const { locale, outlet } = useParams();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className=" sticky top-0 w-full lg:hidden left-0 z-50">
      <nav className="max-w-md mx-auto bg-white  py-3 z-50 flex items-center justify-between pr-3">
        <div className="w-20 pl-3" onClick={handleBack}>
          <ChevronLeft className="text-primary w-8 h-8" />
        </div>
        <h1 className="flex-1 text-center capitalize font-medium">{outlet}</h1>
        <div className="w-20 flex justify-end">
          <ShareIcon />
        </div>
      </nav>
    </div>
  );
}

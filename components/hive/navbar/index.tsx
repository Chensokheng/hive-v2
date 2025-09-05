"use client";

import React from "react";
import { usePathname } from "@/i18n/navigation";

import { DesktopNav } from "../desktop-nav";
import { MobileNav } from "../mobile-nav";

export default function Navbar() {
  const pathname = usePathname();
  const displayPaths = ["/"];

  if (!displayPaths.includes(pathname)) {
    return null;
  }

  return (
    <>
      <DesktopNav />
      <div className="relative">
        <MobileNav />
        <div
          className="
          absolute
          w-[120vw] sm:w-[490px]
          left-[-30vw] sm:left-[-146px]
          top-[-80%]
          bottom-[72.09%]
          bg-[#0055DD]
          opacity-20
          blur-[150px] sm:blur-[200px]
          [transform:matrix(0.14,-0.99,-0.99,-0.14,0,0)]
        "
        />
      </div>
    </>
  );
}

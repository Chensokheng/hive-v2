"use client";

import React, { ReactNode } from "react";
import { useOutletStore } from "@/store/outlet";


export default function OutletClosed({ children }: { children: ReactNode }) {
  const isClosed = useOutletStore((state) => state.isClosed);

  return (
    <div className=" relative">
      <>{children}</>
      {isClosed && (
        <div className=" absolute top-0 w-full h-full bg-gray-100 opacity-50"></div>
      )}
    </div>
  );
}

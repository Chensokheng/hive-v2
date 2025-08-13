"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export default function Flag({
  src,
  text,
  className,
  alwaysDisplay = true,
}: {
  src: string;
  text: string;
  className?: string;
  alwaysDisplay: boolean;
}) {
  return (
    <div className={className}>
      <Image src={src} alt="en-flag" width={30} height={30} />
      <span className={cn(alwaysDisplay ? "" : "sm:block hidden")}>{text}</span>
    </div>
  );
}

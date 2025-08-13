import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative w-[60px] h-[30px] sm:w-[80px] sm:h-[40px] md:w-[100px] md:h-[50px]">
      <Image
        src={"/assets/logo.png"}
        alt="logo"
        fill
        className="object-contain"
      />
    </div>
  );
}

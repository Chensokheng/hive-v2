import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="relative w-[60px] h-[30px] sm:w-[80px] sm:h-[40px] md:w-[100px] md:h-[50px]">
        <Image
          src={"/assets/logo.png"}
          alt="logo"
          fill
          sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, 100px"
          className="object-contain"
        />
      </div>
    </Link>
  );
}

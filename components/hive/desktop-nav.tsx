"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";


import Auth from "./auth";
import SearchMerchant from "./landing/search-merchant";
import LangSwitcher from "./lang-switcher";
import Notification from "./notification";
import SelectDeliveryAddress from "./select-delivery-address";

export const DesktopNav = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/store";

  return (
    <nav className="px-5 py-[1.125rem] bg-white hidden items-center gap-10 xl:gap-50 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] lg:flex z-[50] sticky top-0 w-full justify-between">
      <div className="flex items-center gap-7">
        <Link href={"/"}>
          <div className="h-10 w-[5.875rem] relative">
            <Image
              src={"/assets/logo.png"}
              alt="logo"
              fill
              sizes="94px"
              priority
            />
          </div>
        </Link>

        <SelectDeliveryAddress />
      </div>

      {/* Search Section */}
      {isHomePage && <SearchMerchant />}

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <LangSwitcher>
          <div className="h-10 bg-[#EBEFF7] flex items-center px-3 rounded-full gap-2">
            <Image
              src={t("language.flag")}
              alt="english flag"
              width={20}
              height={20}
            />
            <h1>{t("language.current")}</h1>
          </div>
        </LangSwitcher>
        <Notification />
        <Auth />
      </div>
    </nav>
  );
};

"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import BellIcon from "@/components/icon/bell";
import MapPin from "@/components/icon/map-pin";
import SearchIcon from "@/components/icon/search";
import UserIcon from "@/components/icon/user";

import AuthDialog from "./auth-dialog";
import LangSwitcher from "./lang-switcher";

export const DesktopNav = () => {
  const t = useTranslations();

  return (
    <nav className="px-5 py-[1.125rem] bg-white hidden items-center gap-10 xl:gap-50 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] lg:flex z-[50] sticky top-0 w-full">
      <div className="flex items-center gap-7">
        <div className="h-10 w-[5.875rem] relative">
          <Image src={"/assets/logo.png"} alt="logo" fill />
        </div>

        <div className="flex-1 flex gap-2 sm:gap-3 items-center cursor-pointer">
          <div className="h-10 w-10 bg-[#FF66CC]/10 rounded-full grid place-content-center">
            <MapPin color="#FF66CC" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[#303D55]/60 text-xs font-medium">
              {t("nav.deliveryAddress")}
            </h2>
            <h1 className="text-[#161F2F] font-semibold text-sm sm:text-base truncate">
              {t("nav.enterDeliveryAddress")}
            </h1>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 flex-1">
        <Input
          className="bg-white rounded-full shadow-none h-10 w-full"
          placeholder={t("nav.search.placeholder")}
        />
        <div className="absolute top-2 sm:top-3 right-4 sm:right-6 cursor-pointer">
          <SearchIcon />
        </div>
      </div>

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
        <div className="h-10 w-10 bg-[#EBEFF7] rounded-full grid place-content-center shadow-sm cursor-pointer">
          <BellIcon />
        </div>
        <AuthDialog>
          <div className="bg-gradient-to-b to-[#FF66CC] from-[#0055DD] h-10 w-10 rounded-full grid place-content-center cursor-pointer">
            <UserIcon fill="white" />
          </div>
        </AuthDialog>
      </div>
    </nav>
  );
};

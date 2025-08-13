import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import MapPin from "../../icon/map-pin";

export default function StoreLocation() {
  const t = useTranslations("Navbar");

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2">
          <MapPin color="#FF66CC" />
          <span>{t("storeLocation")}</span>
          <ChevronDown className="text-[#888E9E]" />
        </div>
      </PopoverTrigger>
      <PopoverContent>{t("popoverContent")}</PopoverContent>
    </Popover>
  );
}

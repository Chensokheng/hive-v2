import React from "react";
import { ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import MapPin from "../../icon/map-pin";

export default function StoreLocation() {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2">
          <MapPin color="#FF66CC" />
          <span>Phnom Penh</span>
          <ChevronDown className="text-[#888E9E]" />
        </div>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

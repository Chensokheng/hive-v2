import React, { useRef } from "react";
import { useSearchStore } from "@/store/search";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

export default function SearchMerchant() {
  const inputRef = useRef(null);
  const t = useTranslations();

  const setSearchMerchantKeyword = useSearchStore(
    (state) => state.setSearchMerchantKeyword
  );
  const handleChangeSearchMerchant = useDebouncedCallback((value) => {
    setSearchMerchantKeyword(value);
    inputRef.current && (inputRef.current as HTMLInputElement).blur();
  }, 500);

  return (
    <div className="relative z-10 flex-1">
      <Input
        ref={inputRef}
        className="bg-white rounded-full shadow-none h-10 w-full"
        placeholder={t("nav.search.placeholder")}
        onChange={(e) => handleChangeSearchMerchant(e.target.value)}
      />
      <div className="absolute top-2 right-4 cursor-pointer">
        <SearchIcon />
      </div>
    </div>
  );
}

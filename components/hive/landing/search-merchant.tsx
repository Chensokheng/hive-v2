import React, { useEffect, useRef } from "react";
import { useSearchStore } from "@/store/search";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

export default function SearchMerchant() {
  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();

  const setSearchMerchantKeyword = useSearchStore(
    (state) => state.setSearchMerchantKeyword
  );
  const searchMerchantKeyword = useSearchStore(
    (state) => state.searchMerchantKeyword
  );

  const handleChangeSearchMerchant = useDebouncedCallback((value) => {
    setSearchMerchantKeyword(value);
  }, 500);

  useEffect(() => {
    if (searchMerchantKeyword) {
      inputRef.current!.value = searchMerchantKeyword.split("=")[1];
    }
  }, []);

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

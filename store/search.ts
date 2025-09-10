import { create } from "zustand";

interface SearchStoreState {
  searchMerchantKeyword: string;
  filterMerchantCategoryId: string;
  setSearchMerchantKeyword: (value: string) => void;
  setFilterMerchantCategoryId: (value: string) => void;
}

export const useSearchStore = create<SearchStoreState>()((set) => ({
  searchMerchantKeyword: "",
  filterMerchantCategoryId: "",
  setSearchMerchantKeyword: (value) =>
    set(() => ({ searchMerchantKeyword: value ? "&keyword=" + value : "" })),
  setFilterMerchantCategoryId: (value) =>
    set(() => ({
      filterMerchantCategoryId: value,
    })),
}));

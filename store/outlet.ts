import { create } from "zustand";

interface OutletStoreState {
  categoryId: number | null;
  openMenuSheet: boolean;
  selectedOutletMenu: {
    id: number;
    image: string;
    name: string;
    hasAddOn: boolean;
    price: number;
    promotionPrice: number;
  } | null;
  selectOutletId: number | null;
  setCategoryId: (value: number | null) => void;
  setOpenMenuSheet: (value: boolean) => void;
  setSelectedOutletMenu: (
    value: {
      id: number;
      image: string;
      name: string;
      hasAddOn: boolean;
      price: number;
      promotionPrice: number;
    } | null,
    outletId: number | null
  ) => void;
}

export const useOutletStore = create<OutletStoreState>()((set) => ({
  categoryId: null,
  openMenuSheet: false,
  selectedOutletMenu: null,
  selectOutletId: null,
  setCategoryId: (value) => set(() => ({ categoryId: value })),
  setOpenMenuSheet: (value) => set(() => ({ openMenuSheet: value })),
  setSelectedOutletMenu: (value, outletId) =>
    set(() => ({
      selectedOutletMenu: value,
      openMenuSheet: true,
      selectOutletId: outletId,
    })),
}));

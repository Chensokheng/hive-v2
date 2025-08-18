import { create } from "zustand";

interface GlobalState {
  count: number;
  checkoutSheetOpen: boolean;
  increase: (by: number) => void;
  setCheckoutSheetOpen: (value: boolean) => void;
  openMenuToCartSheet: boolean;
  setOpenMenuToCartSheet: (value: boolean) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  count: 0,
  checkoutSheetOpen: false,
  openMenuToCartSheet: false,
  increase: (by) => set((state) => ({ count: state.count + by })),
  setCheckoutSheetOpen: (value) =>
    set((state) => ({ checkoutSheetOpen: value })),
  setOpenMenuToCartSheet: (value) =>
    set((state) => ({ openMenuToCartSheet: value })),
}));

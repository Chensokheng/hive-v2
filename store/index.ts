import { create } from "zustand";

interface GlobalState {
  count: number;
  checkoutSheetOpen: boolean;
  increase: (by: number) => void;
  setCheckoutSheetOpen: (value: boolean) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  count: 0,
  checkoutSheetOpen: false,
  increase: (by) => set((state) => ({ count: state.count + by })),
  setCheckoutSheetOpen: (value) =>
    set((state) => ({ checkoutSheetOpen: value })),
}));

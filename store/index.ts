import { create } from "zustand";

interface GlobalState {
  checkoutSheetOpen: boolean;
  openMenuToCartSheet: boolean;
  selectCategoryId: string;
  authPhoneNumber: string;

  setCheckoutSheetOpen: (value: boolean) => void;
  setOpenMenuToCartSheet: (value: boolean) => void;
  setCategoryId: (value: string) => void;
  setAuthPhoneNumber: (value: string) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  checkoutSheetOpen: false,
  openMenuToCartSheet: false,
  selectCategoryId: "",
  authPhoneNumber: "",
  setAuthPhoneNumber: (value) => set((state) => ({ authPhoneNumber: value })),
  setCategoryId: (value) => set((state) => ({ selectCategoryId: value })),
  setCheckoutSheetOpen: (value) =>
    set((state) => ({ checkoutSheetOpen: value })),
  setOpenMenuToCartSheet: (value) =>
    set((state) => ({ openMenuToCartSheet: value })),
}));

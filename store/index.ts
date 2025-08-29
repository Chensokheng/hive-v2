import { create } from "zustand";

interface GlobalState {
  checkoutSheetOpen: boolean;
  openMenuToCartSheet: boolean;
  selectCategoryId: string;
  authPhoneNumber: string;
  isOrderChangeItem: boolean;

  setCheckoutSheetOpen: (value: boolean) => void;
  setOpenMenuToCartSheet: (value: boolean) => void;
  setCategoryId: (value: string) => void;
  setAuthPhoneNumber: (value: string) => void;
  setisOrderChangeItem: (value: boolean) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  checkoutSheetOpen: false,
  openMenuToCartSheet: false,
  selectCategoryId: "",
  authPhoneNumber: "",
  isOrderChangeItem: false,
  setAuthPhoneNumber: (value) => set((state) => ({ authPhoneNumber: value })),
  setCategoryId: (value) => set((state) => ({ selectCategoryId: value })),
  setCheckoutSheetOpen: (value) =>
    set((state) => ({ checkoutSheetOpen: value })),
  setOpenMenuToCartSheet: (value) =>
    set((state) => ({ openMenuToCartSheet: value })),
  setisOrderChangeItem: (value) =>
    set((state) => ({ isOrderChangeItem: value })),
}));

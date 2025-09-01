import { create } from "zustand";

interface GlobalState {
  checkoutSheetOpen: boolean;
  addOnSheetOpen: boolean;
  openMenuToCartSheet: boolean;
  selectCategoryId: string;
  authPhoneNumber: string;
  isOrderChangeItem: boolean;
  addOnMenuKey: {
    outletId: number;
    menuItemId: number;
  };

  setCheckoutSheetOpen: (value: boolean) => void;
  setAddOnSheetOpen: (value: boolean) => void;

  setOpenMenuToCartSheet: (value: boolean) => void;
  setCategoryId: (value: string) => void;
  setAuthPhoneNumber: (value: string) => void;
  setisOrderChangeItem: (value: boolean) => void;
  setAddOnMenu: (value: { outletId: number; menuItemId: number }) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  checkoutSheetOpen: false,
  addOnSheetOpen: false,
  openMenuToCartSheet: false,
  selectCategoryId: "",
  authPhoneNumber: "",
  isOrderChangeItem: false,
  addOnMenuKey: {
    outletId: 0,
    menuItemId: 0,
  },
  setAuthPhoneNumber: (value) => set(() => ({ authPhoneNumber: value })),
  setCategoryId: (value) => set(() => ({ selectCategoryId: value })),

  setCheckoutSheetOpen: (value) =>
    set((state) => ({ checkoutSheetOpen: value })),
  setOpenMenuToCartSheet: (value) =>
    set((state) => ({ openMenuToCartSheet: value })),
  setisOrderChangeItem: (value) =>
    set((state) => ({ isOrderChangeItem: value })),
  setAddOnMenu: (value) =>
    set(() => ({ addOnMenuKey: value, addOnSheetOpen: true })),
  setAddOnSheetOpen: (value) => set(() => ({ addOnSheetOpen: value })),
}));

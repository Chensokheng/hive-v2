import { create } from "zustand";

interface GlobalState {
  checkoutSheetOpen: boolean;
  addOnSheetOpen: boolean;
  editCartItemSheetOpen: boolean;
  openMenuToCartSheet: boolean;
  selectCategoryId: string;
  authPhoneNumber: string;
  isOrderChangeItem: boolean;
  addOnMenuKey: {
    outletId: number;
    menuItemId: number;
  };
  editCartItemData: {
    cartItemId: number;
    outletId: number;
    menuItemId: number;
    quantity: number;
    note: string;
    selectedAddons: any[];
  } | null;

  setCheckoutSheetOpen: (value: boolean) => void;
  setAddOnSheetOpen: (value: boolean) => void;
  setEditCartItemSheetOpen: (value: boolean) => void;

  setOpenMenuToCartSheet: (value: boolean) => void;
  setCategoryId: (value: string) => void;
  setAuthPhoneNumber: (value: string) => void;
  setisOrderChangeItem: (value: boolean) => void;
  setAddOnMenu: (value: { outletId: number; menuItemId: number }) => void;
  setEditCartItemData: (
    value: {
      cartItemId: number;
      outletId: number;
      menuItemId: number;
      quantity: number;
      note: string;
      selectedAddons: any[];
    } | null
  ) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  checkoutSheetOpen: false,
  addOnSheetOpen: false,
  editCartItemSheetOpen: false,
  openMenuToCartSheet: false,
  selectCategoryId: "",
  authPhoneNumber: "",
  isOrderChangeItem: false,
  addOnMenuKey: {
    outletId: 0,
    menuItemId: 0,
  },
  editCartItemData: null,
  setAuthPhoneNumber: (value) => set(() => ({ authPhoneNumber: value })),
  setCategoryId: (value) => set(() => ({ selectCategoryId: value })),

  setCheckoutSheetOpen: (value) =>
    set((state) => ({ checkoutSheetOpen: value })),
  setEditCartItemSheetOpen: (value) =>
    set((state) => ({ editCartItemSheetOpen: value })),
  setOpenMenuToCartSheet: (value) =>
    set((state) => ({ openMenuToCartSheet: value })),
  setisOrderChangeItem: (value) =>
    set((state) => ({ isOrderChangeItem: value })),
  setAddOnMenu: (value) =>
    set(() => ({ addOnMenuKey: value, addOnSheetOpen: true })),
  setAddOnSheetOpen: (value) => set(() => ({ addOnSheetOpen: value })),
  setEditCartItemData: (value) =>
    set(() => ({
      editCartItemData: value,
      addOnMenuKey: value
        ? { outletId: value.outletId, menuItemId: value.menuItemId }
        : { outletId: 0, menuItemId: 0 },
      editCartItemSheetOpen: value !== null,
    })),
}));

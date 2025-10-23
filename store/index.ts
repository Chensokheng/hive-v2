import { create } from "zustand";

interface GlobalState {
  jsBridgeStatus: string;
  checkoutSheetOpen: boolean;
  addOnSheetOpen: boolean;
  editCartItemSheetOpen: boolean;
  openMenuToCartSheet: boolean;
  selectCategoryId: string;
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
  isCloseMiniApp: boolean;
  setIsCloseMiniApp: (value: boolean) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  isCloseMiniApp: false,
  setIsCloseMiniApp: (value) => set(() => ({ isCloseMiniApp: value })),
  jsBridgeStatus: "pending",
  checkoutSheetOpen: false,
  addOnSheetOpen: false,
  editCartItemSheetOpen: false,
  openMenuToCartSheet: false,
  selectCategoryId: "",
  isOrderChangeItem: false,
  addOnMenuKey: {
    outletId: 0,
    menuItemId: 0,
  },
  editCartItemData: null,
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

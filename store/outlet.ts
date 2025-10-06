import { create } from "zustand";

interface OutletStoreState {
  searchMenu: string;
  isOpen: boolean;
  categoryId: number | null;
  openMenuSheet: boolean;
  selectedOutletMenu: {
    id: number;
    image: string;
    name: string;
    hasAddOn: boolean;
    price: number;
    promotionPrice: number;
    isCustomDiscounted: boolean;
    isHappyHourProduct?: boolean;
    happyHourMaxQtyPerOrder?: number;
    happyHourAvailableTimeId?: number | null;
  } | null;
  selectOutletId: number | null;
  openCheckoutSheet: boolean;
  isDelivery: boolean;
  checkoutUserTemInfo: {
    name: string;
    phoneNumber: string;
  } | null;
  checkoutNotes: {
    addressNote: string;
    storeNote: string;
  };
  editCartItemSheetOpen: boolean;
  editCartItemData: {
    cartItemId: number;
    outletId: number;
    menuItemId: number;
    quantity: number;
    note: string;
    selectedAddons: any[];
    isCustomDiscounted: boolean;
    isHappyHourProduct?: boolean;
    happyHourMaxQtyPerOrder?: number;
    happyHourAvailableTimeId?: number | null;
  } | null;
  setSearchMenu: (value: string) => void;

  setIsDelivery: (value: boolean) => void;
  setOpenCheckoutSheet: (value: boolean) => void;

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
      isCustomDiscounted: boolean;
      isHappyHourProduct?: boolean;
      happyHourMaxQtyPerOrder?: number;
      happyHourAvailableTimeId?: number | null;
    } | null,
    outletId: number | null
  ) => void;

  setCheckoutUserTemInfo: (
    value: {
      name: string;
      phoneNumber: string;
    } | null
  ) => void;
  setCheckoutNotes: (value: { addressNote: string; storeNote: string }) => void;

  setEditCartItemSheetOpen: (value: boolean) => void;
  setEditCartItemData: (
    value: {
      cartItemId: number;
      outletId: number;
      menuItemId: number;
      quantity: number;
      note: string;
      selectedAddons: any[];
      isCustomDiscounted: boolean;
      isHappyHourProduct?: boolean;
      happyHourMaxQtyPerOrder?: number;
      happyHourAvailableTimeId?: number | null;
    } | null
  ) => void;
  setOutletOpen: (value: boolean) => void;
}

export const useOutletStore = create<OutletStoreState>()((set) => ({
  isOpen: true,
  categoryId: null,
  openMenuSheet: false,
  selectedOutletMenu: null,
  selectOutletId: null,
  openCheckoutSheet: false,
  isDelivery: true,
  editCartItemSheetOpen: false,
  editCartItemData: null,
  searchMenu: "",
  setSearchMenu: (value) => set(() => ({ searchMenu: value })),
  setOutletOpen: (value) => set(() => ({ isOpen: value })),
  setIsDelivery: (value) => set(() => ({ isDelivery: value })),
  setOpenCheckoutSheet: (value) => set(() => ({ openCheckoutSheet: value })),
  setCategoryId: (value) => set(() => ({ categoryId: value })),
  setOpenMenuSheet: (value) => set(() => ({ openMenuSheet: value })),
  setSelectedOutletMenu: (value, outletId) =>
    set(() => ({
      selectedOutletMenu: value,
      openMenuSheet: true,
      selectOutletId: outletId,
    })),
  checkoutUserTemInfo: null,
  checkoutNotes: {
    addressNote: "",
    storeNote: "",
  },
  setCheckoutUserTemInfo: (value) =>
    set(() => ({ checkoutUserTemInfo: value })),
  setCheckoutNotes: (value) => set(() => ({ checkoutNotes: value })),
  setEditCartItemSheetOpen: (value) =>
    set(() => ({ editCartItemSheetOpen: value })),
  setEditCartItemData: (value) =>
    set(() => ({
      editCartItemData: value,
      editCartItemSheetOpen: value !== null,
    })),
}));

import { create } from "zustand";

interface AddressStoreState {
  openAddresSheet: boolean;
  unAuthAddress: string;
  savedAddressType: string;
  openDraggableMap: boolean;
  setOpenAddressSheet: (value: boolean) => void;
  setUnAuthAddress: (value: string) => void;
  setSavedAddressModal: (value: string) => void;
  setOpenDraggableMap: (value: boolean) => void;
}

export const useAddresStore = create<AddressStoreState>()((set) => ({
  openAddresSheet: false,
  unAuthAddress: "",
  savedAddressType: "",
  openDraggableMap: false,
  setOpenAddressSheet: (value) => set((state) => ({ openAddresSheet: value })),
  setUnAuthAddress: (value) => set(() => ({ unAuthAddress: value })),
  setSavedAddressModal: (value) =>
    set((state) => ({ savedAddressType: value })),
  setOpenDraggableMap: (value) => set((state) => ({ openDraggableMap: value })),
}));

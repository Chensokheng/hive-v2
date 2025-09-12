import { create } from "zustand";

interface AddressStoreState {
  openAddresSheet: boolean;
  unAuthAddress: string;
  setOpenAddressSheet: (value: boolean) => void;
  setUnAuthAddress: (value: string) => void;
}

export const useAddresStore = create<AddressStoreState>()((set) => ({
  openAddresSheet: false,
  unAuthAddress: "",
  setOpenAddressSheet: (value) => set((state) => ({ openAddresSheet: value })),
  setUnAuthAddress: (value) => set(() => ({ unAuthAddress: value })),
}));

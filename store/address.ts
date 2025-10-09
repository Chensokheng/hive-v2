import { create } from "zustand";

type MapContext = "user-location" | "saved-address";

// NOTE: We need to use this default location to render the map
export const DEFAULT_LAT_LNG = {
  lat: 11.550966450309836,
  lng: 104.9287729533798,
}; // Keystone building
export const DEFAULT_ADDRESS = "146 Norodom Blvd, Phnom Penh, Cambodia";

interface AddressStoreState {
  openAddresSheet: boolean;
  unAuthAddress: string;
  savedAddressType: string;
  openDraggableMap: boolean;
  mapContext: MapContext;
  setOpenAddressSheet: (value: boolean) => void;
  setUnAuthAddress: (value: string) => void;
  setSavedAddressModal: (value: string) => void;
  setOpenDraggableMap: (isOpen: boolean, context?: MapContext) => void;
}

export const useAddresStore = create<AddressStoreState>()((set) => ({
  openAddresSheet: false,
  unAuthAddress: "",
  savedAddressType: "",
  openDraggableMap: false,
  mapContext: "user-location",
  setOpenAddressSheet: (value) => set((state) => ({ openAddresSheet: value })),
  setUnAuthAddress: (value) => set(() => ({ unAuthAddress: value })),
  setSavedAddressModal: (value) =>
    set((state) => ({ savedAddressType: value })),
  setOpenDraggableMap: (isOpen, context = "user-location") =>
    set({ openDraggableMap: isOpen, mapContext: context }),
}));

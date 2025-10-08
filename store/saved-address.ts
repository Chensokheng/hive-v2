import { SavedLocation } from "@/services/address/saved-locations";
import { create } from "zustand";

interface LocationData {
  id: string;
  lat: number;
  lng: number;
  address: string;
}

interface AddressFormData {
  label: string;
  location?: LocationData;
}

interface SavedAddressStore {
  // Address form state for saved locations modal
  addressFormData: AddressFormData;
  setAddressFormData: (data: AddressFormData) => void;
  updateAddressFormField: <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K]
  ) => void;
  resetAddressForm: () => void;
}

interface SavedLocationStore {
  editingLocation: SavedLocation | null;
  setEditingLocation: (location: SavedLocation | null) => void;
}

const initialFormData: AddressFormData = {
  label: "",
  location: undefined,
};

export const useSavedAddressStore = create<SavedAddressStore>((set) => ({
  // Address form state
  addressFormData: initialFormData,
  setAddressFormData: (data) => set({ addressFormData: data }),
  updateAddressFormField: (field, value) =>
    set((state) => ({
      addressFormData: { ...state.addressFormData, [field]: value },
    })),
  resetAddressForm: () => set({ addressFormData: initialFormData }),
}));

export const useSavedLocationStore = create<SavedLocationStore>((set) => ({
  editingLocation: null,
  setEditingLocation: (location) => set({ editingLocation: location }),
}));

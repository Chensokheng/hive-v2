import { create } from "zustand";

interface OutletStoreState {
  categoryId: number | null;
  setCategoryId: (value: number | null) => void;
}

export const useOutletStore = create<OutletStoreState>()((set) => ({
  categoryId: null,
  setCategoryId: (value) => set(() => ({ categoryId: value })),
}));

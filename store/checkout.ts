import { create } from "zustand";

interface CheckoutStoreState {
  selectedPromotionCode: {
    code: string;
    id: number;
  };
  setSelectedPromotionCode: (value: { code: string; id: number }) => void;
}

export const useCheckoutStore = create<CheckoutStoreState>()((set) => ({
  selectedPromotionCode: { code: "", id: -1 },
  setSelectedPromotionCode: (value) =>
    set(() => ({ selectedPromotionCode: value })),
}));

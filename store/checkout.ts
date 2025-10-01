import { create } from "zustand";

interface CheckoutStoreState {
  selectedPromotionCode: {
    code: string;
    id: number;
    discoundAmount: number;
  };
  setSelectedPromotionCode: (value: {
    code: string;
    id: number;
    discoundAmount: number;
  }) => void;
}

export const useCheckoutStore = create<CheckoutStoreState>()((set) => ({
  selectedPromotionCode: { code: "", id: -1, discoundAmount: 0 },
  setSelectedPromotionCode: (value) =>
    set(() => ({ selectedPromotionCode: value })),
}));

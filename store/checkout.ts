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
  resetPromotCode: () => void;
}

export const useCheckoutStore = create<CheckoutStoreState>()((set) => ({
  selectedPromotionCode: { code: "", id: -1, discoundAmount: 0 },
  setSelectedPromotionCode: (value) =>
    set(() => ({ selectedPromotionCode: value })),
  resetPromotCode: () =>
    set(() => ({
      selectedPromotionCode: { code: "", id: -1, discoundAmount: 0 },
    })),
}));

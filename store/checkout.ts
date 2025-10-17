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
  feeUpdateState: {
    lastProcessedAddress: string | null;
    hasProcessedForCurrentAddress: boolean;
  };
  setFeeUpdateState: (address: string) => void;
  resetFeeUpdateState: () => void;
}

export const useCheckoutStore = create<CheckoutStoreState>()((set) => ({
  selectedPromotionCode: { code: "", id: -1, discoundAmount: 0 },
  setSelectedPromotionCode: (value) =>
    set(() => ({ selectedPromotionCode: value })),
  resetPromotCode: () =>
    set(() => ({
      selectedPromotionCode: { code: "", id: -1, discoundAmount: 0 },
    })),
  feeUpdateState: {
    lastProcessedAddress: null,
    hasProcessedForCurrentAddress: false,
  },
  setFeeUpdateState: (address) =>
    set((state) => ({
      feeUpdateState: {
        lastProcessedAddress: address,
        hasProcessedForCurrentAddress: true,
      },
    })),
  resetFeeUpdateState: () =>
    set(() => ({
      feeUpdateState: {
        lastProcessedAddress: null,
        hasProcessedForCurrentAddress: false,
      },
    })),
}));

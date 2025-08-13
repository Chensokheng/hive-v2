import { create } from "zustand";

interface GlobalState {
  count: number;
  increase: (by: number) => void;
}

export const useGlobalState = create<GlobalState>()((set) => ({
  count: 0,
  increase: (by) => set((state) => ({ count: state.count + by })),
}));

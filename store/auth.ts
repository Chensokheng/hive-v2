import { create } from "zustand";

interface AuthStoreState {
  authInfo: {
    authPhoneNumber: string;
    authUserName?: string;
    authNextAvailableOtpAt: number;
  };
  isResendOtp: boolean;
  setAuthInfo: (value: {
    authPhoneNumber: string;
    authUserName?: string;
    authNextAvailableOtpAt?: number;
  }) => void;
  setIsResendOtp: (value: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()((set) => ({
  authInfo: {
    authPhoneNumber: "",
    authUserName: "",
    authNextAvailableOtpAt: 0,
  },
  isResendOtp: false,
  setAuthInfo: (value) =>
    set(() => ({
      authInfo: {
        authPhoneNumber: value.authPhoneNumber,
        authUserName: value.authUserName,
        authNextAvailableOtpAt: value.authNextAvailableOtpAt ?? 0,
      },
    })),
  setIsResendOtp: (value) => set(() => ({ isResendOtp: value })),
}));

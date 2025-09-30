"use client";

import React, { useState } from "react";
import { sendOtp } from "@/services/auth/send-opt";
import signin from "@/services/auth/signin";
import signup from "@/services/auth/signup";
import { useAuthStore } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OtpIcon from "@/components/icon/otp";

import OtpCountDown from "./otp-count-down";

export default function AuthOptForm({
  onBack,
  currentStep,
}: {
  onBack?: () => void;
  currentStep?: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);
  const setIsResendOtp = useAuthStore((state) => state.setIsResendOtp);

  const [otpInputFocus, setOtpInputFocus] = useState<number | null>(null);
  const authInfo = useAuthStore((state) => state.authInfo);
  const isResetOtp = useAuthStore((state) => state.isResendOtp);
  const t = useTranslations("auth");
  const queryClient = useQueryClient();

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single character

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;

    if (authInfo.authUserName) {
      res = await signup(
        authInfo.authUserName,
        authInfo.authPhoneNumber,
        otp.join("")
      );
    } else {
      res = await signin(authInfo.authPhoneNumber, otp.join(""));
    }

    if (!res?.status) {
      toast.error(res?.message || "Failed to authenticate user");
    } else {
      toast.success("Login success");
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      document.getElementById("auth-trigger-dialog")?.click();
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    setLoading(true);
    const dataSendOtp = await sendOtp(authInfo.authPhoneNumber);

    if (
      !dataSendOtp.data.is_sent &&
      dataSendOtp.data.next_available_otp_at === 0
    ) {
      toast.error(dataSendOtp.data.message);
      setLoading(false);
      return;
    }

    setAuthInfo({
      authPhoneNumber: authInfo.authPhoneNumber,
      authUserName: authInfo.authUserName,
      authNextAvailableOtpAt: dataSendOtp.data.next_available_otp_at,
    });
    setIsResendOtp(false);
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-center w-full">
        <div className="bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(0,85,221,0.1)_100%)] w-25 h-25 grid place-content-center rounded-full">
          <OtpIcon />
        </div>
      </div>
      <div>
        <h1 className="text-[#161F2F] text-[1.5rem] font-bold">
          {t("otp.title")}
        </h1>
        <p className="text-[#303D55]/60">
          {t("otp.subtitle")}
          {authInfo.authPhoneNumber.slice(-3)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          {/* OTP Input Fields */}
          <div className="flex gap-3">
            {otp.map((digit, index) => (
              <Input
                disabled={currentStep === "register"}
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                onFocus={() => setOtpInputFocus(index)}
                onBlur={() => setOtpInputFocus(null)}
                className={cn(
                  "w-12 h-15 text-center text-lg font-semibold border-2 rounded-xl",
                  otpInputFocus === index &&
                    "ring-2 ring-[#3388FF] border-[#3388FF]",
                  digit && "border-green-500"
                )}
              />
            ))}
          </div>

          {/* Resend Code */}
          <div>
            {new Date() < new Date(authInfo.authNextAvailableOtpAt) &&
            !isResetOtp ? (
              <OtpCountDown />
            ) : (
              <p className="text-[#303D55]/60 text-sm">
                <span className="mr-2"> {t("otp.resendText")}</span>
                <button
                  type="button"
                  className="text-[#3388FF] font-semibold hover:underline "
                  onClick={resendOtp}
                >
                  {isLoading ? (
                    <Loader className=" animate-spin w-4 h-4" />
                  ) : (
                    t("otp.resend")
                  )}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-6">
          <Button
            type="submit"
            className="w-full rounded-full text-lg font-semibold py-6 cursor-pointer"
            disabled={otp.some((digit) => !digit) || isLoading}
          >
            {isLoading ? (
              <Loader className=" animate-spin w-4 h-4" />
            ) : (
              t("register.continue")
            )}
          </Button>

          {/* Back Button */}
          <button
            type="button"
            className="text-lg font-semibold flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setOtp(new Array(4).fill(""));
              onBack?.();
            }}
          >
            <ChevronLeft />
            {t("otp.back")}
          </button>
        </div>
      </form>
    </div>
  );
}

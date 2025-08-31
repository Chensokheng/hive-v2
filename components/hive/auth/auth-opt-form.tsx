"use client";

import React, { useState } from "react";
import signin from "@/services/auth/signin";
import { useGlobalState } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OtpIcon from "@/components/icon/otp";

export default function AuthOptForm({ onBack }: { onBack?: () => void }) {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [otpInputFocus, setOtpInputFocus] = useState<number | null>(null);
  const authPhoneNumber = useGlobalState((state) => state.authPhoneNumber);
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

    const res = await signin("963817838");

    if (!res.status) {
      toast.error(res.errorMessage);
    } else {
      toast.success("Login success");
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
      document.getElementById("auth-trigger-dialog")?.click();
    }
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
          {authPhoneNumber.slice(-3)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          {/* OTP Input Fields */}
          <div className="flex gap-3">
            {otp.map((digit, index) => (
              <Input
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
            <p className="text-[#303D55]/60 text-sm">
              {t("otp.resendText")}
              <button
                type="button"
                className="text-[#3388FF] font-semibold hover:underline"
              >
                {t("otp.resend")}
              </button>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-6">
          <Button
            type="submit"
            className="w-full rounded-full text-lg font-semibold py-6 cursor-pointer"
            disabled={otp.some((digit) => !digit)}
          >
            {t("otp.signUp")}
          </Button>

          {/* Back Button */}
          <button
            className="text-lg font-semibold flex items-center gap-2 cursor-pointer"
            onClick={onBack}
          >
            <ChevronLeft />
            {t("otp.back")}
          </button>
        </div>
      </form>
    </div>
  );
}

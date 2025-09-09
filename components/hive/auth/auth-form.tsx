import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import XIcon from "@/components/icon/x";

import BlurImage from "../blur-image";
import AuthOptForm from "./auth-opt-form";
import AuthRegisterForm from "./auth-register-form";

type AuthStep = "register" | "otp";

export default function AuthForm() {
  const [currentStep, setCurrentStep] = useState<AuthStep>("register");
  const pathname = usePathname();
  const router = useRouter();

  const handleRegisterSubmit = () => {
    setCurrentStep("otp");
  };

  const handleBackToRegister = () => {
    setCurrentStep("register");
  };

  const handleCloseDialog = () => {
    if (pathname === "/profile") {
      router.back();
    }
    document.getElementById("auth-trigger-dialog")?.click();
  };
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 h-[100dvh] lg:h-[775px]">
      <div className=" w-full h-full relative rounded-xl hidden lg:block">
        <BlurImage
          src={"/assets/auth-banner.png"}
          alt="auth-dialog-background"
          fill
          className="object-cover object-center rounded-xl rounded-tr-none"
          unoptimized
          priority
        />
      </div>
      <div className=" relative flex items-center justify-center px-6 sm:px-12 overflow-hidden">
        <div
          className=" absolute top-5 right-5 z-50  p-2"
          onClick={handleCloseDialog}
        >
          <div className="  bg-[#BDC5DB]  w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300">
            <XIcon stroke="white" />
          </div>
        </div>
        <div className="relative w-full h-full">
          {/* Slide Container */}
          <div
            className={`flex transition-transform duration-500 ease-in-out h-full ${
              currentStep === "register"
                ? "translate-x-0"
                : "-translate-x-[50%]"
            }`}
            style={{ width: "200%" }}
          >
            {/* Register Form Slide */}
            <div
              className={cn(
                "w-1/2 flex items-center justify-center ",
                currentStep === "otp" ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="w-full">
                <AuthRegisterForm onSubmit={handleRegisterSubmit} />
              </div>
            </div>

            {/* OTP Form Slide */}
            <div
              className={cn(
                "w-1/2 flex items-center justify-center transition-all",
                currentStep === "register" ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="w-full">
                <AuthOptForm onBack={handleBackToRegister} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

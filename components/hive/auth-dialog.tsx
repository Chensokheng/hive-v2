"use client";

import React, { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AuthRegisterForm from "../hive/auth-register-form";
import XIcon from "../icon/x";
import AuthOptForm from "./auth-opt-form";

type AuthStep = "register" | "otp";

export default function AuthDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("register");

  const handleRegisterSubmit = () => {
    setCurrentStep("otp");
  };

  const handleBackToRegister = () => {
    setCurrentStep("register");
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className=" max-w-full lg:max-w-[894px] p-0 rounded-none lg:rounded-xl border-none overflow-hidden shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="hidden">
          <DialogTitle>Create HIVE account</DialogTitle>
          <DialogDescription>Create HIVE account</DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 h-screen lg:h-[775px]">
          <div className=" w-full h-full relative rounded-xl hidden lg:block">
            <Image
              src={"/assets/auth-banner.png"}
              alt="auth-dialog-background"
              fill
              className="object-cover object-center rounded-xl rounded-tr-none"
            />
          </div>
          <div className=" relative flex items-center justify-center px-6 sm:px-12 overflow-hidden">
            <div className=" absolute top-0 right-0 z-50  p-2">
              <div className="  bg-[#BDC5DB]  w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300 ">
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
      </DialogContent>
    </Dialog>
  );
}

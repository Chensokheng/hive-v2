"use client";

import React, { useState } from "react";
import Image from "next/image";
import { checkUser } from "@/services/auth/check-user";
import { sendOtp } from "@/services/auth/send-opt";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CheckCircleIcon from "@/components/icon/check-circle";
import PhoneIcon from "@/components/icon/phone";
import UserOutline from "@/components/icon/user-outline";

export default function AuthRegisterForm({
  onSubmit: onSubmitCallback,
}: {
  onSubmit?: () => void;
}) {
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);
  const [isUserNotExist, setUserNotExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("auth");
  const [phoneInputFocus, setPhoneInputFocus] = useState(false);
  const [usernameInputFocus, setUsernameInputFocus] = useState(false);

  const FormSchema = z.object({
    username: z
      .string()
      .min(3, { message: t("register.validation.usernameRequired") })
      .optional(),

    phoneNumber: z
      .string()
      .min(1, { message: t("register.validation.phoneRequired") })
      .refine(
        (phone) => {
          // Remove all spaces, dashes, and other formatting
          const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

          // Check for Cambodia phone number patterns
          // Format 1: +855 followed by 8-9 digits (international format)
          // Format 2: 0 followed by 8-9 digits (local format)
          // Format 3: Direct 8-9 digits (without country code or leading 0)

          const cambodiaIntlPattern = /^\+855[1-9]\d{7,8}$/; // +855 + 8-9 digits
          const cambodiaLocalPattern = /^0[1-9]\d{7,8}$/; // 0 + 8-9 digits
          const cambodiaDirectPattern = /^[1-9]\d{7,8}$/; // 8-9 digits starting with 1-9

          return (
            cambodiaIntlPattern.test(cleanPhone) ||
            cambodiaLocalPattern.test(cleanPhone) ||
            cambodiaDirectPattern.test(cleanPhone)
          );
        },
        {
          message: t("register.validation.phoneInvalid"),
        }
      )
      .transform((phone) => {
        // Clean formatting characters
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

        // Remove leading zero for Cambodia local numbers
        if (cleanPhone.startsWith("0") && cleanPhone.length >= 9) {
          return cleanPhone.substring(1); // Remove the leading 0
        }

        return cleanPhone;
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Re-validate on every change
    defaultValues: {
      phoneNumber: "",
      username: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    const dataSendOtp = await sendOtp(data.phoneNumber);

    if (
      !dataSendOtp.data.is_sent &&
      dataSendOtp.data.next_available_otp_at === 0
    ) {
      toast.success("hh");
      toast.error(dataSendOtp.data.message);
      setIsLoading(false);
      return;
    }

    setAuthInfo({
      authPhoneNumber: data.phoneNumber,
      authUserName: data.username,
      authNextAvailableOtpAt: dataSendOtp.data.next_available_otp_at,
    });
    setIsLoading(false);

    onSubmitCallback?.();
  }

  // Watch form values and errors for real-time updates
  const phoneValue = form.watch("phoneNumber");
  const phoneError = form.formState.errors.phoneNumber;
  const phoneIsDirty = form.formState.dirtyFields.phoneNumber;
  const usernameValue = form.watch("username");
  const usernameError = form.formState.errors.username;
  const usernameIsDirty = form.formState.dirtyFields.username;

  const handleCheckIfUserExist = async () => {
    setIsLoading(true);
    const res = await checkUser(phoneValue);
    if (res.status) {
      if (!res.data) {
        setUserNotExist(!res.data);
      } else {
        const dataSendOtp = await sendOtp(phoneValue);
        if (
          !dataSendOtp.data.is_sent &&
          dataSendOtp.data.next_available_otp_at === 0
        ) {
          toast.success("hll");
          toast.error(dataSendOtp.data.message);
          setIsLoading(false);
          return;
        }
        setAuthInfo({
          authPhoneNumber: phoneValue,
          authNextAvailableOtpAt: dataSendOtp.data.next_available_otp_at,
        });
        onSubmitCallback?.();
      }
    }
    setIsLoading(false);
  };

  return (
    <div className=" space-y-12">
      <Image
        src={"/assets/logo.png"}
        alt="logo"
        height={36}
        width={94}
        className="mx-auto"
      />
      <div>
        <h1 className="text-[#161F2F] text-[1.5rem] font-bold">
          {t("register.title")}
        </h1>
        <p className="text-[#303D55]/60">{t("register.subtitle")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className={cn(isUserNotExist && "opacity-50")}>
                <FormControl
                  className={cn(
                    "border px-5 h-[60px]  rounded-2xl space-y-0 gap-0",
                    phoneInputFocus && !phoneError && "ring-2 ring-[#3388FF]",
                    phoneError && "ring-2 ring-red-500"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <PhoneIcon fill={phoneError ? "#FF0000" : "#0055DD"} />
                    <div className="flex-1 relative">
                      <label
                        className={cn(
                          "text-xs font-semibold text-[#303D55]/60",
                          !phoneValue && "hidden"
                        )}
                      >
                        {t("register.phoneNumber")}
                      </label>

                      <Input
                        readOnly={isUserNotExist}
                        type="tel"
                        placeholder={t("register.phonePlaceholder")}
                        {...field}
                        className=" p-0 h-6 w-full border-none shadow-none placeholder:text-base placeholder:text-[#303D55]/60 text-[#161F2F] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 md:text-base"
                        onChange={(e) => {
                          field.onChange(e);
                          // Trigger validation immediately on change
                          form.trigger("phoneNumber");
                        }}
                        onFocus={() => {
                          setPhoneInputFocus(true);
                        }}
                        onBlur={() => {
                          setPhoneInputFocus(false);
                        }}
                      />
                    </div>
                    {phoneIsDirty && !phoneError && (
                      <div className="bg-green-500 h-5 w-5 rounded-full grid place-content-center p-2">
                        <CheckCircleIcon fill="white" />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isUserNotExist && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl
                    className={cn(
                      "border px-5 h-[60px]  rounded-2xl space-y-0 gap-0",
                      usernameInputFocus &&
                        !usernameError &&
                        "ring-2 ring-[#3388FF]",
                      usernameError && "ring-2 ring-red-500"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <UserOutline
                        fill={usernameError ? "#FF0000" : "#0055DD"}
                      />
                      <div className="flex-1 relative">
                        <label
                          className={cn(
                            "text-xs font-semibold text-[#303D55]/60",
                            !usernameValue && "hidden"
                          )}
                        >
                          {t("register.username")}
                        </label>

                        <Input
                          type="text"
                          placeholder={t("register.usernamePlaceholder")}
                          {...field}
                          className=" p-0 h-6 w-full border-none shadow-none placeholder:text-base placeholder:text-[#303D55]/60 text-[#161F2F] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 md:text-base"
                          onFocus={() => {
                            setUsernameInputFocus(true);
                          }}
                          onBlur={() => {
                            setUsernameInputFocus(false);
                          }}
                        />
                      </div>
                      {usernameIsDirty && !usernameError && (
                        <div className="bg-green-500 h-5 w-5 rounded-full grid place-content-center p-2">
                          <CheckCircleIcon fill="white" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!isUserNotExist ? (
            <Button
              type="button"
              className="mt-12 w-full rounded-full text-lg font-semibold py-6 cursor-pointer"
              onClick={handleCheckIfUserExist}
              disabled={!phoneIsDirty || !!phoneError || isLoading}
            >
              {isLoading ? (
                <Loader className=" animate-spin w-4 h-4" />
              ) : (
                t("register.continue")
              )}
            </Button>
          ) : (
            <div className="space-y-5">
              <Button
                type="submit"
                className="mt-12 w-full rounded-full text-lg font-semibold py-6 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className=" animate-spin w-4 h-4" />
                ) : (
                  t("register.continue")
                )}
              </Button>

              <button
                type="button"
                className="text-lg font-semibold flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setUserNotExist(false);
                }}
              >
                <ChevronLeft />
                {t("otp.back")}
              </button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

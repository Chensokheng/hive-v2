"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGlobalState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
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

const FormSchema = z.object({
  username: z.string().min(3, { message: "Username is too short" }),

  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required." })
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
        message: "Please enter a valid phone number .",
      }
    )
    .transform((phone) => {
      // Normalize the phone number format
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

      // Convert to international format if not already
      if (cleanPhone.startsWith("+855")) {
        return cleanPhone;
      } else if (cleanPhone.startsWith("0")) {
        return "+855" + cleanPhone.substring(1);
      } else if (/^[1-9]\d{7,8}$/.test(cleanPhone)) {
        return "+855" + cleanPhone;
      }

      return cleanPhone;
    }),
});

export default function AuthRegisterForm({
  onSubmit: onSubmitCallback,
}: {
  onSubmit?: () => void;
}) {
  const setPhoneNumber = useGlobalState((state) => state.setAuthPhoneNumber);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phoneNumber: "",
      username: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form submitted:", data);
    // Call the callback to trigger slide animation
    setPhoneNumber(data.phoneNumber);
    onSubmitCallback?.();
  }
  const [phoneInputFocus, setPhoneInputFocus] = useState(false);
  const [usernameInputFocus, setUsernameInputFocus] = useState(false);
  const t = useTranslations("auth");

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
              <FormItem>
                <FormControl
                  className={cn(
                    "border px-5 h-[60px]  rounded-2xl space-y-0 gap-0",
                    phoneInputFocus &&
                      !form.getFieldState("phoneNumber").invalid &&
                      "ring-2 ring-[#3388FF]",
                    form.getFieldState("phoneNumber").invalid &&
                      "ring-2 ring-red-500"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <PhoneIcon
                      fill={
                        form.getFieldState("phoneNumber").invalid
                          ? "#FF0000"
                          : "#0055DD"
                      }
                    />
                    <div className="flex-1 relative">
                      <label
                        className={cn(
                          "text-xs font-semibold text-[#303D55]/60",
                          !form.watch("phoneNumber") && "hidden"
                        )}
                      >
                        {t("register.phoneNumber")}
                      </label>

                      <Input
                        type="tel"
                        placeholder={t("register.phonePlaceholder")}
                        {...field}
                        className=" p-0 h-6 w-full border-none shadow-none placeholder:text-base placeholder:text-[#303D55]/60 text-[#161F2F] appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0 md:text-base"
                        onFocus={() => {
                          setPhoneInputFocus(true);
                        }}
                        onBlur={() => {
                          setPhoneInputFocus(false);
                        }}
                      />
                    </div>
                    {form.getFieldState("phoneNumber").isDirty &&
                      !form.getFieldState("phoneNumber").invalid && (
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl
                  className={cn(
                    "border px-5 h-[60px]  rounded-2xl space-y-0 gap-0",
                    usernameInputFocus &&
                      !form.getFieldState("username").invalid &&
                      "ring-2 ring-[#3388FF]",
                    form.getFieldState("username").invalid &&
                      "ring-2 ring-red-500"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <UserOutline
                      fill={
                        form.getFieldState("username").invalid
                          ? "#FF0000"
                          : "#0055DD"
                      }
                    />
                    <div className="flex-1 relative">
                      <label
                        className={cn(
                          "text-xs font-semibold text-[#303D55]/60",
                          !form.watch("username") && "hidden"
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
                    {form.getFieldState("username").isDirty &&
                      !form.getFieldState("username").invalid && (
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
          <Button
            type="submit"
            className="mt-12 w-full rounded-full text-lg font-semibold py-6 cursor-pointer"
          >
            {t("register.continue")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

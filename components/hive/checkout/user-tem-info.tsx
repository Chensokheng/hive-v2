import React, { useEffect, useState } from "react";
import { useOutletStore } from "@/store/outlet";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function UserTemInfo({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const setCheckoutUserTemInfo = useOutletStore(
    (state) => state.setCheckoutUserTemInfo
  );
  const checkoutUserTemInfo = useOutletStore(
    (state) => state.checkoutUserTemInfo
  );
  const [isUserNotExist, setUserNotExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("auth");
  const [phoneInputFocus, setPhoneInputFocus] = useState(false);
  const [usernameInputFocus, setUsernameInputFocus] = useState(false);

  const FormSchema = z.object({
    username: z
      .string()
      .min(3, { message: t("register.validation.usernameRequired") }),

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
      phoneNumber: checkoutUserTemInfo?.phoneNumber || "",
      username: checkoutUserTemInfo?.name || "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setCheckoutUserTemInfo({
      name: data.username,
      phoneNumber: data.phoneNumber,
    });
    setOpen(false);
  }

  // Watch form values and errors for real-time updates
  const phoneValue = form.watch("phoneNumber");
  const phoneError = form.formState.errors.phoneNumber;
  const phoneIsDirty = form.formState.dirtyFields.phoneNumber;
  const usernameValue = form.watch("username");
  const usernameError = form.formState.errors.username;
  const usernameIsDirty = form.formState.dirtyFields.username;

  useEffect(() => {
    if (checkoutUserTemInfo?.name && checkoutUserTemInfo?.phoneNumber) {
      form.reset({
        phoneNumber: checkoutUserTemInfo.phoneNumber,
        username: checkoutUserTemInfo.name,
      });
    }
  }, [checkoutUserTemInfo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={() => {
          setOpen(!open);
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[400px] h-full lg:h-auto flex flex-col py-0 pb-6 px-0 rounded-none lg:rounded-2xl"
      >
        <DialogHeader
          onClick={() => {
            setOpen(!open);
          }}
        >
          <DialogTitle className="hidden">
            <ChevronLeft className="text-primary" />
            <span className="flex-1 text-center"> Update Delivery Info</span>
          </DialogTitle>
          <DialogDescription className="hidden">
            update user delivery info
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 ">
          <div
            className="pb-6 px-6 border-b flex items-center"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft />
            <h1 className=" font-bold text-2xl flex-1 text-center">
              Receiver Information
            </h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 px-5 mt-5"
            >
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
                            tabIndex={-1}
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
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className={cn(isUserNotExist && "opacity-50")}>
                    <FormControl
                      className={cn(
                        "border px-5 h-[60px]  rounded-2xl space-y-0 gap-0",
                        phoneInputFocus &&
                          !phoneError &&
                          "ring-2 ring-[#3388FF]",
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
                            tabIndex={-1}
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

              <div className="flex justify-end mt-5">
                <Button
                  type="submit"
                  className=" rounded-full text-lg font-semibold h-12 cursor-pointer w-full lg:w-auto"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? (
                    <Loader className=" animate-spin w-4 h-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import updateProfile from "@/services/auth/update-profile";
import uploadImage from "@/services/auth/upload-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CalendarIcon from "@/components/icon/calendar";
import CameraIcon from "@/components/icon/camera";
import CheckCircleIcon from "@/components/icon/check-circle";
import PhoneIcon from "@/components/icon/phone";
import UserOutline from "@/components/icon/user-outline";

import ProfileImage from "./profile-image";

interface ProfileSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettingsSheet({
  isOpen,
  onClose,
}: ProfileSettingsSheetProps) {
  const { data: user } = useGetUserInfo();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullnameInputFocus, setFullnameInputFocus] = useState(false);
  const [birthdateInputFocus, setBirthdateInputFocus] = useState(false);

  const FormSchema = z.object({
    fullName: z
      .string()
      .min(1, { message: "Fullname is required" })
      .min(3, { message: "Fullname must be at least 3 characters" }),
    birthdate: z
      .string()
      .optional()
      .refine(
        (date) => {
          if (!date) return true; // Optional field
          const selectedDate = new Date(date);
          const today = new Date();
          return selectedDate <= today;
        },
        { message: "Birthdate cannot be in the future" }
      ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: user?.userName || "",
      birthdate: user?.birthDate || "",
    },
  });

  // Watch form values and errors for real-time updates
  const fullnameValue = form.watch("fullName");
  const fullnameError = form.formState.errors.fullName;
  const fullnameIsDirty = form.formState.dirtyFields.fullName;
  const birthdateValue = form.watch("birthdate");
  const birthdateError = form.formState.errors.birthdate;
  const birthdateIsDirty = form.formState.dirtyFields.birthdate;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const formatISOToInputDate = (isoString: string | null) => {
    if (!isoString) return "";
    // Convert from ISO format "2025-01-10T00:00:00.000Z" to "YYYY-MM-DD"
    return isoString.split("T")[0];
  };

  const formatDateForAPI = (dateString: string) => {
    // Convert from "YYYY-MM-DD" to "DD/MM/YYYY" format for API
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.userName || "",
        birthdate: formatISOToInputDate(user.birthDate ?? null),
      });
    }
  }, [user, form]);

  // Reset image preview when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [isOpen]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user?.userId || !user?.token) {
      toast.error("User information not available");
      return;
    }

    setIsLoading(true);

    try {
      const imagePath = "assets";
      let imageName = "";

      // Upload image if one was selected
      if (selectedImage) {
        const uploadResponse = await uploadImage(selectedImage);
        if (uploadResponse.status && uploadResponse.data.length > 0) {
          imageName = uploadResponse.data[0].address;
        }
      }

      // Prepare update payload
      const updatePayload = {
        fullName: data.fullName,
        email: null,
        birthdate: data.birthdate ? formatDateForAPI(data.birthdate) : null,
        user_id: Number(user.userId),
        gender: 0,
        image_path: imagePath,
        image_name: imageName,
      };

      // Update profile
      const updateResponse = await updateProfile(updatePayload, user.token);

      if (updateResponse.status) {
        toast.success("Profile updated successfully");
        // Invalidate user info query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["user-info"] });
        onClose();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-[85%] max-w-md p-0"
        showCloseBtn={false}
        side="right"
      >
        <SheetHeader className="hidden">
          <SheetTitle className="hidden" aria-readonly>
            Profile Settings
          </SheetTitle>
          <SheetDescription className="hidden" aria-readonly>
            Update your profile information
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 border-b">
            <button onClick={onClose} className="p-1">
              <ChevronLeft className="w-6 h-6 text-[#161F2F]" />
            </button>
            <h1 className="text-[#161F2F] text-[1.375rem] font-bold">
              Profile
            </h1>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div
                className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#0055DD] to-[#FF66CC] cursor-pointer"
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : user?.image ? (
                  <ProfileImage className="w-full h-full rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0055DD] to-[#FF66CC] flex items-center justify-center">
                    <UserOutline fill="white" />
                  </div>
                )}

                {/* Camera Icon */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <CameraIcon fill="#0055DD" className="w-3 h-3" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Fullname Field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl
                        className={cn(
                          "border px-5 h-[60px] rounded-2xl space-y-0 gap-0",
                          fullnameInputFocus &&
                            !fullnameError &&
                            "ring-2 ring-[#3388FF]",
                          fullnameError && "ring-2 ring-red-500"
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <UserOutline
                            fill={fullnameError ? "#FF0000" : "#0055DD"}
                          />
                          <div className="flex-1 relative">
                            <label
                              className={cn(
                                "text-xs font-semibold text-[#303D55]/60",
                                !fullnameValue && "hidden"
                              )}
                            >
                              Fullname
                            </label>
                            <Input
                              type="text"
                              placeholder="Enter your fullname"
                              {...field}
                              className="p-0 h-6 w-full border-none shadow-none placeholder:text-base placeholder:text-[#303D55]/60 text-[#161F2F] appearance-none"
                              onFocus={() => setFullnameInputFocus(true)}
                              onBlur={() => setFullnameInputFocus(false)}
                            />
                          </div>
                          {fullnameIsDirty && !fullnameError && (
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

                {/* Phone Number Field (Disabled) */}
                <div className="border px-5 h-[60px] rounded-2xl space-y-0 gap-0 opacity-50">
                  <div className="flex items-center gap-3 w-full h-full">
                    <PhoneIcon fill="#0055DD" />
                    <div className="flex-1 relative">
                      <label className="text-xs font-semibold text-[#303D55]/60">
                        Phone number
                      </label>
                      <Input
                        type="tel"
                        value={user?.phone || ""}
                        readOnly
                        className="p-0 h-6 w-full border-none shadow-none placeholder:text-base placeholder:text-[#303D55]/60 text-[#161F2F] appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Birthdate Field */}
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl
                        className={cn(
                          "border px-5 h-[60px] rounded-2xl space-y-0 gap-0",
                          birthdateInputFocus &&
                            !birthdateError &&
                            "ring-2 ring-[#3388FF]",
                          birthdateError && "ring-2 ring-red-500"
                        )}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <CalendarIcon
                            fill={birthdateError ? "#FF0000" : "#0055DD"}
                          />
                          <div className="flex-1 relative">
                            <label
                              className={cn(
                                "text-xs font-semibold text-[#303D55]/60",
                                !birthdateValue && "hidden"
                              )}
                            >
                              Birthdate
                            </label>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="p-0 h-6 w-full border-none shadow-none placeholder:text-base placeholder:text-[#303D55]/60 text-[#161F2F] appearance-none"
                              onFocus={() => setBirthdateInputFocus(true)}
                              onBlur={() => setBirthdateInputFocus(false)}
                            />
                          </div>
                          {birthdateIsDirty && !birthdateError && (
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

                {/* Save Button */}
                <Button
                  type="submit"
                  className="mt-8 w-full rounded-full text-lg font-semibold py-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

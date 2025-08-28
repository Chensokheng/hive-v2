"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import useGetUserInfo from "@/hooks/use-get-user-info";
import { BottomNav } from "@/components/hive";
import AuthForm from "@/components/hive/auth-form";
import UserProfile from "@/components/hive/auth/user-profile";

export default function Page() {
  const { data: user, isLoading } = useGetUserInfo();

  return (
    <div className="block lg:hidden  min-h-[100dvh]">
      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className=" w-10 h-10 animate-spin text-primary" />
        </div>
      ) : user?.userId ? (
        <div className="p-5 h-[calc(100vh-80px)] overflow-hidden bg-[#F2F6FF]">
          <UserProfile />
        </div>
      ) : (
        <AuthForm />
      )}
      {user?.userId && <BottomNav />}
    </div>
  );
}

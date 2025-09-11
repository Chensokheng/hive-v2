"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import useGetUserInfo from "@/hooks/use-get-user-info";
import { BottomNav } from "@/components/hive";
import AuthForm from "@/components/hive/auth/auth-form";
import UserProfile from "@/components/hive/auth/user-profile";

export default function Page() {
  const { data: user, isLoading } = useGetUserInfo();

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        router.push("/");
      }
    };

    // Check immediately in case the page loads on a large screen
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="block lg:hidden  min-h-[100dvh]">
      {isLoading ? (
        <div className="h-[90vh] flex items-center justify-center">
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

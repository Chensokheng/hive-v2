"use client";

import React from "react";

import { BottomNav } from "@/components/hive";
import UserProfile from "@/components/hive/user-profile";

export default function page() {
  return (
    <div className="p-5 bg-[#F2F6FF] min-h-screen">
      <UserProfile />
      <BottomNav />
    </div>
  );
}

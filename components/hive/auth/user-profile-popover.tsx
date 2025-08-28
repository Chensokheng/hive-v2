import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import UserProfile from "./user-profile";

export default function UserProfilePopover({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[400px] rounded-xl bg-[#F2F6FF]  border-1 border-white mt-4 mr-5 shadow-[0px_24px_40px_rgba(0,0,0,0.24)] px-6 py-5">
        <UserProfile />
      </PopoverContent>
    </Popover>
  );
}

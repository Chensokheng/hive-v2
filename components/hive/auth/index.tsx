import React from "react";

import useGetUserInfo from "@/hooks/use-get-user-info";
import UserIcon from "@/components/icon/user";

import AuthDialog from "./auth-dialog";
import UserProfilePopover from "./user-profile-popover";

export default function Auth() {
  const { data: user, isLoading } = useGetUserInfo();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b to-[#FF66CC] from-[#0055DD] h-10 w-10 rounded-full grid place-content-center cursor-pointer">
        <UserIcon fill="white" />
      </div>
    );
  }

  if (user?.userId) {
    return (
      <UserProfilePopover>
        <div className="bg-gradient-to-b to-[#FF66CC] from-[#0055DD] h-10 w-10 rounded-full grid place-content-center cursor-pointer">
          <UserIcon fill="white" />
        </div>
      </UserProfilePopover>
    );
  }

  return (
    <AuthDialog>
      <div className="bg-gradient-to-b to-[#FF66CC] from-[#0055DD] h-10 w-10 rounded-full grid place-content-center cursor-pointer">
        <UserIcon fill="white" />
      </div>
    </AuthDialog>
  );
}

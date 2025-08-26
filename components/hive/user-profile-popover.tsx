import React from "react";
import Image from "next/image";
import {
  ChevronRight,
  LogOut,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import OrderHistoryIcon from "../icon/order-history";
import SettingIcon from "../icon/setting";
import StampIcon from "../icon/stamps";
import UserIcon from "../icon/user";
import VoucherIcon from "../icon/voucher";
import { Button } from "../ui/button";

export default function UserProfilePopover({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-[400px] rounded-xl bg-[#F2F6FF]  border-1 border-white mt-4 mr-5 shadow-[0px_24px_40px_rgba(0,0,0,0.24)] px-6 py-5">
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="bg-gradient-to-b to-[#FF66CC] from-[#0055DD] h-15 w-15 rounded-full grid place-content-center cursor-pointer">
            <UserIcon fill="white" />
          </div>
          <div>
            <h1 className=" font-bold text-[#161F2F] text-[1.375rem]">
              Chhim Ubol
            </h1>
            <p className="text-[#303D5599]">View Profile</p>
          </div>
        </div>
        <div className=" bg-[#FF83001A] rounded-2xl p-4 space-y-3 mt-5">
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-full grid place-content-center bg-[linear-gradient(180deg,#FFAB11_0%,#FF8300_100%)]">
              <Image
                src={"/assets/tm.png"}
                alt="tm logon"
                width={24}
                height={14}
              />
            </div>
            <h1 className="text-[#161F2F] text-xl font-bold">10,000៛</h1>
          </div>
          <h2 className="font-semibold text-[#303D5599]">
            TrueMoney reward balance
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-[10px] mt-2">
          <div className="bg-[#FF66CC1A] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <VoucherIcon />
              <h1 className="font-bold text-xl">6</h1>
            </div>

            <h2 className="font-semibold text-[#303D5599]">Vouchers </h2>
          </div>
          <div className="bg-[#FF66CC1A] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <StampIcon />
              <h1 className="font-bold text-xl">6</h1>
            </div>
            <h2 className="font-semibold text-[#303D5599]">Stamps</h2>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#D8DEEE] my-5"></div>
        <div className="space-y-2">
          <button className="text-black flex bg-whit p-4 rounded-2xl font-semibold bg-white w-full justify-between cursor-pointer">
            <div className="flex gap-3 items-center">
              <OrderHistoryIcon />
              <span>My Orders</span>
            </div>
            <ChevronRight className="text-[#BDC5DB]" />
          </button>
          <button className="text-black flex bg-whit p-4 rounded-2xl font-semibold bg-white w-full justify-between cursor-pointer">
            <div className="flex gap-3 items-center">
              <SettingIcon />
              <span>Settings</span>
            </div>
            <ChevronRight className="text-[#BDC5DB]" />
          </button>
        </div>
        <Button
          variant={"ghost"}
          className=" font-semibold text-base mt-5 w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}

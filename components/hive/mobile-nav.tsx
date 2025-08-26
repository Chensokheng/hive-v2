import Image from "next/image";

import BellIcon from "../icon/bell";
import MapPin from "../icon/map-pin";
import SearchIcon from "../icon/search";
import { Input } from "../ui/input";
import LangSwitcher from "./lang-switcher";

export const MobileNav = () => {
  return (
    <>
      <div className="flex items-center gap-7 justify-between sticky top-0 w-full z-50 px-5 py-[1.125rem]   lg:hidden overflow-hidden">
        <div className="h-10 w-[5.875rem] relative">
          <Image src={"/assets/logo.png"} alt="logo" fill />
        </div>
        <div className="flex items-center gap-4">
          <LangSwitcher>
            <div className="h-10 bg-white flex items-center w-10  justify-center rounded-full gap-2">
              <Image
                src={"/assets/en-flag.png"}
                alt="english flag"
                width={20}
                height={20}
              />
            </div>
          </LangSwitcher>

          <div className="h-10 w-10 bg-white rounded-full grid place-content-center cursor-pointer">
            <BellIcon />
          </div>
        </div>
      </div>
      <nav className="px-5 py-[1.125rem] space-y-8  items-center gap-5 xl:gap-50 w-full block lg:hidden ">
        <div className="flex-1 flex gap-2 items-center cursor-pointer">
          <div className="h-10 w-10  bg-[#FFFFFF] rounded-full grid place-content-center">
            <MapPin color="#FF66CC" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[#303D55]/60 text-xs font-medium">
              Delivery Address
            </h2>
            <h1 className="text-[#161F2F] font-semibold text-base truncate">
              Enter delivery address
            </h1>
          </div>
        </div>

        <div className="relative z-10 flex-1">
          <Input
            className="bg-white rounded-full shadow-none h-10 w-full"
            placeholder="What do you want today?"
          />
          <div className="absolute top-2 right-4 cursor-pointer">
            <SearchIcon />
          </div>
        </div>
      </nav>
    </>
  );
};

import Image from "next/image";
import { usePathname } from "@/i18n/navigation";

import BellIcon from "../icon/bell";
import MapPin from "../icon/map-pin";
import SearchIcon from "../icon/search";
import { Input } from "../ui/input";
import BottomNav from "./bottom-nav";
import LangSwitcher from "./lang-switcher";

export const MobileNav = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <nav className=" bg-transparent">
      <div className="flex items-center gap-7 justify-between w-full z-50 px-5 py-[1.125rem]   lg:hidden overflow-hidden">
        <div className="h-10 w-[5.875rem] relative">
          <Image src={"/assets/logo.png"} alt="logo" fill sizes="94px" />
        </div>
        <div className="flex items-center gap-4 z-50">
          <LangSwitcher>
            <div className="h-10 flex items-center w-10 bg-white justify-center rounded-full gap-2">
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
      <div className="px-5 py-[1.125rem] space-y-6  items-center gap-5 xl:gap-50 w-full block lg:hidden z-50 ">
        <div className="flex-1 flex gap-2 items-center cursor-pointer">
          <div className="h-10 w-10  bg-[#FFFFFF] rounded-full grid place-content-center z-50">
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

        {isHomePage && (
          <div className="relative z-10 flex-1">
            <Input
              className="bg-white rounded-full shadow-none h-10 w-full"
              placeholder="What do you want today?"
            />
            <div className="absolute top-2 right-4 cursor-pointer">
              <SearchIcon />
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </nav>
  );
};

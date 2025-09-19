import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import BellIcon from "../icon/bell";
import BottomNav from "./bottom-nav";
import SearchMerchant from "./landing/search-merchant";
import LangSwitcher from "./lang-switcher";
import SelectDeliveryAddress from "./select-delivery-address";

export const MobileNav = () => {
  const pathname = usePathname();
  const t = useTranslations();

  const isHomePage = pathname === "/";

  const cleanPath = pathname.split("?")[0];
  const isHistory = pathname === "/history";

  // Split the path into segments and check if there are exactly 2 non-empty segments
  const segments = cleanPath.split("/").filter(Boolean); // filter removes empty strings
  const isOutletPage = segments.length === 2;

  if (isOutletPage) {
    return <></>;
  }

  if (isHistory) {
    return <BottomNav />;
  }

  return (
    <nav className=" bg-transparent z-50">
      <div className="flex items-center gap-7 justify-between w-full z-50 px-5 py-[1.125rem]   lg:hidden overflow-hidden">
        <div className="h-10 w-[5.875rem] relative">
          <Image
            src={"/assets/logo.png"}
            alt="logo"
            fill
            sizes="94px"
            priority
          />
        </div>
        <div className="flex items-center gap-4 z-50">
          <LangSwitcher>
            <div className="h-10 flex items-center w-10 bg-white justify-center rounded-full gap-2">
              <Image
                src={t("language.flag")}
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
        <SelectDeliveryAddress />

        {isHomePage && <SearchMerchant />}
      </div>
      <BottomNav />
    </nav>
  );
};

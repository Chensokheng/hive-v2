import React from "react";

import Auth from "./auth";
import DeliveryAddress from "./delivery-address";
import LanguageSwitcher from "./language-switcher";
import Logo from "./logo";
import SearchButton from "./search-button";
import StoreLocation from "./store-location";

export default function MobileNavbar() {
  return (
    <div className="lg:hidden space-y-5 justify-between items-center">
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <StoreLocation />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Auth />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <DeliveryAddress />
        <SearchButton />
      </div>
    </div>
  );
}

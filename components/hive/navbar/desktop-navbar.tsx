import React from "react";

import Auth from "./auth";
import DeliveryAddress from "./delivery-address";
import LanguageSwitcher from "./language-switcher";
import Logo from "./logo";
import SearchButton from "./search-button";
import StoreLocation from "./store-location";

export default function DesktopNavbar() {
  return (
    <div className="hidden md:flex flex-wrap gap-5 justify-between items-center">
      <div className="flex items-center gap-5">
        <Logo />
        <StoreLocation />
        <DeliveryAddress />
      </div>
      <div className="flex items-center gap-3">
        <SearchButton />
        <LanguageSwitcher />
        <Auth />
      </div>
    </div>
  );
}

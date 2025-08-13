import React from "react";

import DesktopNavbar from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";

export default function Navbar() {
  return (
    <div>
      <DesktopNavbar />
      <MobileNavbar />
    </div>
  );
}

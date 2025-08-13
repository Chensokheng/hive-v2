import React from "react";

import LanguageSwitcher from "./language-switcher";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center">
      <div></div>
      <LanguageSwitcher />
    </div>
  );
}

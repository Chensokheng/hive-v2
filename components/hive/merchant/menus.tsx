import React from "react";

import MenuCard from "./menu-card";

export default function Menus() {
  const menus = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="grid grid-cols-2 sm:flex flex-wrap gap-5 px-2">
      {menus.map((menu) => (
        <MenuCard key={menu} />
      ))}
    </div>
  );
}

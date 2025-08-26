"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import CategoryIcon from "@/components/icon/category";
import HomeIcon from "@/components/icon/home";
import OrderIcon from "@/components/icon/order";
import UserIcon from "@/components/icon/user";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ fill?: string }>;
  label: string;
}

interface BottomNavProps {
  navItems?: NavItem[];
  className?: string;
}

const defaultNavItems: NavItem[] = [
  {
    href: "/",
    icon: HomeIcon,
    label: "Home",
  },
  {
    href: "/category",
    icon: CategoryIcon,
    label: "Categories",
  },
  {
    href: "/order",
    icon: OrderIcon,
    label: "My Orders",
  },
];

export default function BottomNav({
  navItems = defaultNavItems,
  className,
}: BottomNavProps) {
  const pathname = usePathname();

  const handleOpenProfile = () => {
    document.getElementById("auth-trigger-dialog")?.click();
  };

  return (
    <nav
      className={cn(
        "block md:hidden fixed bottom-0 left-0 right-0 bg-white px-5 rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div key={index}>
              <Link
                href={item.href}
                className="flex items-center justify-center flex-col py-1"
              >
                <item.icon fill={isActive ? "#FF66CC" : "#BDC5DB"} />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-primary" : "text-[#303D55]/60"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          );
        })}
        <div
          className="flex items-center justify-center flex-col py-1"
          onClick={handleOpenProfile}
        >
          <UserIcon fill="#BDC5DB" />
          <span className={cn("text-sm font-semibold", "text-[#303D55]/60")}>
            Profile
          </span>
        </div>
      </div>
    </nav>
  );
}

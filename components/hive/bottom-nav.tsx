"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";

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
  className?: string;
}

const defaultNavItems: NavItem[] = [
  {
    href: "/",
    icon: HomeIcon,
    label: "Home",
  },
  {
    href: "/stores",
    icon: CategoryIcon,
    label: "Store",
  },
  {
    href: "/history",
    icon: OrderIcon,
    label: "My Orders",
  },
  {
    href: "/profile",
    icon: UserIcon,
    label: "Profile",
  },
];

export default function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();
  const { locale } = useParams();

  return (
    <nav
      className={cn(
        "block lg:hidden fixed bottom-0 left-0 right-0 bg-white  rounded-lg pb-8 pt-2 z-50",
        className
      )}
    >
      <div className="flex items-center justify-between max-w-md mx-auto gap-2">
        {defaultNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={"/" + locale + item.href}
              className="flex items-center justify-center flex-col py-1 space-y-1 w-full"
            >
              <item.icon fill={isActive ? "#FF66CC" : "#BDC5DB"} />
              <span
                className={cn(
                  "text-xs font-semibold",
                  isActive ? "text-primary" : "text-[#303D55]/60"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

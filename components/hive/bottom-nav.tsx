"use client";

import React from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";
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
    href: "/order",
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
  const router = useRouter();

  const { data: user, isLoading } = useGetUserInfo();

  const handleOpenProfile = () => {
    if (isLoading) {
      return;
    }

    if (user?.userId) {
      router.push("/profile");
    } else {
      document.getElementById("auth-trigger-dialog")?.click();
    }
  };

  return (
    <nav
      className={cn(
        "block lg:hidden fixed bottom-0 left-0 right-0 bg-white px-5 rounded-lg py-3 z-50",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {defaultNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div key={index}>
              <Link
                href={item.href}
                className="flex items-center justify-center flex-col py-1 space-y-1"
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
            </div>
          );
        })}
      </div>
    </nav>
  );
}

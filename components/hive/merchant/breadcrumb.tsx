"use client";

import React from "react";
import { Link } from "@/i18n/navigation";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({
  items,
  className = "lg:flex hidden",
}: BreadcrumbProps) {
  return (
    <nav
      className={cn(
        "items-center space-x-1 text-sm text-gray-600 mb-6  ",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>{"/"}</span>}
          {item.href && !item.active ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors px-1 py-1 rounded"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                item.active
                  ? "text-gray-900 font-semibold px-1 py-1"
                  : "text-gray-600 px-1 py-1"
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

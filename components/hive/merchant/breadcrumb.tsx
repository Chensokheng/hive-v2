import React from "react";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />}
          {item.href && !item.active ? (
            <a
              href={item.href}
              className="hover:text-primary transition-colors px-1 py-1 rounded"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={
                item.active
                  ? "text-gray-900 font-medium px-1 py-1"
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

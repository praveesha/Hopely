"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface HospitalNavigationProps {
  items: NavigationItem[];
  className?: string;
}

export default function HospitalNavigation({
  items,
  className = "",
}: HospitalNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            {item.icon && (
              <span
                className={`flex-shrink-0 ${
                  isActive ? "text-blue-700" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
            )}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={`
                px-2 py-1 text-xs rounded-full font-medium
                ${
                  isActive
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-200 text-gray-600"
                }
              `}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

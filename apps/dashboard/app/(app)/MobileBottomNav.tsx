"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Zap, Settings } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/slots", label: "Slots", icon: Zap },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.href === "/"
          ? pathname === "/"
          : (pathname === tab.href || pathname.startsWith(tab.href + "/"));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`mobile-nav-item${isActive ? " active" : ""}`}
          >
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isActive ? "var(--brand-violet-soft)" : "transparent",
              transition: "all 150ms ease"
            }}>
              <Icon size={20} style={{ color: isActive ? "var(--brand-violet)" : "var(--text-subtle)" }} />
            </div>
            <span style={{ color: isActive ? "var(--brand-violet)" : "var(--text-subtle)" }}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

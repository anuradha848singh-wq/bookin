"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Calendar,
  Clock,
  Users,
  Briefcase,
  CreditCard,
  Megaphone,
  FileText,
  BarChart2,
  Settings,
  Search,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Zap,
  ListTodo,
  Tags,
  Stethoscope
} from "lucide-react";

interface SidebarNavProps {
  initials: string;
  emailDisplay: string;
  clinic: {
    id: string;
    name: string;
    slug: string;
    stripeAccountId?: string | null;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href: string;
}

// Flattened out menu structure for direct clicks (no dropdowns)
const navItems: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutGrid, href: "/" },
  { id: "calendar", label: "Calendar", icon: Calendar, href: "/bookings/calendar" },
  { id: "bookings", label: "Appointments", icon: Clock, href: "/bookings" },
  { id: "slots", label: "Slot Engine", icon: ListTodo, href: "/slots" },
  { id: "patients", label: "Patients", icon: Users, href: "/crm" },
  { id: "segments", label: "Segments", icon: Tags, href: "/crm/segments" },
  { id: "services", label: "Services", icon: Briefcase, href: "/services" },
  { id: "payments", label: "Payments", icon: CreditCard, href: "/ecommerce/orders" },
  { id: "payment-settings", label: "Payment Settings", icon: CreditCard, href: "/integrations/payments" },
  { id: "forms", label: "Forms", icon: FileText, href: "/forms" },
  { id: "marketing", label: "Marketing", icon: Megaphone, href: "/marketing" },
  { id: "automations", label: "Automations", icon: Zap, href: "/automations" },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "/analytics" },
  { id: "staff", label: "Staff & Providers", icon: Stethoscope, href: "/staff/schedule" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];


export default function SidebarNav({ initials, emailDisplay, clinic }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // Exact matching for routes to prevent overlap (like /bookings matching /bookings/calendar)
    if (href === "/bookings") return pathname === "/bookings";
    if (href === "/crm") return pathname === "/crm";
    if (href === "/services") return pathname === "/services";
    return pathname.startsWith(href);
  };

  const domain = `${clinic.slug}.bookin.com`;

  return (
    <div style={{
      width: "var(--sidebar-width)",
      height: "100vh",
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--sidebar-border)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-body)",
      overflowY: "auto",
      overflowX: "hidden"
    }} className="sidebar-scroll">
      
      {/* ── 0. App Logo ── */}
      <div style={{ padding: "24px 20px 24px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ 
          width: "28px", height: "28px", background: "linear-gradient(135deg, #FF4A22 0%, #FF7854 100%)", borderRadius: "6px",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 2px 4px rgba(255, 74, 34, 0.2)"
        }}>
          <span style={{ color: "#fff", fontWeight: "800", fontSize: "14px", fontFamily: "sans-serif" }}>B</span>
        </div>
        <div style={{ fontSize: "18px", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px" }}>
          BookIn
        </div>
      </div>

      {/* ── 3. Navigation Links ── */}
      <div style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.id} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "8px 12px", borderRadius: "8px",
                background: active ? "var(--nav-active-bg)" : "transparent",
                color: active ? "var(--nav-active-text)" : "var(--nav-text)",
                transition: "all 150ms",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = "var(--nav-hover-bg)";
                  e.currentTarget.style.color = "#111827";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--nav-text)";
                }
              }}
              >
                <item.icon size={18} color={active ? "var(--nav-active-icon)" : "var(--nav-icon)"} />
                <span style={{ fontSize: "13.5px", fontWeight: active ? "600" : "500" }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── 4. Your Website Card ── */}
      <div style={{ padding: "20px" }}>
        <div style={{ border: "1px solid #f0f0f0", borderRadius: "12px", padding: "16px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>Your Website</div>
          
          <div style={{ 
            height: "70px", borderRadius: "8px", background: "#fafafa", border: "1px solid #f0f0f0",
            marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
          }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", position: "relative" }}>
               <div style={{ position: "absolute", top: "10px", left: "10px", width: "40%", height: "8px", background: "#e5e7eb", borderRadius: "4px" }} />
               <div style={{ position: "absolute", top: "30px", left: "10px", width: "70%", height: "24px", background: "#f3f4f6", borderRadius: "4px" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{domain}</span>
            <ExternalLink size={12} color="#9ca3af" />
          </div>

          <button onClick={() => router.push(`/settings/website`)} style={{ 
            width: "100%", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px",
            padding: "8px", fontSize: "12px", fontWeight: "600", color: "#111827", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            Open Studio Editor
            <ExternalLink size={14} color="#6b7280" />
          </button>
        </div>
      </div>

      {/* ── 5. User Profile ── */}
      <div style={{ padding: "0 20px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <div style={{ 
            width: "36px", height: "36px", background: "#f3f4f6", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            border: "1px solid #e5e7eb"
          }}>
            <span style={{ color: "#4b5563", fontWeight: "700", fontSize: "14px" }}>{initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {emailDisplay.split('@')[0]}
            </div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
              Clinic Owner
            </div>
          </div>
          <ChevronDown size={14} color="#6b7280" />
        </div>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}

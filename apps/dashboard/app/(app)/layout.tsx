import React from "react";
import { redirect } from "next/navigation";
import SidebarNav from "./SidebarNav";
import MobileBottomNav from "./MobileBottomNav";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getDashboardAuth();

  if (!user) {
    redirect("/login");
  }

  const clinic = await getCachedClinic(user.id as string);

  if (!clinic) redirect("/onboarding");

  const initials = user.email?.[0]?.toUpperCase() || "A";
  const emailDisplay = user.email || "";

  return (
    <div className="dashboard-container">
      {/* ── Desktop Premium Double Sidebar (ClickUp/Supabase style) ── */}
      <div className="desktop-sidebar-wrapper" style={{ display: "flex", flexShrink: 0 }}>
        <SidebarNav initials={initials} emailDisplay={emailDisplay} clinic={clinic} />
      </div>

      {/* ── Main Content Area ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <MobileBottomNav />
    </div>
  );
}


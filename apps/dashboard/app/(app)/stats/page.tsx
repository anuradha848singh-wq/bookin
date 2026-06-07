import React from "react";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import StatsPageClient from "./StatsPageClient";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const { user } = await getDashboardAuth();
  if (!user) redirect("/login");

  const clinic = await getCachedClinic(user.id as string);

  if (!clinic) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

  // 1. Fetch total counts in parallel
  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    servicesCount
  ] = await Promise.all([
    tenantDb.booking.count(),
    tenantDb.booking.count({ where: { status: "CONFIRMED" } }),
    tenantDb.booking.count({ where: { status: "PENDING" } }),
    tenantDb.booking.count({ where: { status: "CANCELLED" } }),
    tenantDb.service.count()
  ]);

  // 2. Fetch only necessary fields for revenue and distributions
  const bookingsData = await tenantDb.booking.findMany({
    where: {},
    select: {
      status: true,
      starts_at: true,
      price: true,
      service: {
        select: {
          name: true
        }
      }
    }
  });

  // 3. Compute stats in server memory
  let totalRevenue = 0;
  const serviceCounts: { [name: string]: number } = {};
  const weekdayCounts: { [day: string]: number } = {
    "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
  };

  bookingsData.forEach((b: any) => {
    if (!b.service) return;
    const sName = b.service.name;
    const sPrice = parseFloat(b.price || "0");

    if (b.status === "CONFIRMED") {
      totalRevenue += sPrice;
    }

    // Count popular services
    serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;

    // Count weekday distributions
    const date = new Date(b.starts_at);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[date.getDay()];
    weekdayCounts[dayName] = (weekdayCounts[dayName] || 0) + 1;
  });

  // Find most popular service
  let popularService = "N/A";
  let maxCount = 0;
  Object.entries(serviceCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      popularService = name;
    }
  });

  // Compute popular services list for dashboard card
  const popularServicesList = Object.entries(serviceCounts)
    .map(([name, n]) => ({
      name,
      n,
      pct: Math.round((n / (totalBookings || 1)) * 100)
    }))
    .sort((a: { n: number }, b: { n: number }) => b.n - a.n)
    .slice(0, 5);

  // Compute areaData dynamically for current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthName = now.toLocaleString("en-US", { month: "short" });

  const dailyCounts = Array.from({ length: daysInMonth }, (_, idx) => {
    const dayNum = idx + 1;
    return {
      x: `${monthName} ${dayNum}`,
      v: 0
    };
  });

  bookingsData.forEach((b: any) => {
    if (!b.starts_at) return;
    const bDate = new Date(b.starts_at);
    if (bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear()) {
      const dayIdx = bDate.getDate() - 1;
      if (dayIdx >= 0 && dayIdx < dailyCounts.length) {
        dailyCounts[dayIdx].v += 1;
      }
    }
  });

  // Compute xTicks for axis markings
  const xTicks: string[] = [];
  for (let i = 1; i <= daysInMonth; i += 5) {
    xTicks.push(`${monthName} ${i}`);
  }
  const lastTick = `${monthName} ${daysInMonth}`;
  if (!xTicks.includes(lastTick)) {
    xTicks.push(lastTick);
  }

  // Compute donutData status distribution
  const total = totalBookings || 1;
  const completed = totalBookings - confirmedBookings - pendingBookings - cancelledBookings;
  const donutData = [
    { name: "Confirmed", v: confirmedBookings, pct: `${Math.round((confirmedBookings / total) * 100)}%`, c: "#0f172a" },
    { name: "Pending", v: pendingBookings, pct: `${Math.round((pendingBookings / total) * 100)}%`, c: "#475569" },
    { name: "Cancelled", v: cancelledBookings, pct: `${Math.round((cancelledBookings / total) * 100)}%`, c: "#94a3b8" },
    { name: "Completed", v: completed > 0 ? completed : 0, pct: `${Math.round((Math.max(completed, 0) / total) * 100)}%`, c: "#cbd5e1" },
  ];

  // Compute weeklyDistribution bars
  const maxDayCount = Math.max(...Object.values(weekdayCounts), 1);
  const weeklyDistribution = Object.entries(weekdayCounts).map(([day, count]) => ({
    day,
    count,
    heightPercent: (count / maxDayCount) * 100
  }));

  return (
    <StatsPageClient
      totalBookings={totalBookings}
      confirmedBookings={confirmedBookings}
      pendingBookings={pendingBookings}
      cancelledBookings={cancelledBookings}
      servicesCount={servicesCount}
      totalRevenue={totalRevenue}
      popularService={popularService}
      popularServiceCount={maxCount}
      areaData={dailyCounts}
      xTicks={xTicks}
      donutData={donutData}
      popularServicesList={popularServicesList}
      weeklyDistribution={weeklyDistribution}
    />
  );
}



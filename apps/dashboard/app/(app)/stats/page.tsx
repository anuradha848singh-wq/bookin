import React from "react";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import dynamicImport from "next/dynamic";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";

const StatsPageClient = dynamicImport(() => import("./StatsPageClient"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  ),
});

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const { user } = await getDashboardAuth();
  if (!user) redirect("/login");

  const clinic = await getCachedClinic(user.id as string);

  if (!clinic) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  // 1. Fetch aggregations using SQL
  const [
    totalResult,
    statusResult,
    servicesCountResult,
    revenueResult,
    serviceDistributionResult,
    dailyCountsResult,
    weekdayDistributionResult
  ] = await Promise.all([
    tenantDb.$queryRaw`SELECT COUNT(*) as count FROM bookings`,
    tenantDb.$queryRaw`SELECT status, COUNT(*) as count FROM bookings GROUP BY status`,
    tenantDb.$queryRaw`SELECT COUNT(*) as count FROM services WHERE deleted_at IS NULL`,
    tenantDb.$queryRaw`SELECT SUM(price) as total FROM bookings WHERE status IN ('CONFIRMED', 'COMPLETED')`,
    tenantDb.$queryRaw`
      SELECT s.name, COUNT(b.id) as count 
      FROM bookings b 
      JOIN services s ON b.service_id = s.id 
      GROUP BY s.name 
      ORDER BY count DESC
    `,
    tenantDb.$queryRaw`
      SELECT EXTRACT(DAY FROM starts_at) as day, COUNT(*) as count 
      FROM bookings 
      WHERE starts_at >= ${startOfMonth} AND starts_at <= ${endOfMonth} 
      GROUP BY day
    `,
    tenantDb.$queryRaw`
      SELECT EXTRACT(DOW FROM starts_at) as dow, COUNT(*) as count 
      FROM bookings 
      GROUP BY dow
    `
  ]);

  const totalBookings = Number((totalResult as any)[0]?.count || 0);
  const servicesCount = Number((servicesCountResult as any)[0]?.count || 0);
  const totalRevenue = Number((revenueResult as any)[0]?.total || 0);

  let confirmedBookings = 0;
  let pendingBookings = 0;
  let cancelledBookings = 0;

  (statusResult as any[]).forEach((row) => {
    const count = Number(row.count);
    if (row.status === 'CONFIRMED') confirmedBookings = count;
    if (row.status === 'PENDING') pendingBookings = count;
    if (row.status === 'CANCELLED') cancelledBookings = count;
  });

  const popularServicesList = (serviceDistributionResult as any[])
    .map((row) => ({
      name: row.name,
      n: Number(row.count),
      pct: Math.round((Number(row.count) / (totalBookings || 1)) * 100)
    }))
    .slice(0, 5);

  const popularService = popularServicesList.length > 0 ? popularServicesList[0]?.name ?? "N/A" : "N/A";
  const maxCount = popularServicesList.length > 0 ? popularServicesList[0]?.n ?? 0 : 0;

  // Compute areaData dynamically for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = now.toLocaleString("en-US", { month: "short" });

  const dailyCounts = Array.from({ length: daysInMonth }, (_, idx) => {
    const dayNum = idx + 1;
    const found = (dailyCountsResult as any[]).find((r) => Number(r.day) === dayNum);
    return {
      x: `${monthName} ${dayNum}`,
      v: found ? Number(found.count) : 0
    };
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
  const weekdayMap: { [key: number]: string } = {
    0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat"
  };
  
  const weekdayCounts: { [day: string]: number } = {
    "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
  };

  (weekdayDistributionResult as any[]).forEach((row) => {
    const dowStr = weekdayMap[Number(row.dow)];
    if (dowStr) weekdayCounts[dowStr] = Number(row.count);
  });

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



import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import TodayPageClient from "./today/TodayPageClient";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const { user } = await getDashboardAuth();

  if (!user) {
    redirect("/login");
  }

  const clinic = await getCachedClinic(user.id as string);

  if (!clinic) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;
  const now = new Date();

  // 1. Fetch Today's start and end boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // 2. Fetch all bookings for the clinic in parallel
  const [
    bookings,
    totalBookingsCount,
    todayBookingsCount,
    confirmedBookingsCount,
    pendingBookingsCount,
    cancelledBookingsCount,
    totalPatientsCount,
  ] = await Promise.all([
    tenantDb.booking.findMany({
      where: {},
      include: { service: true, client: true },
      orderBy: { starts_at: "asc" }
    }),
    tenantDb.booking.count(),
    tenantDb.booking.count({
      where: {
        starts_at: { gte: startOfToday, lte: endOfToday }
      }
    }),
    tenantDb.booking.count({ where: { status: "CONFIRMED" } }),
    tenantDb.booking.count({ where: { status: "PENDING" } }),
    tenantDb.booking.count({ where: { status: "CANCELLED" } }),
    tenantDb.client.count(),
  ]);

  // 3. Compute Gross Revenue and aggregate patient stats
  let grossRevenue = 0;
  const uniquePatients = new Set<string>();
  const serviceCounts: { [name: string]: number } = {};

  bookings.forEach((b: any) => {
    if (!b.service) return;
    const price = parseFloat(b.price || "0");
    if (b.status === "CONFIRMED" || b.status === "COMPLETED") {
      grossRevenue += price;
    }
    const sName = b.service.name;
    serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
  });

  // 4. Compute Top Services Progress Bars
  const topServicesList = Object.entries(serviceCounts)
    .map(([name, n]) => ({
      name,
      n,
      pct: Math.round((n / (totalBookingsCount || 1)) * 100)
    }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);

  // 5. Compute AreaChart dynamic data for the current month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthName = now.toLocaleString("en-US", { month: "short" });

  const dailyCounts = Array.from({ length: daysInMonth }, (_, idx) => {
    const dayNum = idx + 1;
    return {
      x: `${monthName} ${dayNum}`,
      v: 0
    };
  });

  bookings.forEach((b: any) => {
    if (!b.starts_at) return;
    const bDate = new Date(b.starts_at);
    if (bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear()) {
      const dayIdx = bDate.getDate() - 1;
      if (dayIdx >= 0 && dayIdx < dailyCounts.length) {
        dailyCounts[dayIdx].v += 1;
      }
    }
  });

  // X-Axis ticks
  const xTicks: string[] = [];
  for (let i = 1; i <= daysInMonth; i += 5) {
    xTicks.push(`${monthName} ${i}`);
  }
  const lastTick = `${monthName} ${daysInMonth}`;
  if (!xTicks.includes(lastTick)) {
    xTicks.push(lastTick);
  }

  // 6. Compute PieChart Status aggregate distribution
  const completedBookingsCount = Math.max(0, totalBookingsCount - confirmedBookingsCount - pendingBookingsCount - cancelledBookingsCount);
  const donutData = [
    { name: "Confirmed", v: confirmedBookingsCount, pct: `${Math.round((confirmedBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#E8334A" },
    { name: "Pending", v: pendingBookingsCount, pct: `${Math.round((pendingBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#F48EA0" },
    { name: "Cancelled", v: cancelledBookingsCount, pct: `${Math.round((cancelledBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#F9C0CB" },
    { name: "Completed", v: completedBookingsCount, pct: `${Math.round((completedBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#FDE8EC" },
  ];

  // 7. Extract Recent Scheduled Bookings (latest 4)
  const recentApptsList = [...bookings]
    .sort((a: any, b: any) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
    .slice(0, 4)
    .map((b: any) => ({
      id: b.id,
      name: b.client?.first_name || "Anonymous Patient",
      svc: b.service?.name,
      time: new Date(b.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      status: (b.status as string).charAt(0).toUpperCase() + (b.status as string).slice(1).toLowerCase(),
      ac: b.status === "CONFIRMED" ? "#059669" : b.status === "PENDING" ? "#D97706" : "#E11D48"
    }));

  // 8. Extract Upcoming Scheduled Slots (in the next 24 hours)
  const upcomingApptsList = bookings
    .filter((b: any) => new Date(b.starts_at).getTime() >= new Date().getTime() && b.status !== "CANCELLED" && b.status !== "NO_SHOW")
    .slice(0, 3)
    .map((b: any) => ({
      patient: b.client?.first_name || "Anonymous Patient",
      svc: b.service?.name,
      time: new Date(b.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      ac: "#E8334A"
    }));

  return (
    <TodayPageClient
      initialBookings={bookings as any}
      clinicName={clinic.name}
      clinicSlug={clinic.slug}
      userEmail={user.email || ""}
      totalBookings={totalBookingsCount}
      totalPatients={totalPatientsCount}
      todaySessions={todayBookingsCount}
      grossRevenue={grossRevenue}
      areaData={dailyCounts}
      xTicks={xTicks}
      donutData={donutData}
      recentAppts={recentApptsList}
      topServices={topServicesList}
      upcomingAppts={upcomingApptsList}
    />
  );
}



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

  // 1. Boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  // 2. Fetch Aggregations using SQL
  const [
    totalBookingsResult,
    todayBookingsResult,
    statusCountsResult,
    totalPatientsResult,
    revenueResult,
    dailyCountsResult,
    topServicesResult,
    todayBookings
  ] = await Promise.all([
    tenantDb.$queryRaw`SELECT COUNT(*) as count FROM bookings`,
    tenantDb.$queryRaw`SELECT COUNT(*) as count FROM bookings WHERE starts_at >= ${startOfToday} AND starts_at <= ${endOfToday}`,
    tenantDb.$queryRaw`SELECT status, COUNT(*) as count FROM bookings GROUP BY status`,
    tenantDb.$queryRaw`SELECT COUNT(*) as count FROM clients WHERE deleted_at IS NULL`,
    tenantDb.$queryRaw`SELECT SUM(price) as total FROM bookings WHERE status IN ('CONFIRMED', 'COMPLETED') AND starts_at >= ${startOfMonth} AND starts_at <= ${endOfMonth}`,
    tenantDb.$queryRaw`SELECT EXTRACT(DAY FROM starts_at) as day, COUNT(*) as count FROM bookings WHERE starts_at >= ${startOfMonth} AND starts_at <= ${endOfMonth} GROUP BY day`,
    tenantDb.$queryRaw`SELECT s.name, COUNT(b.id) as count FROM bookings b JOIN services s ON b.service_id = s.id GROUP BY s.name ORDER BY count DESC LIMIT 5`,
    tenantDb.$queryRaw`
      SELECT b.id, b.starts_at, b.status, b.price, c.first_name, c.phone, s.name as service_name
      FROM bookings b
      LEFT JOIN clients c ON b.client_id = c.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.starts_at >= ${startOfToday} AND b.starts_at <= ${endOfToday}
      ORDER BY b.starts_at ASC
    `
  ]);

  const totalBookingsCount = Number((totalBookingsResult as any)[0]?.count || 0);
  const todayBookingsCount = Number((todayBookingsResult as any)[0]?.count || 0);
  const totalPatientsCount = Number((totalPatientsResult as any)[0]?.count || 0);
  const grossRevenue = Number((revenueResult as any)[0]?.total || 0);

  let confirmedBookingsCount = 0;
  let pendingBookingsCount = 0;
  let cancelledBookingsCount = 0;
  let completedBookingsCount = 0;

  (statusCountsResult as any[]).forEach((row) => {
    const count = Number(row.count);
    if (row.status === 'CONFIRMED') confirmedBookingsCount = count;
    if (row.status === 'PENDING') pendingBookingsCount = count;
    if (row.status === 'CANCELLED') cancelledBookingsCount = count;
    if (row.status === 'COMPLETED') completedBookingsCount = count;
  });

  const donutData = [
    { name: "Confirmed", v: confirmedBookingsCount, pct: `${Math.round((confirmedBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#E8334A" },
    { name: "Pending", v: pendingBookingsCount, pct: `${Math.round((pendingBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#F48EA0" },
    { name: "Cancelled", v: cancelledBookingsCount, pct: `${Math.round((cancelledBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#F9C0CB" },
    { name: "Completed", v: completedBookingsCount, pct: `${Math.round((completedBookingsCount / (totalBookingsCount || 1)) * 100)}%`, c: "#FDE8EC" },
  ];

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

  const xTicks: string[] = [];
  for (let i = 1; i <= daysInMonth; i += 5) {
    xTicks.push(`${monthName} ${i}`);
  }
  const lastTick = `${monthName} ${daysInMonth}`;
  if (!xTicks.includes(lastTick)) xTicks.push(lastTick);

  const topServicesList = (topServicesResult as any[]).map((row) => ({
    name: row.name,
    n: Number(row.count),
    pct: Math.round((Number(row.count) / (totalBookingsCount || 1)) * 100)
  }));

  const formattedTodayBookings = (todayBookings as any[]).map((b: any) => ({
    status: b.status.toLowerCase(),
    patient_phone: b.phone || b.first_name || "Anonymous",
    slot: {
      starts_at: b.starts_at.toISOString(),
      service: { name: b.service_name, price: b.price }
    }
  }));

  const recentApptsList = await tenantDb.$queryRaw`
    SELECT b.id, c.first_name, s.name as svc_name, b.starts_at, b.status 
    FROM bookings b 
    LEFT JOIN clients c ON b.client_id = c.id
    LEFT JOIN services s ON b.service_id = s.id
    ORDER BY b.starts_at DESC LIMIT 4
  `.then((res: any[]) => res.map((b: any) => ({
    id: b.id,
    name: b.first_name || "Anonymous",
    svc: b.svc_name,
    time: new Date(b.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    status: (b.status as string).charAt(0).toUpperCase() + (b.status as string).slice(1).toLowerCase(),
    ac: b.status === "CONFIRMED" ? "#059669" : b.status === "PENDING" ? "#D97706" : "#E11D48"
  })));

  const upcomingApptsList = await tenantDb.$queryRaw`
    SELECT c.first_name, s.name as svc_name, b.starts_at
    FROM bookings b
    LEFT JOIN clients c ON b.client_id = c.id
    LEFT JOIN services s ON b.service_id = s.id
    WHERE b.starts_at >= ${now} AND b.status NOT IN ('CANCELLED', 'NO_SHOW')
    ORDER BY b.starts_at ASC LIMIT 3
  `.then((res: any[]) => res.map((b: any) => ({
    patient: b.first_name || "Anonymous",
    svc: b.svc_name,
    time: new Date(b.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    ac: "#E8334A"
  })));

  return (
    <TodayPageClient
      initialBookings={formattedTodayBookings as any}
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



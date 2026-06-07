import { getTenantClient } from "@book-in/db";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalendarPageClient from "./CalendarPageClient";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { user } = await getDashboardAuth();
  if (!user) redirect("/login");

  const clinic = await getCachedClinic(user.id as string);
  if (!clinic) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${clinic.slug}`) as any;

  // Fetch bookings from today minus 30 days to today plus 90 days
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);

  const [rawBookings, services, staff] = await Promise.all([
    tenantDb.booking.findMany({
      where: {
        starts_at: { gte: startDate, lte: endDate },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    }),
    tenantDb.service.findMany({ where: { deleted_at: null } }),
    tenantDb.staff.findMany({ where: { deleted_at: null } }),
  ]);

  // Build lookup maps for services and staff
  const serviceMap = Object.fromEntries(services.map((s: any) => [s.id, s]));
  const staffMap = Object.fromEntries(staff.map((s: any) => [s.id, s]));

  // Reshape bookings into the shape CalendarPageClient already expects:
  // { id, status, patient: {...}, slot: { starts_at, ends_at, service, provider } }
  const bookings = rawBookings.map((b: any) => {
    const service = serviceMap[b.service_id] ?? { id: b.service_id, name: "Unknown", price: "0", duration_minutes: 60 };
    const provider = b.staff_id ? (staffMap[b.staff_id] ?? null) : null;

    return {
      id: b.id,
      status: (b.status ?? "PENDING").toLowerCase(),
      patient: null,           // client lookup omitted for performance; dossier API handles it
      patient_phone: null,
      slot: {
        starts_at: b.starts_at,
        ends_at: b.ends_at,
        service: {
          id: service.id,
          name: service.name,
          price: service.price ?? "0",
          duration: service.duration_minutes ?? 60,
        },
        provider: provider ? {
          first_name: provider.first_name,
          last_name: provider.last_name,
          avatar_url: provider.avatar_url ?? null,
        } : null,
      },
    };
  });

  return (
    <CalendarPageClient
      initialSlots={[]}
      initialBookings={bookings as any}
      services={services as any}
      staff={staff as any}
      clinicName={clinic.name}
    />
  );
}

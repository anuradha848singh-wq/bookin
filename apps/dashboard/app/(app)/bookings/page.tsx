import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon, Clock3Icon } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const rawBookings = await tenantDb.booking.findMany({
    include: {
      client: { select: { first_name: true, last_name: true } },
      service: { select: { name: true, price: true } },
      staff: { select: { first_name: true, last_name: true } }
    },
    orderBy: { starts_at: 'desc' },
    take: 50
  });

  const bookings = rawBookings.map((b: any) => ({
    ...b,
    client_first_name: b.client?.first_name,
    client_last_name: b.client?.last_name,
    service_name: b.service?.name,
    service_price: b.service?.price,
    staff_first_name: b.staff?.first_name,
    staff_last_name: b.staff?.last_name
  }));

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bookings Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all appointments, statuses, and payments.</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/slots" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Check Availability
          </Link>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm">
            Manual Booking
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Service</th>
                <th className="px-6 py-3">Provider</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking: any) => {
                  const d = new Date(booking.starts_at);
                  return (
                    <tr key={booking.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{format(d, "MMM d, yyyy")}</span>
                          <span className="text-xs text-gray-500 flex items-center mt-1">
                            <ClockIcon className="w-3 h-3 mr-1" /> {format(d, "h:mm a")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/crm/${booking.client_id}`} className="font-medium text-blue-600 hover:underline">
                          {booking.client_first_name} {booking.client_last_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-gray-900">{booking.service_name}</span>
                          <span className="text-xs text-gray-500">${Number(booking.service_price).toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {booking.staff_first_name} {booking.staff_last_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.status === 'PENDING' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"><Clock3Icon className="w-3 h-3 mr-1"/> Pending</span>}
                        {booking.status === 'CONFIRMED' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircleIcon className="w-3 h-3 mr-1"/> Confirmed</span>}
                        {booking.status === 'CANCELLED' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><XCircleIcon className="w-3 h-3 mr-1"/> Cancelled</span>}
                        {booking.status === 'COMPLETED' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Completed</span>}
                      </td>
                      <td className="px-6 py-4">
                        {booking.payment_status === 'UNPAID' && <span className="text-xs font-medium text-red-600">Unpaid</span>}
                        {booking.payment_status === 'PAID' && <span className="text-xs font-medium text-green-600">Paid</span>}
                        {booking.payment_status === 'PARTIALLY_PAID' && <span className="text-xs font-medium text-yellow-600">Partial</span>}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



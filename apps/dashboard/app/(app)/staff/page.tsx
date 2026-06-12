import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlusIcon, CalendarIcon, SettingsIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const staffList = await tenantDb.staff.findMany({
    where: { deleted_at: null },
    orderBy: [
      { display_order: 'asc' },
      { first_name: 'asc' }
    ]
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team members, schedules, and service assignments.</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm">
            <UserPlusIcon className="w-4 h-4 mr-2" />
            Invite Staff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff: any) => (
          <div key={staff.id} className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 flex items-start space-x-4 border-b bg-gray-50/50">
              {staff.avatar_url ? (
                <img src={staff.avatar_url} alt={staff.first_name} className="w-16 h-16 rounded-full shadow-sm ring-2 ring-white" />
              ) : (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-sm ring-2 ring-white"
                  style={{ backgroundColor: staff.color || '#3b82f6' }}
                >
                  {staff.first_name[0]}{staff.last_name[0]}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                  {staff.first_name} {staff.last_name}
                  <SettingsIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"/>
                </h2>
                <p className="text-sm text-gray-500 font-medium">{staff.title || 'Staff Member'}</p>
                <div className="flex items-center mt-2 space-x-2">
                  {staff.is_accepting_bookings ? (
                    <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                      <CheckCircleIcon className="w-3 h-3 mr-1"/> Bookable
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      <XCircleIcon className="w-3 h-3 mr-1"/> Unbookable
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white flex-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-1">
                {staff.specializations && staff.specializations.length > 0 ? (
                  staff.specializations.map((spec: string) => (
                    <span key={spec} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs border border-gray-200">
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">No specializations added</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x border-t bg-gray-50/50">
              <button className="py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center justify-center">
                Services
              </button>
              <button className="py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



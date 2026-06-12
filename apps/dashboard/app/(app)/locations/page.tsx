import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import { MapPinIcon, PlusIcon, StarIcon, PhoneIcon, MailIcon, MapIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const locations = await tenantDb.location.findMany({
    where: { deleted_at: null },
    include: {
      _count: {
        select: { staff_working_hours: true }
      }
    },
    orderBy: [{ is_primary: 'desc' }, { created_at: 'asc' }]
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Locations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical clinics, offices, or branch locations.</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Location
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc: any) => (
          <div key={loc.id} className="bg-white border rounded-xl shadow-sm flex flex-col group hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center relative">
              <MapIcon className="w-10 h-10 text-blue-200" />
              {loc.is_primary && (
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-sm flex items-center text-xs font-semibold text-amber-600">
                  <StarIcon className="w-3 h-3 mr-1 fill-amber-500" /> Primary
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 relative -mt-6">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm border flex items-center justify-center mb-3">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{loc.name}</h3>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {(loc.address_line1 || loc.city) ? (
                  <p className="flex items-start">
                    <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 mt-0.5 shrink-0" />
                    <span>
                      {loc.address_line1}<br/>
                      {loc.city && `${loc.city}, `}{loc.state} {loc.postal_code}
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No address provided</p>
                )}
                
                {loc.phone && (
                  <p className="flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    {loc.phone}
                  </p>
                )}
                
                {loc.email && (
                  <p className="flex items-center">
                    <MailIcon className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    <span className="truncate">{loc.email}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">
                {Number(loc._count.staff_working_hours)} Staff Assigned
              </span>
              <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                {loc.timezone}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusIcon, EditIcon, TagIcon, ClockIcon, DollarSignIcon, ArchiveIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  // Fetch Categories
  const categories = await tenantDb.$queryRawUnsafe(`
    SELECT * FROM service_categories ORDER BY display_order ASC;
  `) as any[];

  // Fetch Services
  const services = await tenantDb.$queryRawUnsafe(`
    SELECT * FROM services WHERE deleted_at IS NULL ORDER BY name ASC;
  `) as any[];

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Service Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your offerings, pricing, and booking rules.</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2">
            <TagIcon className="w-4 h-4 mr-2" />
            Manage Categories
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Service
          </button>
        </div>
      </div>

      <div className="space-y-8 max-w-5xl">
        {categories.length === 0 ? (
          <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
            <ArchiveIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Services Found</h3>
            <p className="text-gray-500 mt-1">Get started by creating your first service category.</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryServices = services.filter(s => s.category_id === category.id);
            return (
              <div key={category.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {category.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />}
                    <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{categoryServices.length}</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit Category</button>
                </div>
                
                <div className="divide-y">
                  {categoryServices.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">No services in this category.</div>
                  ) : (
                    categoryServices.map(service => (
                      <div key={service.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors group">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.name}
                          </h3>
                          {service.short_description && (
                            <p className="text-sm text-gray-500 mt-1">{service.short_description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1 text-gray-400" /> {service.duration_minutes} min</span>
                            <span className="flex items-center"><DollarSignIcon className="w-4 h-4 mr-1 text-gray-400" /> ${Number(service.price).toFixed(2)}</span>
                            {service.is_online && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Virtual</span>}
                            {service.is_group_session && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Group (Max {service.max_capacity})</span>}
                            {!service.is_public && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Private</span>}
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                          <EditIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}



import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusIcon, FilterIcon, DownloadIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CRMPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";
  const limit = 25;
  const offset = (page - 1) * limit;

  const whereClause: any = { deleted_at: null };
  if (search) {
    whereClause.OR = [
      { first_name: { contains: search, mode: 'insensitive' } },
      { last_name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const clients = await tenantDb.client.findMany({
    where: whereClause,
    orderBy: { created_at: 'desc' },
    take: limit,
    skip: offset
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clients CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer database, view histories, and track LTV.</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2">
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search clients..." 
                defaultValue={search}
                className="h-9 w-64 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="inline-flex items-center h-9 px-3 border rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <FilterIcon className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-6 py-3">Client Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Lifetime Value</th>
                <th className="px-6 py-3">Visits</th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              ) : (
                clients.map((client: any) => (
                  <tr key={client.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                        {client.first_name[0]}{client.last_name[0]}
                      </div>
                      <Link href={`/crm/${client.id}`} className="hover:text-blue-600 hover:underline">
                        {client.first_name} {client.last_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{client.email || '—'}</span>
                        <span className="text-xs text-gray-500">{client.phone || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-700">
                      ${Number(client.lifetime_value).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {client.visit_count}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {client.tags && client.tags.length > 0 ? client.tags.map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs border border-gray-200">
                            {tag}
                          </span>
                        )) : <span className="text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/crm/${client.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



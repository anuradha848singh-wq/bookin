import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusIcon, FileTextIcon, FileCheckIcon, SettingsIcon } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const forms = await tenantDb.$queryRawUnsafe(`
    SELECT f.*, 
           (SELECT COUNT(*) FROM form_submissions fs WHERE fs.form_id = f.id) as submission_count
    FROM forms f
    WHERE f.deleted_at IS NULL
    ORDER BY f.created_at DESC;
  `) as any[];

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Forms Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Manage intake, consent, and waiver forms.</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            Build New Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map(form => (
          <div key={form.id} className="bg-white border rounded-xl shadow-sm flex flex-col group hover:shadow-md transition-shadow">
            <div className="p-6 border-b flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{form.name}</h3>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{form.type}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-600">
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 bg-gray-50/50">
              <p className="text-sm text-gray-600 line-clamp-2">{form.description || "No description provided."}</p>
            </div>
            <div className="p-4 border-t flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-500 font-medium">
                <FileCheckIcon className="w-4 h-4 mr-1.5 text-green-500" />
                {Number(form.submission_count)} Submissions
              </span>
              <span className="text-gray-400 text-xs">
                {form.is_required ? "Required" : "Optional"}
              </span>
            </div>
          </div>
        ))}

        {forms.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-dashed rounded-xl flex flex-col items-center">
            <FileTextIcon className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Forms Built Yet</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Create dynamic forms and bind them to your services.</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-md">
              Create First Form
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



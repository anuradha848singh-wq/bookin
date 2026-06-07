import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusIcon, ZapIcon, PlayCircleIcon, SettingsIcon, ActivityIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const automations = await tenantDb.$queryRawUnsafe(`
    SELECT a.*,
           (SELECT COUNT(*) FROM automation_logs l WHERE l.automation_id = a.id AND l.status = 'SUCCESS') as success_count,
           (SELECT COUNT(*) FROM automation_logs l WHERE l.automation_id = a.id AND l.status = 'FAILED') as fail_count
    FROM automations a
    ORDER BY a.created_at DESC;
  `) as any[];

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Automations</h1>
          <p className="text-sm text-gray-500 mt-1">Design triggers and event workflows to run your business on autopilot.</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/automations/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Build Workflow
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {automations.map((automation) => (
          <div key={automation.id} className="bg-white border rounded-xl shadow-sm flex flex-col sm:flex-row group hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
              
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${automation.is_active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <ZapIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    {automation.name}
                    {!automation.is_active && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">Inactive</span>}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <PlayCircleIcon className="w-4 h-4 mr-1.5" />
                    Triggers when <strong className="text-gray-700 ml-1">{automation.trigger_event}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 bg-gray-50 px-4 py-3 rounded-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Number(automation.success_count)}</div>
                  <div className="text-xs font-semibold text-gray-500 uppercase">Runs</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${Number(automation.fail_count) > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {Number(automation.fail_count)}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 uppercase">Fails</div>
                </div>
              </div>

            </div>
            
            <div className="border-t sm:border-t-0 sm:border-l bg-gray-50 flex sm:flex-col items-center justify-center divide-x sm:divide-x-0 sm:divide-y w-full sm:w-24">
              <button className="flex-1 sm:w-full py-4 flex justify-center text-gray-400 hover:text-blue-600 transition-colors">
                <SettingsIcon className="w-5 h-5" />
              </button>
              <button className="flex-1 sm:w-full py-4 flex justify-center text-gray-400 hover:text-blue-600 transition-colors">
                <ActivityIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {automations.length === 0 && (
          <div className="py-16 text-center bg-white border border-dashed rounded-xl flex flex-col items-center">
            <ZapIcon className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Automations Yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mb-6">
              Create rules to automatically send emails, assign tags, or notify staff when events occur.
            </p>
            <Link href="/automations/new" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg shadow-sm">
              Create First Workflow
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}



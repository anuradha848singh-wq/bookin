import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant as getCachedClinic } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeftIcon, PhoneIcon, MailIcon, MapPinIcon, CalendarIcon, ActivityIcon, FileTextIcon, HistoryIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedClinic(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  const clientId = params.id;

  // 1. Fetch Client Profile
  const clients = await tenantDb.$queryRawUnsafe(`
    SELECT * FROM clients WHERE id = $1::uuid AND deleted_at IS NULL LIMIT 1;
  `, clientId) as any[];

  if (clients.length === 0) redirect("/crm");
  const client = clients[0];

  // 2. Fetch Timeline (Notes + Activities)
  const notes = await tenantDb.$queryRawUnsafe(`
    SELECT n.*, s.first_name as staff_first_name, s.last_name as staff_last_name 
    FROM client_notes n LEFT JOIN staff s ON n.staff_id = s.id
    WHERE n.client_id = $1::uuid ORDER BY n.created_at DESC LIMIT 20;
  `, clientId) as any[];

  const activities = await tenantDb.$queryRawUnsafe(`
    SELECT * FROM client_activities WHERE client_id = $1::uuid ORDER BY created_at DESC LIMIT 20;
  `, clientId) as any[];

  // 3. Sort Timeline chronologically
  const timeline = [
    ...notes.map(n => ({ type: 'NOTE', date: new Date(n.created_at), data: n })),
    ...activities.map(a => ({ type: 'ACTIVITY', date: new Date(a.created_at), data: a }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex h-full flex-col bg-gray-50/50 min-h-screen">
      <div className="flex items-center border-b px-8 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <Link href="/crm" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mr-4">
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to Clients
        </Link>
        <div className="h-6 w-px bg-gray-200 mx-4" />
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          {client.first_name} {client.last_name}
        </h1>
        <div className="ml-auto space-x-3">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-200 bg-white hover:bg-gray-100 h-9 px-4">
            Edit Profile
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 shadow-sm">
            New Booking
          </button>
        </div>
      </div>

      <div className="flex flex-1 p-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Left Column */}
        <div className="w-1/3 flex flex-col space-y-6">
          <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
              {client.first_name[0]}{client.last_name[0]}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{client.first_name} {client.last_name}</h2>
            <p className="text-sm text-gray-500 mt-1">Client since {new Date(client.created_at).toLocaleDateString()}</p>
            
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {client.tags && client.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2 text-gray-500"/> Contact Info
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center text-sm">
                <MailIcon className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                <span className="text-gray-900 truncate">{client.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center text-sm">
                <PhoneIcon className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                <span className="text-gray-900 truncate">{client.phone || 'No phone provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <div className="p-4 border-b bg-gray-50/50">
              <h3 className="font-semibold text-gray-800 flex items-center text-sm">
                Add Note to Timeline
              </h3>
            </div>
            <textarea 
              className="w-full p-4 text-sm text-gray-700 border-none focus:ring-0 resize-none h-24"
              placeholder="Log a call, meeting, or internal note..."
            />
            <div className="p-3 bg-gray-50 border-t flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Save Note
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
              <HistoryIcon className="w-5 h-5 mr-2 text-gray-500" /> Interaction Timeline
            </h3>

            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              {timeline.length === 0 ? (
                <div className="pl-6 text-sm text-gray-500">No interaction history yet.</div>
              ) : (
                timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    {item.type === 'NOTE' ? (
                      <>
                        <div className="absolute w-4 h-4 bg-yellow-400 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm" />
                        <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {item.data.staff_first_name} {item.data.staff_last_name}
                            </span>
                            <span className="text-xs text-gray-500">{item.date.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.data.content}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 border-4 border-white shadow-sm" />
                        <div className="flex justify-between items-start pt-1">
                          <div>
                            <span className="text-sm font-semibold text-gray-900">{item.data.title}</span>
                            {item.data.description && <p className="text-sm text-gray-600 mt-1">{item.data.description}</p>}
                          </div>
                          <span className="text-xs text-gray-500">{item.date.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

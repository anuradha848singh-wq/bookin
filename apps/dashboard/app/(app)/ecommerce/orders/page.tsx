import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import { SearchIcon, ShoppingBagIcon, MoreHorizontalIcon, ClockIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const rawOrders = await tenantDb.order.findMany({
    include: {
      client: { select: { first_name: true, last_name: true, email: true } },
      order_items: true
    },
    orderBy: { created_at: 'desc' }
  });

  const orders = rawOrders.map((o: any) => ({
    ...o,
    first_name: o.client?.first_name,
    last_name: o.client?.last_name,
    email: o.client?.email,
    items: o.order_items || []
  }));

  // Group by status for the Kanban board
  const columns = {
    'PENDING': orders.filter((o: any) => o.status === 'PENDING'),
    'PROCESSING': orders.filter((o: any) => o.status === 'PROCESSING'),
    'SHIPPED': orders.filter((o: any) => o.status === 'SHIPPED'),
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order Fulfillment</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical shipments and digital order deliveries.</p>
        </div>
        <div className="relative w-80">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by order number or customer..." 
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} className="w-80 flex-shrink-0 flex flex-col bg-gray-50/50 rounded-xl p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
              <h3 className="font-semibold text-gray-700 flex items-center">
                {status === 'PENDING' && <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />}
                {status === 'PROCESSING' && <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />}
                {status === 'SHIPPED' && <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />}
                {status.charAt(0) + status.slice(1).toLowerCase()}
                <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-bold">
                  {items.length}
                </span>
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontalIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
              {items.map((order: any) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block mb-1">#{order.order_number}</span>
                      <span className="text-sm text-gray-600 font-medium line-clamp-1">
                        {order.first_name} {order.last_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 space-y-1 mb-3 border">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="truncate pr-2">{item.quantity}x {item.product_name}</span>
                        <span className="text-gray-400">({item.variant_name})</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                    <span className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    {order.payment_status === 'PAID' ? (
                      <span className="text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">PAID</span>
                    ) : (
                      <span className="text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded">UNPAID</span>
                    )}
                  </div>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400 text-sm">
                  No orders in this stage
                </div>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}



import { Suspense } from "react";
import { getDashboardAuth, getCachedTenant } from "@/lib/auth";
import { getTenantClient } from "@book-in/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusIcon, PackageIcon, TagIcon, ArchiveIcon, SearchIcon, AlertTriangleIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { user, session } = await getDashboardAuth();
  if (!user) redirect("/login");

  const activeTenantId = (session as any)?.tenantId;
  const tenant = await getCachedTenant(user.id as string, activeTenantId);
  if (!tenant) redirect("/onboarding");

  const tenantDb = getTenantClient(`tenant_${tenant.slug}`) as any;
  
  const rawProducts = await tenantDb.product.findMany({
    include: {
      category: { select: { name: true } },
      variants: { select: { stock_count: true, price: true } }
    },
    orderBy: { created_at: 'desc' }
  });

  const products = rawProducts.map((p: any) => {
    const variants = p.variants || [];
    return {
      ...p,
      category_name: p.category?.name,
      variant_count: variants.length,
      total_stock: variants.reduce((sum: number, v: any) => sum + Number(v.stock_count || 0), 0),
      starting_price: variants.length > 0 ? Math.min(...variants.map((v: any) => Number(v.price || 0))) : null
    };
  });

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Products & Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical goods, digital downloads, and track stock across locations.</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/ecommerce/products/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
          <div className="relative w-72">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Filter products..." 
              className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 font-medium">Status:</span>
            <select className="border rounded-md text-sm py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500">
              <option>All</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: any) => (
              <tr key={product.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded border flex items-center justify-center">
                      <PackageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{Number(product.variant_count)} variant(s)</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.is_track_inventory ? (
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${Number(product.total_stock) <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                        {Number(product.total_stock)} in stock
                      </span>
                      {Number(product.total_stock) <= 5 && (
                        <AlertTriangleIcon className="w-4 h-4 ml-1.5 text-red-500" />
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not tracked</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.is_digital ? 'Digital' : 'Physical'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {product.starting_price ? `$${Number(product.starting_price).toFixed(2)}` : 'N/A'}
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <ArchiveIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Products Found</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">You haven't added any physical or digital goods yet.</p>
                  <Link href="/ecommerce/products/new" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Create first product &rarr;
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



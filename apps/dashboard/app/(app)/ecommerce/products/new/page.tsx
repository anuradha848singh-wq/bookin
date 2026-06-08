"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BoxIcon, FileTextIcon, PackageIcon, TagIcon, UploadCloudIcon, SaveIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_digital: false,
    is_track_inventory: true,
  });

  const [variants, setVariants] = useState([
    { name: "Default", sku: "", price: "0.00", stock_count: "0" }
  ]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        variants: variants.map(v => ({
          name: v.name,
          sku: v.sku,
          price: parseFloat(v.price) || 0,
          stock_count: parseInt(v.stock_count) || 0
        }))
      };

      // Since we don't have tenant slug injected via params in this client component demo, 
      // the api-middleware will resolve it securely from session on the server.
      const res = await fetch("/api/v1/ecommerce/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        router.push("/dashboard/ecommerce/products");
      } else {
        alert("Failed to create product");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { name: "New Variant", sku: "", price: "0.00", stock_count: "0" }]);
  };

  return (
    <div className="flex h-full flex-col space-y-6 p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <Link href="/ecommerce/products" className="p-2 bg-white rounded-full border text-gray-500 hover:text-black">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-500 mt-1">Physical goods, digital downloads, or inventory.</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="text-sm font-medium bg-white border px-4 py-2 rounded-md shadow-sm">Discard</button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center text-sm font-medium bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md shadow-sm"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="col-span-1 space-y-1">
          <button onClick={() => setActiveTab("details")} className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'details' ? 'bg-white shadow-sm border text-blue-600' : 'text-gray-600 hover:bg-gray-200/50'}`}>
            <FileTextIcon className="w-4 h-4 mr-3" /> Basic Details
          </button>
          <button onClick={() => setActiveTab("variants")} className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'variants' ? 'bg-white shadow-sm border text-blue-600' : 'text-gray-600 hover:bg-gray-200/50'}`}>
            <TagIcon className="w-4 h-4 mr-3" /> Pricing & Variants
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'inventory' ? 'bg-white shadow-sm border text-blue-600' : 'text-gray-600 hover:bg-gray-200/50'}`}>
            <PackageIcon className="w-4 h-4 mr-3" /> Inventory Ledger
          </button>
        </div>

        {/* Main Form Area */}
        <div className="col-span-3 space-y-6">
          
          {activeTab === "details" && (
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Product Title</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border" 
                  placeholder="e.g. Premium Dental Care Kit" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Description</label>
                <textarea 
                  rows={4} 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Describe the product..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Product Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                    <input type="radio" checked={!formData.is_digital} onChange={() => setFormData({...formData, is_digital: false})} name="type" className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium">Physical Good</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                    <input type="radio" checked={formData.is_digital} onChange={() => setFormData({...formData, is_digital: true})} name="type" className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm font-medium">Digital Product (Download)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Media</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
                  <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600"><span className="text-blue-600 font-medium">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "variants" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Variant Options</h3>
                  <button onClick={addVariant} className="text-sm text-blue-600 font-medium hover:underline">+ Add Option</button>
                </div>
                
                <div className="space-y-4">
                  {variants.map((v, idx) => (
                    <div key={idx} className="flex space-x-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Option Name</label>
                        <input 
                          type="text" 
                          value={v.name}
                          onChange={e => {
                            const newV = [...variants];
                            if (newV[idx]) newV[idx].name = e.target.value;
                            setVariants(newV);
                          }}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                          placeholder="e.g. 500ml / Default" 
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Price</label>
                        <input 
                          type="number" 
                          value={v.price}
                          onChange={e => {
                            const newV = [...variants];
                            if (newV[idx]) newV[idx].price = e.target.value;
                            setVariants(newV);
                          }}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">SKU</label>
                        <input 
                          type="text" 
                          value={v.sku}
                          onChange={e => {
                            const newV = [...variants];
                            if (newV[idx]) newV[idx].sku = e.target.value;
                            setVariants(newV);
                          }}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                          placeholder="PROD-01"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Stock</label>
                        <input 
                          type="number" 
                          value={v.stock_count}
                          onChange={e => {
                            const newV = [...variants];
                            if (newV[idx]) newV[idx].stock_count = e.target.value;
                            setVariants(newV);
                          }}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-amber-50" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center py-12">
              <BoxIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Inventory Ledger</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                Once this product is created, all inventory changes will be immutably recorded here. You can manually adjust stock or it will automatically decrement when orders are placed.
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

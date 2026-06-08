"use client";

import React, { useState, useEffect } from "react";
import { X, ShoppingBag, Plus, Tag, Settings, CreditCard, Loader2, Edit2, Package, Check } from "lucide-react";

interface StoreManagerModalProps {
  onClose: () => void;
  websiteId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

export const StoreManagerModal = ({ onClose, websiteId }: StoreManagerModalProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "settings" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Product State
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, inventory: 0, description: "" });
  
  // Settings State
  const [stripeKeys, setStripeKeys] = useState({ pub: "", sec: "" });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, [websiteId]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/studio/store/products?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/studio/store/settings?websiteId=${websiteId}`);
      if (res.ok) {
        const data = await res.json();
        setStripeKeys({ pub: data.pub || "", sec: data.sec || "" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) return;
    
    try {
      const res = await fetch("/api/studio/store/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, ...newProduct })
      });
      if (res.ok) {
        setIsCreatingProduct(false);
        setNewProduct({ name: "", price: 0, inventory: 0, description: "" });
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await fetch("/api/studio/store/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, ...stripeKeys })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 font-sans">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded shadow-sm flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Store Manager</h2>
              <p className="text-xs text-gray-500">Manage products, orders, and payments</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col py-4 gap-1">
            <button 
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${activeTab === "products" ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Tag size={18} className={activeTab === "products" ? "text-emerald-600" : "text-gray-400"} /> Products
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${activeTab === "orders" ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Package size={18} className={activeTab === "orders" ? "text-emerald-600" : "text-gray-400"} /> Orders
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${activeTab === "settings" ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings size={18} className={activeTab === "settings" ? "text-emerald-600" : "text-gray-400"} /> Settings
            </button>
          </div>

          <div className="flex-1 flex flex-col bg-white overflow-auto p-8">
            {activeTab === "products" && (
              <div className="max-w-4xl w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Products</h3>
                  <button 
                    onClick={() => setIsCreatingProduct(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                {isCreatingProduct && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                    <h4 className="font-bold text-gray-900 mb-4">New Product</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                        <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Inventory (Stock)</label>
                        <input type="number" value={newProduct.inventory} onChange={e => setNewProduct({...newProduct, inventory: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleCreateProduct} className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded">Save Product</button>
                      <button onClick={() => setIsCreatingProduct(false)} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Inventory</th>
                        <th className="px-6 py-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-gray-400" /></td></tr>
                      ) : products.length === 0 ? (
                        <tr><td colSpan={4} className="p-12 text-center text-gray-500">No products found. Start selling by adding a product!</td></tr>
                      ) : (
                        products.map(p => (
                          <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 text-gray-600">${p.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-gray-600">{p.inventory} in stock</td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-gray-400 hover:text-emerald-600"><Edit2 size={16} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-2xl w-full mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-emerald-600" /> Stripe Integration
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <p className="text-sm text-gray-600 mb-6">Enter your Stripe API keys to enable checkout and payment processing on your published website. For basic implementation, these are stored securely for this website.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Stripe Publishable Key</label>
                      <input 
                        type="text" 
                        value={stripeKeys.pub}
                        onChange={e => setStripeKeys({...stripeKeys, pub: e.target.value})}
                        placeholder="pk_test_..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Stripe Secret Key</label>
                      <input 
                        type="password" 
                        value={stripeKeys.sec}
                        onChange={e => setStripeKeys({...stripeKeys, sec: e.target.value})}
                        placeholder="sk_test_..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button 
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                      className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                    >
                      {isSavingSettings ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Save API Keys
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <Package size={32} className="text-emerald-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 max-w-sm mb-6">Once your store is live and customers start buying, their orders will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

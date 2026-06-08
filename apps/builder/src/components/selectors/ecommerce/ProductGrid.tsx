"use client";

import React, { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCartStore } from "./useCartStore";

interface ProductGridProps {
  layout?: "grid" | "list";
  columns?: number;
  gap?: number;
}

export const ProductGridSettings = () => {
  const { actions: { setProp }, layout, columns, gap } = useNode((node) => ({
    layout: node.data.props.layout,
    columns: node.data.props.columns,
    gap: node.data.props.gap,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <select 
          value={layout || "grid"} 
          onChange={(e) => setProp((p: ProductGridProps) => { p.layout = e.target.value as "grid" | "list"; })}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>

      {layout === "grid" && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Columns</label>
          <input 
            type="number" 
            min={1} max={6} 
            value={columns || 3} 
            onChange={(e) => setProp((p: ProductGridProps) => { p.columns = parseInt(e.target.value); })} 
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Gap (px)</label>
        <input 
          type="number" 
          value={gap || 24} 
          onChange={(e) => setProp((p: ProductGridProps) => { p.gap = parseInt(e.target.value); })} 
          className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
        />
      </div>
    </div>
  );
};

export const ProductGrid = ({ layout = "grid", columns = 3, gap = 24 }: ProductGridProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    // In a real scenario, websiteId would be passed through context or props from BuilderClient
    fetch("/api/studio/store/products?websiteId=default")
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full relative p-4 ${isSelected ? 'outline outline-2 outline-emerald-500 outline-offset-2 bg-emerald-50/10' : ''}`}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-t font-bold flex items-center gap-1">
          <ShoppingBag size={12} /> Product Grid
        </div>
      )}
      
      {loading ? (
        <div className="w-full h-32 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
          <Loader2 className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          <ShoppingBag size={24} className="mb-2 text-gray-300" />
          <p className="text-xs font-semibold">No Products Found</p>
          <p className="text-[10px]">Add products in the Store Manager</p>
        </div>
      ) : (
        <div 
          style={{ 
            display: "grid", 
            gap: `${gap}px`, 
            gridTemplateColumns: layout === "grid" ? `repeat(${columns}, 1fr)` : "1fr" 
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm flex flex-col group overflow-hidden transition-all hover:shadow-md">
              <div className="w-full aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300 relative">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <ShoppingBag size={32} />
                )}
                {product.inventory <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">${parseFloat(product.price).toFixed(2)}</p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addItem({ id: product.id, name: product.name, price: product.price });
                }}
                disabled={product.inventory <= 0}
                className="mt-auto w-full py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ProductGrid.craft = {
  displayName: "Product Grid",
  props: { layout: "grid", columns: 3, gap: 24 },
  rules: { canDrag: () => true },
  related: { settings: ProductGridSettings },
};

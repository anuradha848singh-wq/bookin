"use client";

import React, { useState, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Database, Loader2 } from "lucide-react";
import { Container } from "../structure/Container";
import { Text } from "../content/Text";

interface RepeaterProps {
  collectionId?: string;
  collectionName?: string;
  layout?: "grid" | "list";
  columns?: number;
  gap?: number;
}

export const RepeaterSettings = () => {
  const { actions: { setProp }, collectionId, layout, columns, gap } = useNode((node) => ({
    collectionId: node.data.props.collectionId,
    layout: node.data.props.layout,
    columns: node.data.props.columns,
    gap: node.data.props.gap,
  }));

  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We assume websiteId is available or we fetch all for the tenant
    fetch("/api/studio/cms/collections?websiteId=default")
      .then(res => res.json())
      .then(data => {
        setCollections(data.collections || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Data Source</label>
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Loader2 size={12} className="animate-spin" /> Loading collections...
          </div>
        ) : (
          <select 
            value={collectionId || ""} 
            onChange={(e) => setProp((p: RepeaterProps) => { 
              p.collectionId = e.target.value; 
              p.collectionName = collections.find(c => c.id === e.target.value)?.name || "";
            })}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-indigo-500"
          >
            <option value="">Select a Collection</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <select 
          value={layout || "grid"} 
          onChange={(e) => setProp((p: RepeaterProps) => { p.layout = e.target.value as "grid" | "list"; })}
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
            onChange={(e) => setProp((p: RepeaterProps) => { p.columns = parseInt(e.target.value); })} 
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Gap (px)</label>
        <input 
          type="number" 
          value={gap || 24} 
          onChange={(e) => setProp((p: RepeaterProps) => { p.gap = parseInt(e.target.value); })} 
          className="w-full border border-gray-200 rounded px-2 py-1 text-xs"
        />
      </div>
    </div>
  );
};

export const Repeater = ({ collectionId, collectionName, layout = "grid", columns = 3, gap = 24 }: RepeaterProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (collectionId) {
      fetch(`/api/studio/cms/collections/${collectionId}/items`)
        .then(res => res.json())
        .then(data => {
          setItems(data.items || []);
        });
    }
  }, [collectionId]);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full relative p-4 ${isSelected ? 'outline outline-2 outline-indigo-500 outline-offset-2 bg-indigo-50/10' : ''}`}
    >
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-t font-bold flex items-center gap-1">
          <Database size={12} /> {collectionName ? `Repeater: ${collectionName}` : "Data Repeater"}
        </div>
      )}
      
      {!collectionId ? (
        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
          <Database size={24} className="mb-2 text-gray-300" />
          <p className="text-xs font-semibold">Data Repeater</p>
          <p className="text-[10px]">Select a collection in settings</p>
        </div>
      ) : items.length === 0 ? (
        <div className="w-full p-8 border border-gray-200 rounded-lg text-center bg-gray-50">
          <p className="text-sm text-gray-500">No items found in "{collectionName}". Add some in the CMS.</p>
        </div>
      ) : (
        <div 
          style={{ 
            display: "grid", 
            gap: `${gap}px`, 
            gridTemplateColumns: layout === "grid" ? `repeat(${columns}, 1fr)` : "1fr" 
          }}
        >
          {items.map((item, idx) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2 relative group overflow-hidden">
              {/* Magic Binding Display for Preview */}
              <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                Dynamic Item
              </div>
              
              {/* Display dynamic properties based on schema loosely */}
              {Object.keys(item.data).map(key => {
                const val = item.data[key];
                if (typeof val === 'string' && (val.startsWith('http') || val.startsWith('/'))) {
                  return <img key={key} src={val} alt={key} className="w-full h-32 object-cover rounded mb-2" />;
                }
                if (typeof val === 'boolean') return null; // skip booleans for basic render
                return (
                  <div key={key}>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{key}</span>
                    <p className={`text-gray-800 ${key.toLowerCase() === 'title' || key.toLowerCase() === 'name' ? 'font-bold text-lg' : 'text-sm'}`}>
                      {String(val)}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Repeater.craft = {
  displayName: "Data Repeater",
  props: { layout: "grid", columns: 3, gap: 24 },
  rules: { canDrag: () => true },
  related: { settings: RepeaterSettings },
};

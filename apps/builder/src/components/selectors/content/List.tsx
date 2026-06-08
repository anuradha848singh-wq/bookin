"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Plus, Trash2 } from "lucide-react";

interface ListProps {
  items?: string[];
  type?: "ordered" | "unordered";
  fontSize?: number;
  color?: string;
  markerColor?: string;
  spacing?: number;
}

export const ListSettings = () => {
  const { actions: { setProp }, items, type, fontSize, color, markerColor, spacing } = useNode((node) => ({
    items: node.data.props.items,
    type: node.data.props.type,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    markerColor: node.data.props.markerColor,
    spacing: node.data.props.spacing,
  }));

  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setProp((p: ListProps) => {
        p.items = [...(p.items || []), newItem.trim()];
      });
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setProp((p: ListProps) => {
      p.items = p.items?.filter((_, i) => i !== index) || [];
    });
  };

  const updateItem = (index: number, value: string) => {
    setProp((p: ListProps) => {
      if (p.items) {
        p.items[index] = value;
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">List Type</label>
        <select 
          value={type} 
          onChange={(e) => setProp((p: ListProps) => { p.type = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="unordered">Bullet Points</option>
          <option value="ordered">Numbered</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">List Items</label>
        <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
          {items?.map((item: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input 
                type="text" 
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#0066FF]"
              />
              <button
                onClick={() => removeItem(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add new item..."
            className="flex-1 border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
          <button
            onClick={addItem}
            className="p-1.5 bg-[#0066FF] text-white hover:bg-[#0052CC] rounded transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Font Size</label>
          <input 
            type="number" 
            value={fontSize} 
            onChange={(e) => setProp((p: ListProps) => { p.fontSize = parseInt(e.target.value) || 16; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Spacing</label>
          <input 
            type="number" 
            value={spacing} 
            onChange={(e) => setProp((p: ListProps) => { p.spacing = parseInt(e.target.value) || 8; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Text Color</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setProp((p: ListProps) => { p.color = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Marker Color</label>
          <input 
            type="color" 
            value={markerColor} 
            onChange={(e) => setProp((p: ListProps) => { p.markerColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
      </div>
    </div>
  );
};

export const List = ({ 
  items = ["First item", "Second item", "Third item"], 
  type = "unordered",
  fontSize = 16,
  color = "#374151",
  markerColor = "#0066FF",
  spacing = 8
}: ListProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const ListTag = type === "ordered" ? "ol" : "ul";

  return (
    <ListTag
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        fontSize: `${fontSize}px`,
        color,
        paddingLeft: "24px",
        margin: "16px 0",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        listStyleType: type === "ordered" ? "decimal" : "disc",
      }}
    >
      {items.map((item: string, index: number) => (
        <li
          key={index}
          style={{
            marginBottom: `${spacing}px`,
            lineHeight: "1.6",
          }}
        >
          <span style={{ color: markerColor }}>
            {/* Marker color is applied via CSS */}
          </span>
          {item}
        </li>
      ))}
      <style jsx>{`
        ${ListTag === "ul" ? "ul" : "ol"}::marker {
          color: ${markerColor};
        }
      `}</style>
    </ListTag>
  );
};

List.craft = {
  displayName: "List",
  props: { 
    items: ["First item", "Second item", "Third item"], 
    type: "unordered",
    fontSize: 16,
    color: "#374151",
    markerColor: "#0066FF",
    spacing: 8
  },
  related: { settings: ListSettings },
};

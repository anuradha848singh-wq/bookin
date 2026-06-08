"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface DividerProps {
  height?: number;
  color?: string;
  margin?: number;
  width?: string;
}

export const DividerSettings = () => {
  const { actions: { setProp }, height, color, margin, width } = useNode((node) => ({
    height: node.data.props.height,
    color: node.data.props.color,
    margin: node.data.props.margin,
    width: node.data.props.width,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Divider Settings</h4>
        
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Thickness (px)</label>
          <input 
            type="number" 
            value={height || 1} 
            onChange={(e) => setProp((p: DividerProps) => { p.height = parseInt(e.target.value) || 1; })} 
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Width (%) or px</label>
          <input 
            type="text" 
            value={width || "100%"} 
            onChange={(e) => setProp((p: DividerProps) => { p.width = e.target.value; })} 
            className={inputClass}
            placeholder="e.g. 100%, 80px"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Margin Y (px)</label>
          <input 
            type="number" 
            value={margin || 16} 
            onChange={(e) => setProp((p: DividerProps) => { p.margin = parseInt(e.target.value) || 0; })} 
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Divider Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
            <input 
              type="color" 
              value={color || "#E5E7EB"} 
              onChange={(e) => setProp((p: DividerProps) => { p.color = e.target.value; })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Divider = ({ 
  height = 1, 
  color = "#E5E7EB", 
  margin = 16,
  width = "100%"
}: DividerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        padding: `${margin}px 0`, 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "2px", 
      }}
    >
      <div 
        style={{ 
          height: `${height}px`, 
          backgroundColor: color,
          width,
        }}
      />
    </div>
  );
};

Divider.craft = {
  displayName: "Divider",
  props: { 
    height: 1, 
    color: "#E5E7EB", 
    margin: 16,
    width: "100%"
  },
  rules: { canDrag: () => true },
  related: { settings: DividerSettings },
};

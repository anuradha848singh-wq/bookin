"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface DividerProps {
  color?: string;
  thickness?: number;
  style?: "solid" | "dashed" | "dotted";
  marginY?: number;
}

export const DividerSettings = () => {
  const { actions: { setProp }, color, thickness, style, marginY } = useNode((node) => ({
    color: node.data.props.color,
    thickness: node.data.props.thickness,
    style: node.data.props.style,
    marginY: node.data.props.marginY,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Color</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setProp((p: DividerProps) => { p.color = e.target.value; })}
          className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Thickness</label>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={1} 
            max={10} 
            value={thickness}
            onChange={(e) => setProp((p: DividerProps) => { p.thickness = parseInt(e.target.value); })}
            className="flex-1"
          />
          <span className="text-[12px] font-medium text-gray-700 w-12 text-right">{thickness}px</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <select 
          value={style} 
          onChange={(e) => setProp((p: DividerProps) => { p.style = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Vertical Spacing</label>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={0} 
            max={80} 
            value={marginY}
            onChange={(e) => setProp((p: DividerProps) => { p.marginY = parseInt(e.target.value); })}
            className="flex-1"
          />
          <span className="text-[12px] font-medium text-gray-700 w-12 text-right">{marginY}px</span>
        </div>
      </div>
    </div>
  );
};

export const Divider = ({ color = "#E5E5E5", thickness = 1, style = "solid", marginY = 20 }: DividerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{
        margin: `${marginY}px 0`,
        padding: "4px 0",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
      }}
    >
      <hr
        style={{
          border: "none",
          borderTop: `${thickness}px ${style} ${color}`,
          margin: 0,
        }}
      />
    </div>
  );
};

Divider.craft = {
  displayName: "Divider",
  props: { color: "#E5E5E5", thickness: 1, style: "solid", marginY: 20 },
  related: { settings: DividerSettings },
};

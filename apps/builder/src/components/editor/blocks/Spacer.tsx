"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface SpacerProps {
  height?: number;
}

export const SpacerSettings = () => {
  const { actions: { setProp }, height } = useNode((node) => ({
    height: node.data.props.height,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Spacer Height</h4>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className={labelClass}>Height Y</label>
            <span className="text-[10px] font-bold text-blue-500">{height || 20}px</span>
          </div>
          <input 
            type="range" 
            min={8} 
            max={200} 
            value={height || 20} 
            onChange={(e) => setProp((p: SpacerProps) => { p.height = parseInt(e.target.value); })} 
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
      </div>
    </div>
  );
};

export const Spacer = ({ 
  height = 20
}: SpacerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        height: `${height}px`, 
        width: "100%",
        boxSizing: "border-box",
        outline: isSelected ? "1.5px dashed #0066FF" : "none", 
        outlineOffset: "-1px", 
      }}
      className={!isSelected ? "bg-transparent" : "bg-blue-500/5"}
    />
  );
};

Spacer.craft = {
  displayName: "Spacer",
  props: { 
    height: 20
  },
  rules: { canDrag: () => true },
  related: { settings: SpacerSettings },
};

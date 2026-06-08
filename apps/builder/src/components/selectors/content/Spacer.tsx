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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Height</label>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min={10} 
            max={200} 
            value={height}
            onChange={(e) => setProp((p: SpacerProps) => { p.height = parseInt(e.target.value); })}
            className="flex-1"
          />
          <span className="text-[12px] font-medium text-gray-700 w-16 text-right">{height}px</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-[11px] text-blue-800">
          <strong>Tip:</strong> Use spacers to add vertical spacing between sections without affecting padding.
        </p>
      </div>
    </div>
  );
};

export const Spacer = ({ height = 40 }: SpacerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{
        height: `${height}px`,
        width: "100%",
        position: "relative",
        outline: isSelected ? "2px dashed #0066FF" : "2px dashed transparent",
        outlineOffset: "-2px",
        backgroundColor: isSelected ? "rgba(0, 102, 255, 0.05)" : "transparent",
        transition: "all 0.2s",
      }}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-medium text-[#0066FF] bg-white px-2 py-1 rounded shadow-sm">
            {height}px Spacer
          </span>
        </div>
      )}
    </div>
  );
};

Spacer.craft = {
  displayName: "Spacer",
  props: { height: 40 },
  related: { settings: SpacerSettings },
};

"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  height?: number;
  color?: string;
  backgroundColor?: string;
  rounded?: boolean;
  animated?: boolean;
}

export const ProgressBarSettings = () => {
  const { actions: { setProp }, value, max, label, showPercentage, height, color, backgroundColor, rounded, animated } = useNode((node) => ({
    value: node.data.props.value,
    max: node.data.props.max,
    label: node.data.props.label,
    showPercentage: node.data.props.showPercentage,
    height: node.data.props.height,
    color: node.data.props.color,
    backgroundColor: node.data.props.backgroundColor,
    rounded: node.data.props.rounded,
    animated: node.data.props.animated,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Label</label>
        <input 
          type="text" 
          value={label} 
          onChange={(e) => setProp((p: ProgressBarProps) => { p.label = e.target.value; })}
          placeholder="Progress label..."
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Value</label>
          <input 
            type="number" 
            value={value} 
            min="0"
            max={max}
            onChange={(e) => setProp((p: ProgressBarProps) => { p.value = parseInt(e.target.value) || 0; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Max</label>
          <input 
            type="number" 
            value={max} 
            min="1"
            onChange={(e) => setProp((p: ProgressBarProps) => { p.max = parseInt(e.target.value) || 100; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Height (px)</label>
        <input 
          type="number" 
          value={height} 
          min="4"
          max="40"
          onChange={(e) => setProp((p: ProgressBarProps) => { p.height = parseInt(e.target.value) || 12; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Bar Color</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setProp((p: ProgressBarProps) => { p.color = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Background</label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setProp((p: ProgressBarProps) => { p.backgroundColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Show Percentage</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={showPercentage}
              onChange={(e) => setProp((p: ProgressBarProps) => { p.showPercentage = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Rounded</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={rounded}
              onChange={(e) => setProp((p: ProgressBarProps) => { p.rounded = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Animated</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={animated}
              onChange={(e) => setProp((p: ProgressBarProps) => { p.animated = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export const ProgressBar = ({ 
  value = 65, 
  max = 100,
  label = "",
  showPercentage = true,
  height = 12,
  color = "#0066FF",
  backgroundColor = "#E5E7EB",
  rounded = true,
  animated = false
}: ProgressBarProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        width: "100%",
        padding: "8px",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
      }}
    >
      {(label || showPercentage) && (
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "8px",
          fontSize: "14px",
          color: "#374151"
        }}>
          {label && <span>{label}</span>}
          {showPercentage && <span style={{ fontWeight: 600 }}>{percentage.toFixed(0)}%</span>}
        </div>
      )}
      
      <div
        style={{
          width: "100%",
          height: `${height}px`,
          backgroundColor,
          borderRadius: rounded ? "9999px" : "4px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
            transition: animated ? "width 0.5s ease-in-out" : "none",
            borderRadius: rounded ? "9999px" : "4px",
          }}
        />
      </div>
    </div>
  );
};

ProgressBar.craft = {
  displayName: "Progress Bar",
  props: { 
    value: 65, 
    max: 100,
    label: "",
    showPercentage: true,
    height: 12,
    color: "#0066FF",
    backgroundColor: "#E5E7EB",
    rounded: true,
    animated: false
  },
  related: { settings: ProgressBarSettings },
};

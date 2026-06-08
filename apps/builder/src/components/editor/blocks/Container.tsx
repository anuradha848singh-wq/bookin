"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ArrowDown, 
  ArrowRight,
  Maximize2,
  ChevronDown
} from "lucide-react";

interface ContainerProps {
  background?: string;
  padding?: number;
  borderRadius?: number;
  flexDirection?: "row" | "column";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  gap?: number;
  width?: string;
  height?: string;
  children?: React.ReactNode;
}

export const ContainerSettings = () => {
  const { 
    actions: { setProp }, 
    background, 
    padding, 
    borderRadius,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    width,
    height
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
    gap: node.data.props.gap,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Background Fill */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Section Styling</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Background Color</label>
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
            <input 
              type="color" 
              value={background || "#ffffff"} 
              onChange={(e) => setProp((p: ContainerProps) => { p.background = e.target.value; })} 
              className="w-full h-full cursor-pointer border-none bg-transparent" 
            />
          </div>
        </div>
      </div>

      {/* Flexbox Layout */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Flexbox Layout</h4>
        
        {/* Direction */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Direction</label>
          <div className="flex border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
            <button
              onClick={() => setProp((p: ContainerProps) => { p.flexDirection = "column"; })}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${flexDirection === "column" ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              <ArrowDown size={12} strokeWidth={2.5} /> Column
            </button>
            <button
              onClick={() => setProp((p: ContainerProps) => { p.flexDirection = "row"; })}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${flexDirection === "row" ? "bg-white text-blue-500 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              <ArrowRight size={12} strokeWidth={2.5} /> Row
            </button>
          </div>
        </div>

        {/* Alignment & Justification */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Align Items</label>
            <div className="relative">
              <select
                value={alignItems || "stretch"}
                onChange={(e) => setProp((p: ContainerProps) => { p.alignItems = e.target.value as any; })}
                className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="stretch">Stretch</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Justify Content</label>
            <div className="relative">
              <select
                value={justifyContent || "flex-start"}
                onChange={(e) => setProp((p: ContainerProps) => { p.justifyContent = e.target.value as any; })}
                className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Spacing & Gap */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Gap (px)</label>
            <input 
              type="number" 
              value={gap || 0} 
              onChange={(e) => setProp((p: ContainerProps) => { p.gap = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Padding (px)</label>
            <input 
              type="number" 
              value={padding || 0} 
              onChange={(e) => setProp((p: ContainerProps) => { p.padding = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Sizing & Borders */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Dimensions & Borders</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Width</label>
            <input 
              type="text" 
              value={width || "100%"} 
              onChange={(e) => setProp((p: ContainerProps) => { p.width = e.target.value; })} 
              className={inputClass}
              placeholder="e.g. 100%, auto, 400px"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Height</label>
            <input 
              type="text" 
              value={height || "auto"} 
              onChange={(e) => setProp((p: ContainerProps) => { p.height = e.target.value; })} 
              className={inputClass}
              placeholder="e.g. auto, 200px"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Border Radius (px)</label>
          <input 
            type="number" 
            value={borderRadius || 0} 
            onChange={(e) => setProp((p: ContainerProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export const Container = ({ 
  background = "transparent", 
  padding = 20, 
  borderRadius = 0, 
  flexDirection = "column",
  alignItems = "stretch",
  justifyContent = "flex-start",
  gap = 0,
  width = "100%",
  height = "auto",
  children 
}: ContainerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const isTransparent = !background || background === "transparent";

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        background, 
        padding: `${padding}px`, 
        borderRadius: `${borderRadius}px`, 
        display: "flex",
        flexDirection,
        alignItems,
        justifyContent,
        gap: `${gap}px`,
        width,
        height,
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px", 
        minHeight: "50px", 
        transition: "outline 0.15s",
        boxSizing: "border-box",
      }}
      className={`relative ${isTransparent ? "border border-dashed border-gray-300" : ""}`}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: { 
    background: "transparent", 
    padding: 20, 
    borderRadius: 0,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 0,
    width: "100%",
    height: "auto",
  },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};

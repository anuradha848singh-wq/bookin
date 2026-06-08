"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import * as LucideIcons from "lucide-react";

const AVAILABLE_ICONS: Record<string, keyof typeof LucideIcons> = {
  stethoscope: "Stethoscope",
  heart: "Heart",
  smile: "Smile",
  activity: "Activity",
  video: "Video",
  award: "Award",
  shield: "Shield",
  users: "Users",
  phone: "Phone",
  mapPin: "MapPin",
  star: "Star",
  calendar: "Calendar",
  clock: "Clock",
  check: "Check",
};

interface IconProps {
  iconName?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

export const IconSettings = () => {
  const { 
    actions: { setProp }, 
    iconName, 
    size, 
    color,
    backgroundColor,
    borderRadius,
    padding
  } = useNode((node) => ({
    iconName: node.data.props.iconName,
    size: node.data.props.size,
    color: node.data.props.color,
    backgroundColor: node.data.props.backgroundColor,
    borderRadius: node.data.props.borderRadius,
    padding: node.data.props.padding,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Choose Icon</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Icon Glyph</label>
          <div className="relative">
            <select
              value={iconName || "stethoscope"}
              onChange={(e) => setProp((p: IconProps) => { p.iconName = e.target.value; })}
              className="w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-2 pr-8 focus:outline-none appearance-none font-bold text-gray-700 cursor-pointer"
            >
              {Object.keys(AVAILABLE_ICONS).map((key) => (
                <option key={key} value={key}>{AVAILABLE_ICONS[key]}</option>
              ))}
            </select>
            <LucideIcons.ChevronDown size={12} className="absolute right-2 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Styling & Sizing</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Glyph Size (px)</label>
            <input 
              type="number" 
              value={size || 24} 
              onChange={(e) => setProp((p: IconProps) => { p.size = parseInt(e.target.value) || 12; })} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Padding (px)</label>
            <input 
              type="number" 
              value={padding || 8} 
              onChange={(e) => setProp((p: IconProps) => { p.padding = parseInt(e.target.value) || 0; })} 
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Icon Color</label>
            <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
              <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
              <input 
                type="color" 
                value={color || "#115E59"} 
                onChange={(e) => setProp((p: IconProps) => { p.color = e.target.value; })} 
                className="w-full h-full cursor-pointer border-none bg-transparent" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>BG Color</label>
            <div className="flex items-center border border-gray-200 bg-gray-50 rounded overflow-hidden h-8">
              <div className="px-2 text-[10px] text-gray-400 border-r border-gray-200 font-bold uppercase">Fill</div>
              <input 
                type="color" 
                value={backgroundColor || "#F0FDFA"} 
                onChange={(e) => setProp((p: IconProps) => { p.backgroundColor = e.target.value; })} 
                className="w-full h-full cursor-pointer border-none bg-transparent" 
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <label className={labelClass}>Border Radius (px)</label>
          <input 
            type="number" 
            value={borderRadius || 8} 
            onChange={(e) => setProp((p: IconProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export const Icon = ({ 
  iconName = "stethoscope", 
  size = 24, 
  color = "#115E59", 
  backgroundColor = "#F0FDFA", 
  borderRadius = 8, 
  padding = 8
}: IconProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const lucideIconKey = AVAILABLE_ICONS[iconName] || "Stethoscope";
  const IconComponent = (LucideIcons[lucideIconKey] as React.ComponentType<any>) || LucideIcons.Stethoscope;

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "2px", 
        padding: `${padding}px`,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        color,
        boxSizing: "border-box"
      }}
    >
      <IconComponent size={size} strokeWidth={2.2} />
    </div>
  );
};

Icon.craft = {
  displayName: "Icon",
  props: { 
    iconName: "stethoscope", 
    size: 24, 
    color: "#115E59", 
    backgroundColor: "#F0FDFA", 
    borderRadius: 8, 
    padding: 8
  },
  rules: { canDrag: () => true },
  related: { settings: IconSettings },
};

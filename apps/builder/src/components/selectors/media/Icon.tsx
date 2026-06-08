"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import * as Icons from "lucide-react";

interface IconProps {
  icon?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const IconSettings = () => {
  const { actions: { setProp }, icon, size, color, strokeWidth } = useNode((node) => ({
    icon: node.data.props.icon,
    size: node.data.props.size,
    color: node.data.props.color,
    strokeWidth: node.data.props.strokeWidth,
  }));

  // Popular icons list
  const popularIcons = [
    "Heart", "Star", "Home", "User", "Mail", "Phone", "MapPin", "Calendar",
    "Clock", "Search", "Menu", "X", "Check", "ChevronRight", "ChevronLeft",
    "ArrowRight", "ArrowLeft", "Plus", "Minus", "Settings", "Bell", "ShoppingCart",
    "Camera", "Image", "Video", "Music", "Download", "Upload", "Share2", "Link2"
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Icon</label>
        <select 
          value={icon} 
          onChange={(e) => setProp((p: IconProps) => { p.icon = e.target.value; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          {popularIcons.map((iconName) => (
            <option key={iconName} value={iconName}>{iconName}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Size</label>
          <input 
            type="number" 
            value={size} 
            onChange={(e) => setProp((p: IconProps) => { p.size = parseInt(e.target.value) || 24; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Stroke</label>
          <input 
            type="number" 
            value={strokeWidth} 
            min="1"
            max="4"
            step="0.5"
            onChange={(e) => setProp((p: IconProps) => { p.strokeWidth = parseFloat(e.target.value) || 2; })}
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Color</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setProp((p: IconProps) => { p.color = e.target.value; })}
          className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
        />
      </div>
    </div>
  );
};

export const Icon = ({ 
  icon = "Heart", 
  size = 24, 
  color = "#000000",
  strokeWidth = 2 
}: IconProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  // Get the icon component dynamically
  const IconComponent = (Icons as any)[icon] || Icons.Heart;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
      }}
    >
      <IconComponent size={size} color={color} strokeWidth={strokeWidth} />
    </div>
  );
};

Icon.craft = {
  displayName: "Icon",
  props: { icon: "Heart", size: 24, color: "#000000", strokeWidth: 2 },
  related: { settings: IconSettings },
};

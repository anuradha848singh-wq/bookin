"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Menu, Home, Info, Phone, Briefcase } from "lucide-react";

interface BuilderSidebarProps {
  backgroundColor?: string;
  textColor?: string;
  logoText?: string;
  width?: number;
}

export const BuilderSidebarSettings = () => {
  const { actions: { setProp }, backgroundColor, textColor, logoText, width } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    logoText: node.data.props.logoText,
    width: node.data.props.width,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Brand</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px]">Text</span>
          <input 
            type="text" 
            value={logoText || ""} 
            onChange={(e) => setProp((p: BuilderSidebarProps) => { p.logoText = e.target.value; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Width (px)</div>
          <input 
            type="number" 
            value={width || 250} 
            onChange={(e) => setProp((p: BuilderSidebarProps) => { p.width = parseInt(e.target.value) || 250; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#f8fafc"} onChange={(e) => setProp((p: BuilderSidebarProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#1e293b"} onChange={(e) => setProp((p: BuilderSidebarProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BuilderSidebar = ({ 
  backgroundColor = "#f8fafc", 
  textColor = "#1e293b", 
  logoText = "My Website",
  width = 250
}: BuilderSidebarProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const links = [
    { label: "Home", icon: Home },
    { label: "About Us", icon: Info },
    { label: "Services", icon: Briefcase },
    { label: "Contact", icon: Phone },
  ];

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        backgroundColor, 
        color: textColor,
        width: `${width}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s, background-color 0.3s, width 0.3s"
      }}
      className={`min-h-[500px] h-full border-r border-black/5 flex flex-col`}
    >
      <div className="p-6">
        <div style={{ color: textColor }} className="text-xl font-bold tracking-tight mb-10">
          {logoText}
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link, i) => (
            <div 
              key={i} 
              style={{ color: textColor }} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-black/5 cursor-pointer transition-colors"
            >
              <link.icon size={18} className="opacity-70" />
              {link.label}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-black/5">
        <button 
          className="w-full py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: textColor, color: backgroundColor }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

BuilderSidebar.craft = {
  displayName: "Vertical Sidebar",
  props: { 
    backgroundColor: "#f8fafc", 
    textColor: "#1e293b", 
    logoText: "Clinic Name",
    width: 250
  },
  rules: { canDrag: () => true },
  related: { settings: BuilderSidebarSettings },
};

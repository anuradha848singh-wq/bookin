"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";
import { ChevronDown } from "lucide-react";

interface MegaMenuProps {
  label?: string;
  textColor?: string;
  dropdownBackground?: string;
  children?: React.ReactNode;
}

export const MegaMenuSettings = () => {
  const { actions: { setProp }, label, textColor, dropdownBackground } = useNode((node) => ({
    label: node.data.props.label,
    textColor: node.data.props.textColor,
    dropdownBackground: node.data.props.dropdownBackground,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Label Text</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <input 
            type="text" 
            value={label || ""} 
            onChange={(e) => setProp((p: MegaMenuProps) => { p.label = e.target.value; })} 
            className="w-full h-full px-3 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: MegaMenuProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Menu BG</div>
            <input type="color" value={dropdownBackground || "#ffffff"} onChange={(e) => setProp((p: MegaMenuProps) => { p.dropdownBackground = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MegaMenu = ({ 
  label = "Services", 
  textColor = "#111827",
  dropdownBackground = "#ffffff",
  children 
}: MegaMenuProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      <div 
        className="flex items-center gap-1 cursor-pointer py-2 px-3 text-[14px] font-medium transition-opacity hover:opacity-70"
        style={{ color: textColor }}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <div 
        className={`absolute top-full left-0 mt-2 w-[600px] shadow-2xl rounded-xl border border-black/5 overflow-hidden transition-all duration-200 z-[60] origin-top-left ${isOpen || isSelected ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ backgroundColor: dropdownBackground }}
      >
        <div className="p-4 w-full h-full min-h-[150px]">
          {/* We render children inside here. In Craft JS, we define default children using Element in the craft config. */}
          {children}
        </div>
      </div>
    </div>
  );
};

MegaMenu.craft = {
  displayName: "Mega Menu",
  props: { 
    label: "Services",
    textColor: "#111827",
    dropdownBackground: "#ffffff",
  },
  rules: { canDrag: () => true },
  related: { settings: MegaMenuSettings },
};

"use client";

import React from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";
import { Image } from "../media/Image";
import { Text } from "../content/Text";
import { Button } from "../content/Button";

interface CardProps {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverEffect?: "none" | "lift" | "glow";
  padding?: number;
}

export const CardSettings = () => {
  const { actions: { setProp }, backgroundColor, borderColor, borderRadius, shadow, hoverEffect, padding } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    borderColor: node.data.props.borderColor,
    borderRadius: node.data.props.borderRadius,
    shadow: node.data.props.shadow,
    hoverEffect: node.data.props.hoverEffect,
    padding: node.data.props.padding,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: CardProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Border</div>
            <input type="color" value={borderColor || "#e5e7eb"} onChange={(e) => setProp((p: CardProps) => { p.borderColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout & Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Pad</div>
            <input 
              type="number" 
              value={padding || 0} 
              onChange={(e) => setProp((p: CardProps) => { p.padding = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input 
              type="number" 
              value={borderRadius || 16} 
              onChange={(e) => setProp((p: CardProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Shadow</span>
          <select 
            value={shadow || "md"} 
            onChange={(e) => setProp((p: CardProps) => { p.shadow = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>

        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Hover</span>
          <select 
            value={hoverEffect || "lift"} 
            onChange={(e) => setProp((p: CardProps) => { p.hoverEffect = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="none">None</option>
            <option value="lift">Lift Up</option>
            <option value="glow">Glow</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export const Card = ({ 
  backgroundColor = "#ffffff",
  borderColor = "#e5e7eb",
  borderRadius = 16,
  shadow = "md",
  hoverEffect = "lift",
  padding = 24
}: CardProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const getShadowClass = () => {
    switch(shadow) {
      case "sm": return "shadow-sm";
      case "lg": return "shadow-lg";
      case "xl": return "shadow-xl";
      case "none": return "";
      case "md":
      default: return "shadow-md";
    }
  };

  const getHoverClass = () => {
    if (isSelected) return ""; // Disable hover effects while selecting
    switch(hoverEffect) {
      case "lift": return "hover:-translate-y-1 hover:shadow-xl transition-all duration-300";
      case "glow": return "hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-shadow duration-300";
      case "none":
      default: return "";
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full overflow-hidden border ${getShadowClass()} ${getHoverClass()}`}
      style={{ 
        backgroundColor, 
        borderColor, 
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px",
      }}
    >
      <div style={{ padding: `${padding}px` }} className="w-full h-full min-h-[100px]">
        {/* The dropzone where users add components */}
        <Element id="card-content" is={Container} canvas padding={0} background="transparent" />
      </div>
    </div>
  );
};

Card.craft = {
  displayName: "Card Container",
  props: { 
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 16,
    shadow: "md",
    hoverEffect: "lift",
    padding: 24
  },
  rules: { canDrag: () => true },
  related: { settings: CardSettings },
};

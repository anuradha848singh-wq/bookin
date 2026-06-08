"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbTrailProps {
  color?: string;
  activeColor?: string;
  fontSize?: number;
  separatorStyle?: "slash" | "chevron" | "dot";
  items?: { label: string; url: string }[];
}

export const BreadcrumbTrailSettings = () => {
  const { actions: { setProp }, color, activeColor, fontSize, separatorStyle } = useNode((node) => ({
    color: node.data.props.color,
    activeColor: node.data.props.activeColor,
    fontSize: node.data.props.fontSize,
    separatorStyle: node.data.props.separatorStyle,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={color || "#6b7280"} onChange={(e) => setProp((p: BreadcrumbTrailProps) => { p.color = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Active</div>
            <input type="color" value={activeColor || "#111827"} onChange={(e) => setProp((p: BreadcrumbTrailProps) => { p.activeColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Typography & Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Size</span>
            <input 
              type="number" 
              value={fontSize || 14} 
              onChange={(e) => setProp((p: BreadcrumbTrailProps) => { p.fontSize = parseInt(e.target.value) || 14; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <select 
              value={separatorStyle || "chevron"} 
              onChange={(e) => setProp((p: BreadcrumbTrailProps) => { p.separatorStyle = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700 outline-none"
            >
              <option value="chevron">Chevron ( {">"} )</option>
              <option value="slash">Slash ( / )</option>
              <option value="dot">Dot ( • )</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BreadcrumbTrail = ({ 
  color = "#6b7280", 
  activeColor = "#111827",
  fontSize = 14,
  separatorStyle = "chevron",
  items = [
    { label: "Home", url: "/" },
    { label: "Services", url: "/services" },
    { label: "Teeth Whitening", url: "/services/teeth-whitening" }
  ]
}: BreadcrumbTrailProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const renderSeparator = () => {
    switch (separatorStyle) {
      case "slash": return <span className="mx-2 opacity-50">/</span>;
      case "dot": return <span className="mx-2 opacity-50">•</span>;
      case "chevron": 
      default:
        return <ChevronRight size={fontSize} className="mx-2 opacity-50" />;
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
      className="w-full py-3"
    >
      <nav className="flex items-center flex-wrap" style={{ fontSize: `${fontSize}px` }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={i}>
              {i === 0 && <Home size={fontSize} className="mr-2" style={{ color }} />}
              <a 
                href={item.url} 
                style={{ 
                  color: isLast ? activeColor : color,
                  fontWeight: isLast ? 600 : 400
                }} 
                className="hover:underline no-underline transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                {item.label}
              </a>
              {!isLast && <span style={{ color }}>{renderSeparator()}</span>}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

BreadcrumbTrail.craft = {
  displayName: "Breadcrumbs",
  props: { 
    color: "#6b7280", 
    activeColor: "#111827",
    fontSize: 14,
    separatorStyle: "chevron"
  },
  rules: { canDrag: () => true },
  related: { settings: BreadcrumbTrailSettings },
};

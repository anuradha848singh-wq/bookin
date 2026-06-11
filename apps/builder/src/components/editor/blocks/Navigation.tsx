"use client";

import React, { useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { useDeviceMode, resolveResponsiveProp, updateResponsiveProp, ResponsiveValue } from "../DeviceModeContext";
import { AlignLeft, AlignCenter, AlignRight, Plus, Trash2 } from "lucide-react";

interface NavLink {
  id: string;
  label: string;
  href: string;
}

interface NavigationProps {
  links?: NavLink[];
  direction?: ResponsiveValue<"row" | "column">;
  gap?: ResponsiveValue<number>;
  color?: ResponsiveValue<string>;
  hoverColor?: ResponsiveValue<string>;
  fontSize?: ResponsiveValue<number>;
  fontWeight?: ResponsiveValue<string>;
  justifyContent?: ResponsiveValue<"flex-start" | "center" | "flex-end" | "space-between">;
  width?: ResponsiveValue<string | number>;
  padding?: ResponsiveValue<number | string>;
  hiddenBreakpoints?: { desktop: boolean, tablet: boolean, mobile: boolean };
}

export const NavigationSettings = () => {
  const { mode } = useDeviceMode();
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as NavigationProps,
  }));

  const links = props.links || [];
  const direction = resolveResponsiveProp(props.direction, mode) || "row";
  const gap = resolveResponsiveProp(props.gap, mode) || 20;
  const color = resolveResponsiveProp(props.color, mode) || "#374151";
  const hoverColor = resolveResponsiveProp(props.hoverColor, mode) || "#2563eb";
  const fontSize = resolveResponsiveProp(props.fontSize, mode) || 14;
  const fontWeight = resolveResponsiveProp(props.fontWeight, mode) || "500";
  const justifyContent = resolveResponsiveProp(props.justifyContent, mode) || "flex-start";

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  const addLink = () => {
    setProp((p: NavigationProps) => {
      const current = p.links || [];
      p.links = [...current, { id: crypto.randomUUID(), label: "New Link", href: "#" }];
    });
  };

  const removeLink = (id: string) => {
    setProp((p: NavigationProps) => {
      p.links = (p.links || []).filter(l => l.id !== id);
    });
  };

  const updateLink = (id: string, field: "label" | "href", value: string) => {
    setProp((p: NavigationProps) => {
      const link = (p.links || []).find(l => l.id === id);
      if (link) link[field] = value;
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Links Manager */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Navigation Links</h4>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <div key={link.id} className="flex flex-col gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={link.label}
                  onChange={(e) => updateLink(link.id, "label", e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                  placeholder="Label"
                />
                <button onClick={() => removeLink(link.id)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 size={12} />
                </button>
              </div>
              <input 
                type="text" 
                value={link.href}
                onChange={(e) => updateLink(link.id, "href", e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                placeholder="URL (e.g., /about)"
              />
            </div>
          ))}
          <button 
            onClick={addLink}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 border border-dashed border-gray-300 rounded text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors mt-1"
          >
            <Plus size={12} /> Add Link
          </button>
        </div>
      </div>

      {/* Styling */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4">
        <h4 className="text-xs font-bold text-gray-700">Styling</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Link Color</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setProp((p: NavigationProps) => { p.color = updateResponsiveProp(p.color, e.target.value, mode); })} 
              className="w-full h-8 p-1 border rounded cursor-pointer" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Hover Color</label>
            <input 
              type="color" 
              value={hoverColor} 
              onChange={(e) => setProp((p: NavigationProps) => { p.hoverColor = updateResponsiveProp(p.hoverColor, e.target.value, mode); })} 
              className="w-full h-8 p-1 border rounded cursor-pointer" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Font Size</label>
            <input 
              type="number" 
              value={fontSize} 
              onChange={(e) => setProp((p: NavigationProps) => { p.fontSize = updateResponsiveProp(p.fontSize, parseInt(e.target.value) || 14, mode); }, 500)} 
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Gap</label>
            <input 
              type="number" 
              value={gap} 
              onChange={(e) => setProp((p: NavigationProps) => { p.gap = updateResponsiveProp(p.gap, parseInt(e.target.value) || 20, mode); }, 500)} 
              className={inputClass}
            />
          </div>
        </div>
      </div>
      
      {/* Layout */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Layout</h4>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Direction</label>
          <select
            value={direction}
            onChange={(e) => setProp((p: NavigationProps) => { p.direction = updateResponsiveProp(p.direction, e.target.value as any, mode); })}
            className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5"
          >
            <option value="row">Horizontal</option>
            <option value="column">Vertical</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Alignment</label>
          <select
            value={justifyContent}
            onChange={(e) => setProp((p: NavigationProps) => { p.justifyContent = updateResponsiveProp(p.justifyContent, e.target.value as any, mode); })}
            className="w-full text-xs bg-white border border-gray-200 rounded px-2 py-1.5"
          >
            <option value="flex-start">Start</option>
            <option value="center">Center</option>
            <option value="flex-end">End</option>
            <option value="space-between">Space Between</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export const Navigation = ({ 
  links = [
    { id: "1", label: "Home", href: "/" },
    { id: "2", label: "About", href: "/about" },
    { id: "3", label: "Contact", href: "/contact" }
  ],
  direction: rawDirection = "row",
  gap: rawGap = 20,
  color: rawColor = "#374151",
  hoverColor: rawHoverColor = "#2563eb",
  fontSize: rawFontSize = 14,
  fontWeight: rawFontWeight = "500",
  justifyContent: rawJustifyContent = "flex-start",
  width: rawWidth = "100%",
  padding: rawPadding = "10px 0",
}: NavigationProps) => {
  const { id, connectors: { connect, drag }, isSelected } = useNode((state) => ({
    id: state.id,
    isSelected: state.events.selected,
  }));
  const { mode } = useDeviceMode();

  const direction = resolveResponsiveProp(rawDirection, mode);
  const gap = resolveResponsiveProp(rawGap, mode);
  const color = resolveResponsiveProp(rawColor, mode);
  const hoverColor = resolveResponsiveProp(rawHoverColor, mode);
  const fontSize = resolveResponsiveProp(rawFontSize, mode);
  const fontWeight = resolveResponsiveProp(rawFontWeight, mode);
  const justifyContent = resolveResponsiveProp(rawJustifyContent, mode);
  const width = resolveResponsiveProp(rawWidth, mode);
  const padding = resolveResponsiveProp(rawPadding, mode);

  return (
    <>
      <style>{`
        [data-node-id="${id}"] a {
          color: ${color} !important;
          transition: color 0.2s ease;
          text-decoration: none;
        }
        [data-node-id="${id}"] a:hover {
          color: ${hoverColor} !important;
        }
      `}</style>
      <nav
        data-node-id={id}
        ref={(ref) => { connect(drag(ref as HTMLElement)); }}
        style={{
          display: "flex",
          flexDirection: direction as "row" | "column",
          gap: `${gap}px`,
          justifyContent: justifyContent as string,
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight as string,
          width: width as string,
          padding: typeof padding === "number" ? `${padding}px` : padding,
          outline: isSelected ? "2px solid #0066FF" : "none",
          outlineOffset: "2px",
          fontFamily: "Inter, sans-serif"
        }}
      >
        {links.map((link) => (
          <a 
            key={link.id} 
            href={link.href}
            onClick={(e) => e.preventDefault()} // Prevent navigation in builder
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
};

Navigation.craft = {
  displayName: "Navigation",
  props: { 
    links: [
      { id: "1", label: "Home", href: "/" },
      { id: "2", label: "About", href: "/about" },
      { id: "3", label: "Contact", href: "/contact" }
    ],
    direction: "row",
    gap: 24,
    color: "#374151",
    hoverColor: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
    justifyContent: "flex-end",
    width: "100%",
    padding: "16px 20px"
  },
  related: { settings: NavigationSettings },
};

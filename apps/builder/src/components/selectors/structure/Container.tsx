"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface ContainerProps {
  background?: string;
  padding?: number;
  borderRadius?: number;
  parallax?: boolean;
  children?: React.ReactNode;
}

export const ContainerSettings = () => {
  const { actions: { setProp }, background, padding, borderRadius, parallax } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    parallax: node.data.props.parallax,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Background</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Fill</div>
          <input type="color" value={background || "#ffffff"} onChange={(e) => setProp((p: ContainerProps) => { p.background = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
        <label className="flex items-center justify-between text-[11px] font-semibold text-gray-500 uppercase tracking-wide cursor-pointer mt-1">
          Parallax Background
          <input type="checkbox" checked={parallax || false} onChange={(e) => setProp((p: ContainerProps) => { p.parallax = e.target.checked; })} className="accent-black" />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">P</span>
            <input type="number" value={padding || 0} onChange={(e) => setProp((p: ContainerProps) => { p.padding = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">R</span>
            <input type="number" value={borderRadius || 0} onChange={(e) => setProp((p: ContainerProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Container = ({ background = "transparent", padding = 0, borderRadius = 0, parallax = false, children }: ContainerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        background, 
        padding: `${padding}px`, 
        borderRadius: `${borderRadius}px`, 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px", 
        minHeight: "40px", 
        transition: "outline 0.15s",
        backgroundAttachment: parallax ? "fixed" : "scroll",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
      className={`relative w-full ${!background || background === "transparent" ? "border border-dashed border-[#E5E5E5]" : ""} ${parallax ? 'bg-fixed' : ''}`}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: { background: "transparent", padding: 20, borderRadius: 0, parallax: false },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};

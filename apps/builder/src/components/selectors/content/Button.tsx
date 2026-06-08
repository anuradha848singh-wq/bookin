"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface ButtonProps {
  text?: string;
  background?: string;
  color?: string;
  borderRadius?: number;
  fontSize?: number;
  paddingX?: number;
  paddingY?: number;
}

export const ButtonSettings = () => {
  const { actions: { setProp }, text, background, color, borderRadius, fontSize, paddingX, paddingY } = useNode((node) => ({
    text: node.data.props.text,
    background: node.data.props.background,
    color: node.data.props.color,
    borderRadius: node.data.props.borderRadius,
    fontSize: node.data.props.fontSize,
    paddingX: node.data.props.paddingX,
    paddingY: node.data.props.paddingY,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Label</label>
        <input type="text" value={text} onChange={(e) => setProp((p: ButtonProps) => { p.text = e.target.value; })} className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[11px] focus:outline-none focus:border-[#0066FF] transition-colors" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Appearance</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
            <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Fill</div>
            <input type="color" value={background || "#000000"} onChange={(e) => setProp((p: ButtonProps) => { p.background = e.target.value; })} className="w-full h-6 cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden">
            <div className="px-2 text-[10px] text-gray-400 border-r border-[#E5E5E5]">Text</div>
            <input type="color" value={color || "#ffffff"} onChange={(e) => setProp((p: ButtonProps) => { p.color = e.target.value; })} className="w-full h-6 cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Spacing & Radius</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden px-2">
            <span className="text-[10px] text-gray-400 w-4">R</span>
            <input type="number" value={borderRadius || 0} onChange={(e) => setProp((p: ButtonProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full py-1 text-[11px] bg-transparent focus:outline-none" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded overflow-hidden px-2">
            <span className="text-[10px] text-gray-400 w-4">T</span>
            <input type="number" value={fontSize || 14} onChange={(e) => setProp((p: ButtonProps) => { p.fontSize = parseInt(e.target.value) || 14; })} className="w-full py-1 text-[11px] bg-transparent focus:outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Button = ({ text = "Click Me", background = "#000000", color = "#ffffff", borderRadius = 4, fontSize = 14, paddingX = 16, paddingY = 8 }: ButtonProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <button
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ background, color, borderRadius: `${borderRadius}px`, fontSize: `${fontSize}px`, padding: `${paddingY}px ${paddingX}px`, border: "none", cursor: "pointer", fontWeight: 500, display: "inline-block", outline: isSelected ? "2px solid #0066FF" : "none", outlineOffset: "1px", transition: "all 0.15s" }}
    >
      {text}
    </button>
  );
};

Button.craft = {
  displayName: "Button",
  props: { text: "Click Me", background: "#000000", color: "#ffffff", borderRadius: 4, fontSize: 13, paddingX: 16, paddingY: 8 },
  related: { settings: ButtonSettings },
};

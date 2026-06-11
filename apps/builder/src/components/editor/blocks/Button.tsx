"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";

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
  const { actions: { setProp }, background, color, borderRadius, fontSize, paddingX, paddingY } = useNode((node) => ({
    background: node.data.props.background,
    color: node.data.props.color,
    borderRadius: node.data.props.borderRadius,
    fontSize: node.data.props.fontSize,
    paddingX: node.data.props.paddingX,
    paddingY: node.data.props.paddingY,
  }));

  return (
    <div className="flex flex-col gap-5 text-slate-200">
      {/* Appearance (Colors) */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Appearance</label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Background Fill */}
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9 px-2 gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Fill</span>
            <div className="relative flex items-center w-full h-6 rounded border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer">
              <input 
                type="color" 
                value={background || "#000000"} 
                onChange={(e) => setProp((p: ButtonProps) => { p.background = e.target.value; })} 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
              />
              <div 
                className="w-4 h-4 rounded-full border border-slate-700/50 shadow-sm ml-1 shrink-0" 
                style={{ backgroundColor: background || "#000000" }} 
              />
              <span className="text-[9px] text-slate-400 font-mono font-bold truncate ml-1">{background || "#000000"}</span>
            </div>
          </div>
          
          {/* Text Color */}
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9 px-2 gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Text</span>
            <div className="relative flex items-center w-full h-6 rounded border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer">
              <input 
                type="color" 
                value={color || "#ffffff"} 
                onChange={(e) => setProp((p: ButtonProps) => { p.color = e.target.value; })} 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
              />
              <div 
                className="w-4 h-4 rounded-full border border-slate-700/50 shadow-sm ml-1 shrink-0" 
                style={{ backgroundColor: color || "#ffffff" }} 
              />
              <span className="text-[9px] text-slate-400 font-mono font-bold truncate ml-1">{color || "#ffffff"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Radius & Size */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Radius & Typography</label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Border Radius */}
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9">
            <span className="px-2.5 text-[10px] font-bold text-slate-500 border-r border-slate-800 h-full flex items-center justify-center bg-slate-900/60 uppercase shrink-0">Radius</span>
            <input 
              type="number" 
              value={borderRadius || 0} 
              onChange={(e) => setProp((p: ButtonProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className="w-full py-1 px-2 text-[11px] bg-transparent focus:outline-none font-semibold text-slate-200" 
            />
          </div>
          
          {/* Font Size */}
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9">
            <span className="px-2.5 text-[10px] font-bold text-slate-500 border-r border-slate-800 h-full flex items-center justify-center bg-slate-900/60 uppercase shrink-0">Size</span>
            <input 
              type="number" 
              value={fontSize || 14} 
              onChange={(e) => setProp((p: ButtonProps) => { p.fontSize = parseInt(e.target.value) || 14; })} 
              className="w-full py-1 px-2 text-[11px] bg-transparent focus:outline-none font-semibold text-slate-200" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Button = ({ text = "Click Me", background = "#000000", color = "#ffffff", borderRadius = 4, fontSize = 14, paddingX = 16, paddingY = 8 }: ButtonProps) => {
  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  
  const [editable, setEditable] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSelected) {
      setEditable(false);
    }
  }, [isSelected]);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      onClick={() => { if (isSelected) setEditable(true); }}
      style={{ 
        background, 
        color, 
        borderRadius: `${borderRadius}px`, 
        fontSize: `${fontSize}px`, 
        padding: `${paddingY}px ${paddingX}px`, 
        cursor: editable ? "text" : "pointer", 
        fontWeight: 500, 
        display: "inline-block", 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "1px", 
        transition: editable ? "none" : "all 0.15s" 
      }}
    >
      <div
        ref={textRef}
        contentEditable={enabled && editable}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          setEditable(false);
          const currentText = e.currentTarget.innerText;
          setProp((p: ButtonProps) => { p.text = currentText; }, 500);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        style={{ outline: "none", minWidth: "10px", display: "inline-block" }}
      >
        {text}
      </div>
    </div>
  );
};

Button.craft = {
  displayName: "Button",
  props: { text: "Click Me", background: "#000000", color: "#ffffff", borderRadius: 4, fontSize: 13, paddingX: 16, paddingY: 8 },
  related: { settings: ButtonSettings },
};

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface TextProps {
  text?: string;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  fontWeight?: string;
  color?: string;
}

export const TextSettings = () => {
  const { actions: { setProp }, fontSize, textAlign, fontWeight, color } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
  }));

  return (
    <div className="flex flex-col gap-5 text-slate-200">
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typography</label>
        
        {/* Weight Selector */}
        <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9">
          <div className="px-3 text-[10px] font-bold text-slate-500 border-r border-slate-800 h-full flex items-center bg-slate-900/60 uppercase">Weight</div>
          <select 
            value={fontWeight || "400"} 
            onChange={(e) => setProp((p: TextProps) => { p.fontWeight = e.target.value; })}
            className="w-full h-full px-3 text-[11px] bg-transparent focus:outline-none appearance-none font-semibold text-slate-200 cursor-pointer"
            style={{ backgroundImage: "none" }}
          >
            <option value="400" className="bg-slate-900 text-slate-200">Regular</option>
            <option value="500" className="bg-slate-900 text-slate-200">Medium</option>
            <option value="600" className="bg-slate-900 text-slate-200">Semibold</option>
            <option value="700" className="bg-slate-900 text-slate-200">Bold</option>
          </select>
        </div>

        {/* Font Size & Fill */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9">
            <span className="px-3 text-[10px] font-bold text-slate-500 border-r border-slate-800 h-full flex items-center bg-slate-900/60 uppercase">Size</span>
            <input 
              type="number" 
              value={fontSize || 16} 
              onChange={(e) => setProp((p: TextProps) => { p.fontSize = parseInt(e.target.value) || 16; })} 
              className="w-full h-full px-2 text-[11px] bg-transparent focus:outline-none font-semibold text-slate-200" 
            />
          </div>
          
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9 px-2 gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Color</span>
            <div className="relative flex items-center w-full h-6 rounded border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer">
              <input 
                type="color" 
                value={color || "#111827"} 
                onChange={(e) => setProp((p: TextProps) => { p.color = e.target.value; })} 
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
              />
              <div 
                className="w-4 h-4 rounded-full border border-slate-700/50 shadow-sm ml-1 shrink-0" 
                style={{ backgroundColor: color || "#111827" }} 
              />
              <span className="text-[10px] text-slate-400 font-mono font-bold truncate ml-1">{color || "#111827"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alignment */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alignment</label>
        <div className="flex border border-slate-800 bg-slate-950 p-1 gap-1 rounded-xl">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setProp((p: TextProps) => { p.textAlign = a; })}
              className={`flex-1 h-8 flex justify-center items-center rounded-lg text-slate-400 hover:text-slate-200 transition-all border ${textAlign === a ? "bg-slate-800 border-slate-700/60 text-blue-400 shadow-sm shadow-black/10" : "border-transparent"}`}
            >
              {a === "left" && <AlignLeft size={14} />}
              {a === "center" && <AlignCenter size={14} />}
              {a === "right" && <AlignRight size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Text = ({ text = "New Text", fontSize = 16, textAlign = "left", fontWeight = "400", color = "#111827" }: TextProps) => {
  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  
  const [editable, setEditable] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      return;
    }
    setEditable(false);
  }, [isSelected]);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      onClick={() => { if (isSelected) setEditable(true); }}
      style={{ 
        fontSize: `${fontSize}px`, 
        textAlign, 
        fontWeight, 
        color, 
        padding: "4px", 
        borderRadius: "2px", 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "1px",
        cursor: editable ? "text" : "pointer" 
      }}
    >
      <div
        ref={textRef}
        contentEditable={enabled && editable}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          setEditable(false);
          const currentText = e.currentTarget.innerText;
          setProp((p: TextProps) => { p.text = currentText; }, 500);
        }}
        onKeyDown={(e) => {
          // Blur on Enter to save
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        style={{ outline: "none", minWidth: "10px" }}
      >
        {text}
      </div>
    </div>
  );
};

Text.craft = {
  displayName: "Text",
  props: { text: "New Text", fontSize: 16, textAlign: "left", fontWeight: "400", color: "#111827" },
  related: { settings: TextSettings },
};

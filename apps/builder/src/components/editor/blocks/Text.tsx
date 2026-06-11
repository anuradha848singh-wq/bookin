"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNode, useEditor } from "@craftjs/core";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";
import { useCMS } from "../CMSContext";
import { useDeviceMode, resolveResponsiveProp, updateResponsiveProp, ResponsiveValue } from "../DeviceModeContext";

interface TextProps {
  text?: string;
  fontSize?: ResponsiveValue<number>;
  textAlign?: ResponsiveValue<"left" | "center" | "right">;
  fontWeight?: ResponsiveValue<string>;
  color?: ResponsiveValue<string>;
  position?: string;
  x?: number;
  y?: number;
  width?: string | number;
  height?: string | number;
  fontFamily?: string;
  hiddenBreakpoints?: { desktop: boolean, tablet: boolean, mobile: boolean };
  bindings?: Record<string, string>;
}

export const TextSettings = () => {
  const { mode } = useDeviceMode();
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as TextProps,
  }));

  const fontSize = resolveResponsiveProp(props.fontSize, mode);
  const textAlign = resolveResponsiveProp(props.textAlign, mode);
  const fontWeight = resolveResponsiveProp(props.fontWeight, mode);
  const color = resolveResponsiveProp(props.color, mode);

  return (
    <div className="flex flex-col gap-5 text-slate-200">
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typography</label>
        
        {/* Weight Selector */}
        <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9">
          <div className="px-3 text-[10px] font-bold text-slate-500 border-r border-slate-800 h-full flex items-center bg-slate-900/60 uppercase">Weight</div>
          <select 
            value={fontWeight || "400"} 
            onChange={(e) => setProp((p: TextProps) => { p.fontWeight = updateResponsiveProp(p.fontWeight, e.target.value, mode); })}
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
              onChange={(e) => setProp((p: TextProps) => { p.fontSize = updateResponsiveProp(p.fontSize, parseInt(e.target.value) || 16, mode); }, 500)} 
              className="w-full h-full px-2 text-[11px] bg-transparent focus:outline-none font-semibold text-slate-200" 
            />
          </div>
          
          <div className="flex items-center border border-slate-800 bg-slate-950 rounded-lg overflow-hidden h-9 px-2 gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Color</span>
            <div className="relative flex items-center w-full h-6 rounded border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer">
              <input 
                type="color" 
                value={color || "#111827"} 
                onChange={(e) => setProp((p: TextProps) => { p.color = updateResponsiveProp(p.color, e.target.value, mode); })} 
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
              onClick={() => setProp((p: TextProps) => { p.textAlign = updateResponsiveProp(p.textAlign, a, mode); })}
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

export const Text = ({ 
  text = "New Text", 
  fontSize: rawFontSize = 16, 
  textAlign: rawTextAlign = "left", 
  fontWeight: rawFontWeight = "400", 
  color: rawColor = "#111827",
  position = "relative",
  x = 0,
  y = 0,
  width = "100%",
  height = "100%",
  fontFamily = "Inter, sans-serif",
  hiddenBreakpoints = { desktop: false, tablet: false, mobile: false },
  bindings
}: TextProps) => {
  const { resolvePath } = useCMS();
  const displayText = bindings?.text ? (resolvePath(bindings.text) || text) : text;

  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const { mode } = useDeviceMode();
  
  const fontSize = resolveResponsiveProp(rawFontSize, mode);
  const textAlign = resolveResponsiveProp(rawTextAlign, mode);
  const fontWeight = resolveResponsiveProp(rawFontWeight, mode);
  const color = resolveResponsiveProp(rawColor, mode);

  const [editable, setEditable] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected) {
      return;
    }
    setEditable(false);
  }, [isSelected]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (textRef.current) {
      // Force an update to the craft node immediately so we don't lose formatting on blur unexpectedly
      setProp((p: TextProps) => { p.text = textRef.current?.innerHTML; }, 500);
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      onClick={() => { if (isSelected) setEditable(true); }}
      style={{ 
        fontSize: `${fontSize}px`, 
        fontFamily,
        textAlign, 
        fontWeight, 
        color, 
        padding: "4px", 
        borderRadius: "2px", 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "1px",
        cursor: editable ? "text" : "pointer",
        width: position === "absolute" ? "100%" : width,
        height: position === "absolute" ? "100%" : height,
        minWidth: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: position === "absolute" ? "absolute" : "relative",
      }}
    >
      {editable && (
        <div 
          className="absolute -top-12 left-0 bg-slate-900 border border-slate-700 shadow-xl rounded-lg flex items-center p-1 gap-1 z-50"
          style={{ width: "max-content" }}
          onMouseDown={(e) => e.preventDefault()} // Keep focus on the text editor
        >
          <button onClick={() => handleFormat('bold')} className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors">
            <Bold size={14} />
          </button>
          <button onClick={() => handleFormat('italic')} className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors">
            <Italic size={14} />
          </button>
          <button onClick={() => handleFormat('underline')} className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors">
            <Underline size={14} />
          </button>
          <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
          <div className="relative flex items-center justify-center w-6 h-6 rounded overflow-hidden cursor-pointer hover:bg-slate-800">
            <input 
              type="color" 
              onChange={(e) => handleFormat('foreColor', e.target.value)} 
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
            />
            <div className="w-3 h-3 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: color as string }} />
          </div>
        </div>
      )}
      <div
        ref={textRef}
        contentEditable={enabled && editable}
        suppressContentEditableWarning={true}
        onBlur={(e) => {
          setEditable(false);
          const currentHTML = e.currentTarget.innerHTML;
          setProp((p: TextProps) => { p.text = currentHTML; }, 500);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        style={{ outline: "none", width: "100%" }}
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
    </div>
  );
};

Text.craft = {
  displayName: "Text",
  props: { 
    text: "New Text", 
    fontSize: 16, 
    textAlign: "left", 
    fontWeight: "400", 
    color: "#111827",
    position: "relative",
    x: 0,
    y: 0,
    width: "auto",
    height: "auto",
    fontFamily: "Inter, sans-serif",
    hiddenBreakpoints: { desktop: false, tablet: false, mobile: false }
  },
  related: { settings: TextSettings },
};

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface TextProps {
  text?: string;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  fontWeight?: string;
  color?: string;
}

export const TextSettings = () => {
  const { actions: { setProp }, text, fontSize, textAlign, fontWeight, color } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Content</label>
        <textarea 
          value={text} 
          onChange={(e) => setProp((p: TextProps) => { p.text = e.target.value; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Typography</label>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">W</div>
          <select 
            value={fontWeight || "400"} 
            onChange={(e) => setProp((p: TextProps) => { p.fontWeight = e.target.value; })}
            className="w-full h-full px-3 text-[12px] bg-transparent focus:outline-none appearance-none font-medium text-gray-700 cursor-pointer"
          >
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">S</span>
            <input type="number" value={fontSize || 16} onChange={(e) => setProp((p: TextProps) => { p.fontSize = parseInt(e.target.value) || 16; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
          
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Fill</div>
            <input type="color" value={color || "#111827"} onChange={(e) => setProp((p: TextProps) => { p.color = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Alignment</label>
        <div className="flex border border-[#E5E5E5] bg-[#FAFAFA] rounded-md p-1 gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setProp((p: TextProps) => { p.textAlign = a; })}
              className={`flex-1 h-8 flex justify-center items-center rounded text-gray-500 hover:text-gray-900 transition-all ${textAlign === a ? "bg-white shadow-sm border border-[#E5E5E5] text-[#0066FF]" : "border border-transparent"}`}
            >
              {a === "left" && <AlignLeft size={16} />}
              {a === "center" && <AlignCenter size={16} />}
              {a === "right" && <AlignRight size={16} />}
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
  
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      const newText = textRef.current.textContent || "New Text";
      setProp((props: TextProps) => {
        props.text = newText;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textRef.current?.blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      if (textRef.current) {
        textRef.current.textContent = text || "New Text";
      }
    }
  };

  return (
    <div
      ref={(ref) => { 
        if (!isEditing) {
          connect(drag(ref as HTMLElement)); 
        }
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{ 
        fontSize: `${fontSize}px`, 
        textAlign, 
        fontWeight, 
        color, 
        cursor: isEditing ? "text" : "move", 
        padding: "4px", 
        borderRadius: "2px", 
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "1px",
        minHeight: "1em",
        userSelect: isEditing ? "text" : "none"
      }}
    >
      {text}
    </div>
  );
};

Text.craft = {
  displayName: "Text",
  props: { text: "New Text", fontSize: 16, textAlign: "left", fontWeight: "400", color: "#111827" },
  related: { settings: TextSettings },
};

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

interface HeadingProps {
  text?: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: string;
  textAlign?: "left" | "center" | "right";
}

export const HeadingSettings = () => {
  const { actions: { setProp }, text, level, color, textAlign } = useNode((node) => ({
    text: node.data.props.text,
    level: node.data.props.level,
    color: node.data.props.color,
    textAlign: node.data.props.textAlign,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Content</label>
        <textarea 
          value={text} 
          onChange={(e) => setProp((p: HeadingProps) => { p.text = e.target.value; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Heading Level</label>
        <select 
          value={level} 
          onChange={(e) => setProp((p: HeadingProps) => { p.level = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="h1">H1 - Main Title</option>
          <option value="h2">H2 - Section Title</option>
          <option value="h3">H3 - Subsection</option>
          <option value="h4">H4 - Minor Heading</option>
          <option value="h5">H5 - Small Heading</option>
          <option value="h6">H6 - Tiny Heading</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Color</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setProp((p: HeadingProps) => { p.color = e.target.value; })}
          className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Alignment</label>
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() => setProp((p: HeadingProps) => { p.textAlign = align; })}
              className={`flex-1 py-2 text-[11px] font-medium rounded transition-colors ${textAlign === align ? "bg-[#0066FF] text-white" : "bg-[#FAFAFA] text-gray-700 hover:bg-gray-200"}`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Heading = ({ text = "Heading", level = "h2", color = "#111827", textAlign = "left" }: HeadingProps) => {
  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const fontSizes = {
    h1: 48,
    h2: 36,
    h3: 28,
    h4: 24,
    h5: 20,
    h6: 16,
  };

  useEffect(() => {
    if (isEditing && headingRef.current) {
      headingRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(headingRef.current);
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
    if (headingRef.current) {
      const newText = headingRef.current.textContent || "Heading";
      setProp((props: HeadingProps) => {
        props.text = newText;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      headingRef.current?.blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      if (headingRef.current) {
        headingRef.current.textContent = text || "Heading";
      }
    }
  };

  const Tag = level;

  return (
    <Tag
      ref={(ref) => {
        if (!isEditing && ref) {
          connect(drag(ref as HTMLElement));
        }
        headingRef.current = ref;
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        fontSize: `${fontSizes[level]}px`,
        fontWeight: "700",
        color,
        textAlign,
        cursor: isEditing ? "text" : "move",
        padding: "8px 4px",
        margin: 0,
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        userSelect: isEditing ? "text" : "none",
      }}
    >
      {text}
    </Tag>
  );
};

Heading.craft = {
  displayName: "Heading",
  props: { text: "Heading", level: "h2", color: "#111827", textAlign: "left" },
  related: { settings: HeadingSettings },
};

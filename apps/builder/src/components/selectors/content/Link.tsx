"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { ExternalLink } from "lucide-react";

interface LinkProps {
  text?: string;
  href?: string;
  target?: "_self" | "_blank";
  color?: string;
  fontSize?: number;
  underline?: boolean;
}

export const LinkSettings = () => {
  const { actions: { setProp }, text, href, target, color, fontSize, underline } = useNode((node) => ({
    text: node.data.props.text,
    href: node.data.props.href,
    target: node.data.props.target,
    color: node.data.props.color,
    fontSize: node.data.props.fontSize,
    underline: node.data.props.underline,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Link Text</label>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setProp((p: LinkProps) => { p.text = e.target.value; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">URL</label>
        <input 
          type="url" 
          value={href} 
          onChange={(e) => setProp((p: LinkProps) => { p.href = e.target.value; })}
          placeholder="https://example.com"
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Open In</label>
        <select 
          value={target} 
          onChange={(e) => setProp((p: LinkProps) => { p.target = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="_self">Same Tab</option>
          <option value="_blank">New Tab</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-gray-500">Color</span>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setProp((p: LinkProps) => { p.color = e.target.value; })}
              className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-gray-500">Size</span>
            <input 
              type="number" 
              value={fontSize} 
              onChange={(e) => setProp((p: LinkProps) => { p.fontSize = parseInt(e.target.value) || 16; })}
              className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-700">Underline</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={underline}
            onChange={(e) => setProp((p: LinkProps) => { p.underline = e.target.checked; })}
            className="sr-only peer" 
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
        </label>
      </div>
    </div>
  );
};

export const Link = ({ 
  text = "Click here", 
  href = "#", 
  target = "_self", 
  color = "#0066FF", 
  fontSize = 16,
  underline = true 
}: LinkProps) => {
  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isEditing && linkRef.current) {
      linkRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(linkRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (linkRef.current) {
      const newText = linkRef.current.textContent || "Click here";
      setProp((props: LinkProps) => {
        props.text = newText;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      linkRef.current?.blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      if (linkRef.current) {
        linkRef.current.textContent = text || "Click here";
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.preventDefault(); // Prevent navigation in editor
    }
  };

  return (
    <a
      ref={(ref) => {
        if (!isEditing && ref) {
          connect(drag(ref as HTMLElement));
        }
        linkRef.current = ref;
      }}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      style={{
        color,
        fontSize: `${fontSize}px`,
        textDecoration: underline ? "underline" : "none",
        cursor: isEditing ? "text" : "pointer",
        padding: "4px",
        display: "inline-block",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        userSelect: isEditing ? "text" : "none",
      }}
    >
      {text}
      {target === "_blank" && !isEditing && (
        <ExternalLink size={12} className="inline ml-1" style={{ verticalAlign: "middle" }} />
      )}
    </a>
  );
};

Link.craft = {
  displayName: "Link",
  props: { text: "Click here", href: "#", target: "_self", color: "#0066FF", fontSize: 16, underline: true },
  related: { settings: LinkSettings },
};

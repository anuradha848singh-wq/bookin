"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";
import { HelpCircle, AlertCircle, CheckCircle, Info, MoreVertical, MoreHorizontal } from "lucide-react";

interface PopoverProps {
  triggerType?: "button" | "text" | "info" | "more-v" | "more-h";
  triggerText?: string;
  triggerColor?: string;
  triggerBgColor?: string;
  popoverWidth?: number;
  popoverBgColor?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export const PopoverSettings = () => {
  const { actions: { setProp }, triggerType, triggerText, triggerColor, triggerBgColor, popoverWidth, popoverBgColor, position } = useNode((node) => ({
    triggerType: node.data.props.triggerType,
    triggerText: node.data.props.triggerText,
    triggerColor: node.data.props.triggerColor,
    triggerBgColor: node.data.props.triggerBgColor,
    popoverWidth: node.data.props.popoverWidth,
    popoverBgColor: node.data.props.popoverBgColor,
    position: node.data.props.position,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Trigger Element</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={triggerType || "button"} 
            onChange={(e) => setProp((p: PopoverProps) => { p.triggerType = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="button">Solid Button</option>
            <option value="text">Text Link</option>
            <option value="info">Info Icon</option>
            <option value="more-v">Vertical Dots</option>
            <option value="more-h">Horizontal Dots</option>
          </select>
        </div>
        
        {(triggerType === "button" || triggerType === "text") && (
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 mt-1">
            <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px]">Text</span>
            <input 
              type="text" 
              value={triggerText || ""} 
              onChange={(e) => setProp((p: PopoverProps) => { p.triggerText = e.target.value; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Trigger Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={triggerColor || "#111827"} onChange={(e) => setProp((p: PopoverProps) => { p.triggerColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          {triggerType === "button" && (
            <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
              <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
              <input type="color" value={triggerBgColor || "#f3f4f6"} onChange={(e) => setProp((p: PopoverProps) => { p.triggerBgColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Popover Settings</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={position || "bottom"} 
            onChange={(e) => setProp((p: PopoverProps) => { p.position = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">W (px)</div>
            <input 
              type="number" 
              value={popoverWidth || 250} 
              onChange={(e) => setProp((p: PopoverProps) => { p.popoverWidth = parseInt(e.target.value) || 250; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={popoverBgColor || "#ffffff"} onChange={(e) => setProp((p: PopoverProps) => { p.popoverBgColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Popover = ({ 
  triggerType = "button",
  triggerText = "Click Me",
  triggerColor = "#111827",
  triggerBgColor = "#f3f4f6",
  popoverWidth = 250,
  popoverBgColor = "#ffffff",
  position = "bottom"
}: PopoverProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && !isSelected) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelected]);

  const getPositionClasses = () => {
    switch(position) {
      case "left": return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right": return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "top": return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
      default: return "top-full left-1/2 -translate-x-1/2 mt-2";
    }
  };

  const renderTrigger = () => {
    const iconProps = { size: 18, style: { color: triggerColor } };
    
    switch(triggerType) {
      case "text": return <span style={{ color: triggerColor, textDecoration: "underline", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>{triggerText}</span>;
      case "info": return <Info {...iconProps} />;
      case "more-v": return <MoreVertical {...iconProps} />;
      case "more-h": return <MoreHorizontal {...iconProps} />;
      case "button": 
      default: 
        return (
          <div 
            style={{ backgroundColor: triggerBgColor, color: triggerColor }}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:brightness-95 cursor-pointer"
          >
            {triggerText}
          </div>
        );
    }
  };

  return (
    <div
      ref={(ref) => { 
        containerRef.current = ref as HTMLDivElement;
        connect(drag(ref as HTMLElement)); 
      }}
      className="relative inline-flex items-center justify-center"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {renderTrigger()}
      </div>

      {/* Popover Content (Editable Canvas) */}
      <div 
        className={`absolute z-50 rounded-lg shadow-xl border border-black/5 transition-all duration-200 origin-center ${getPositionClasses()} ${isOpen || isSelected ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ backgroundColor: popoverBgColor, width: `${popoverWidth}px` }}
      >
        <div className="p-4 w-full h-full min-h-[100px]">
          <Element id="popover-content" is={Container} canvas padding={0} background="transparent" />
        </div>
      </div>
    </div>
  );
};

Popover.craft = {
  displayName: "Popover",
  props: { 
    triggerType: "button",
    triggerText: "Click Me",
    triggerColor: "#111827",
    triggerBgColor: "#f3f4f6",
    popoverWidth: 250,
    popoverBgColor: "#ffffff",
    position: "bottom"
  },
  rules: { canDrag: () => true },
  related: { settings: PopoverSettings },
};

"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Info, HelpCircle, AlertCircle, CheckCircle } from "lucide-react";

interface TooltipProps {
  content?: string;
  triggerText?: string;
  triggerType?: "text" | "info" | "help" | "alert" | "check";
  position?: "top" | "bottom" | "left" | "right";
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

export const TooltipSettings = () => {
  const { actions: { setProp }, content, triggerText, triggerType, position, backgroundColor, textColor, iconColor } = useNode((node) => ({
    content: node.data.props.content,
    triggerText: node.data.props.triggerText,
    triggerType: node.data.props.triggerType,
    position: node.data.props.position,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    iconColor: node.data.props.iconColor,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tooltip Content</label>
        <textarea 
          value={content || ""} 
          onChange={(e) => setProp((p: TooltipProps) => { p.content = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[60px]" 
          placeholder="Tooltip text here..."
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Trigger Element</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={triggerType || "info"} 
            onChange={(e) => setProp((p: TooltipProps) => { p.triggerType = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="text">Text Link</option>
            <option value="info">Info Icon</option>
            <option value="help">Help Icon</option>
            <option value="alert">Alert Icon</option>
            <option value="check">Check Icon</option>
          </select>
        </div>
        
        {triggerType === "text" && (
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 mt-1">
            <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px]">Text</span>
            <input 
              type="text" 
              value={triggerText || ""} 
              onChange={(e) => setProp((p: TooltipProps) => { p.triggerText = e.target.value; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Positioning</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={position || "top"} 
            onChange={(e) => setProp((p: TooltipProps) => { p.position = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Popup BG</div>
            <input type="color" value={backgroundColor || "#111827"} onChange={(e) => setProp((p: TooltipProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#ffffff"} onChange={(e) => setProp((p: TooltipProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[80px]">Icon/Link</div>
          <input type="color" value={iconColor || "#9ca3af"} onChange={(e) => setProp((p: TooltipProps) => { p.iconColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
      </div>
    </div>
  );
};

export const Tooltip = ({ 
  content = "Tooltip information goes here.",
  triggerText = "Hover me",
  triggerType = "info",
  position = "top",
  backgroundColor = "#111827",
  textColor = "#ffffff",
  iconColor = "#9ca3af"
}: TooltipProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch(position) {
      case "bottom": return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left": return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right": return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "top":
      default: return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  const renderTrigger = () => {
    const props = { size: 16, style: { color: iconColor }, className: "cursor-help" };
    switch(triggerType) {
      case "help": return <HelpCircle {...props} />;
      case "alert": return <AlertCircle {...props} />;
      case "check": return <CheckCircle {...props} />;
      case "text": return <span style={{ color: iconColor, textDecoration: "underline", cursor: "help", fontSize: "14px" }}>{triggerText}</span>;
      case "info": 
      default: return <Info {...props} />;
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Trigger */}
      {renderTrigger()}

      {/* Tooltip Popup */}
      <div 
        className={`absolute z-50 whitespace-nowrap px-3 py-2 text-[12px] font-medium rounded-md shadow-lg pointer-events-none transition-all duration-200 ${getPositionClasses()} ${isVisible || isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{ backgroundColor, color: textColor }}
      >
        {content}
        
        {/* Triangle Arrow */}
        <div 
          className={`absolute w-2 h-2 rotate-45 ${
            position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
            position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
            'left-[-4px] top-1/2 -translate-y-1/2'
          }`}
          style={{ backgroundColor }}
        />
      </div>
    </div>
  );
};

Tooltip.craft = {
  displayName: "Tooltip",
  props: { 
    content: "Tooltip information goes here.",
    triggerText: "Hover me",
    triggerType: "info",
    position: "top",
    backgroundColor: "#111827",
    textColor: "#ffffff",
    iconColor: "#9ca3af"
  },
  rules: { canDrag: () => true },
  related: { settings: TooltipSettings },
};

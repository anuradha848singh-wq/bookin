"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Star, StarHalf } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  showText?: boolean;
  textColor?: string;
  align?: "left" | "center" | "right";
}

export const RatingStarsSettings = () => {
  const { actions: { setProp }, rating, maxRating, size, color, emptyColor, showText, textColor, align } = useNode((node) => ({
    rating: node.data.props.rating,
    maxRating: node.data.props.maxRating,
    size: node.data.props.size,
    color: node.data.props.color,
    emptyColor: node.data.props.emptyColor,
    showText: node.data.props.showText,
    textColor: node.data.props.textColor,
    align: node.data.props.align,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Rating Value</label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            step="0.5"
            min="0"
            max={maxRating || 5}
            value={rating || 5} 
            onChange={(e) => setProp((p: RatingStarsProps) => { p.rating = parseFloat(e.target.value) || 0; })} 
            className="w-1/2 px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          />
          <span className="text-sm font-medium text-gray-400">out of</span>
          <select 
            value={maxRating || 5} 
            onChange={(e) => setProp((p: RatingStarsProps) => { p.maxRating = parseInt(e.target.value) || 5; })} 
            className="w-1/3 px-2 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Appearance</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Size</div>
            <input 
              type="number" 
              value={size || 24} 
              onChange={(e) => setProp((p: RatingStarsProps) => { p.size = parseInt(e.target.value) || 24; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Align</div>
            <select 
              value={align || "left"} 
              onChange={(e) => setProp((p: RatingStarsProps) => { p.align = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Filled</div>
            <input type="color" value={color || "#FBBF24"} onChange={(e) => setProp((p: RatingStarsProps) => { p.color = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Empty</div>
            <input type="color" value={emptyColor || "#E5E7EB"} onChange={(e) => setProp((p: RatingStarsProps) => { p.emptyColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text Label</label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer mb-2">
          <input 
            type="checkbox" 
            checked={showText} 
            onChange={(e) => setProp((p: RatingStarsProps) => { p.showText = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Show rating text (e.g. "4.5 / 5")
        </label>
        {showText && (
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text Color</div>
            <input type="color" value={textColor || "#6B7280"} onChange={(e) => setProp((p: RatingStarsProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

export const RatingStars = ({ 
  rating = 4.5,
  maxRating = 5,
  size = 24,
  color = "#FBBF24",
  emptyColor = "#E5E7EB",
  showText = true,
  textColor = "#6B7280",
  align = "left"
}: RatingStarsProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const safeRating = Math.min(Math.max(0, rating), maxRating);
  
  const getAlignment = () => {
    switch(align) {
      case "center": return "justify-center";
      case "right": return "justify-end";
      case "left":
      default: return "justify-start";
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full flex items-center gap-2 py-2 ${getAlignment()}`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className="flex items-center relative">
        {/* Background Empty Stars */}
        <div className="flex" style={{ color: emptyColor }}>
          {[...Array(maxRating)].map((_, i) => (
            <svg key={`empty-${i}`} width={size} height={size} viewBox="0 0 24 24" className="fill-current">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        
        {/* Foreground Filled Stars Overlay */}
        <div 
          className="flex absolute top-0 left-0 overflow-hidden" 
          style={{ width: `${(safeRating / maxRating) * 100}%`, color }}
        >
          {[...Array(maxRating)].map((_, i) => (
            <svg key={`filled-${i}`} width={size} height={size} viewBox="0 0 24 24" className="fill-current shrink-0">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
      
      {showText && (
        <span 
          style={{ color: textColor, fontSize: `${Math.max(12, size * 0.6)}px` }} 
          className="font-medium ml-1 tabular-nums"
        >
          {safeRating} / {maxRating}
        </span>
      )}
    </div>
  );
};

RatingStars.craft = {
  displayName: "Rating Stars",
  props: { 
    rating: 4.5,
    maxRating: 5,
    size: 24,
    color: "#FBBF24",
    emptyColor: "#E5E7EB",
    showText: true,
    textColor: "#6B7280",
    align: "left"
  },
  rules: { canDrag: () => true },
  related: { settings: RatingStarsSettings },
};

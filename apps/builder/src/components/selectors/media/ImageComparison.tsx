"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import { MoveHorizontal } from "lucide-react";

interface ImageComparisonProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  sliderColor?: string;
  borderRadius?: number;
}

export const ImageComparisonSettings = () => {
  const { actions: { setProp }, beforeImage, afterImage, beforeLabel, afterLabel, sliderColor, borderRadius } = useNode((node) => ({
    beforeImage: node.data.props.beforeImage,
    afterImage: node.data.props.afterImage,
    beforeLabel: node.data.props.beforeLabel,
    afterLabel: node.data.props.afterLabel,
    sliderColor: node.data.props.sliderColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Before Image</label>
        <input 
          type="text" 
          value={beforeImage || ""} 
          onChange={(e) => setProp((p: ImageComparisonProps) => { p.beforeImage = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Before Image URL"
        />
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px]">Label</div>
          <input 
            type="text" 
            value={beforeLabel || "Before"} 
            onChange={(e) => setProp((p: ImageComparisonProps) => { p.beforeLabel = e.target.value; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">After Image</label>
        <input 
          type="text" 
          value={afterImage || ""} 
          onChange={(e) => setProp((p: ImageComparisonProps) => { p.afterImage = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="After Image URL"
        />
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px]">Label</div>
          <input 
            type="text" 
            value={afterLabel || "After"} 
            onChange={(e) => setProp((p: ImageComparisonProps) => { p.afterLabel = e.target.value; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Slider</div>
            <input type="color" value={sliderColor || "#ffffff"} onChange={(e) => setProp((p: ImageComparisonProps) => { p.sliderColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input 
              type="number" 
              value={borderRadius || 12} 
              onChange={(e) => setProp((p: ImageComparisonProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageComparison = ({ 
  beforeImage = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
  afterImage = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80&grayscale",
  beforeLabel = "Before",
  afterLabel = "After",
  sliderColor = "#ffffff",
  borderRadius = 12
}: ImageComparisonProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", () => setIsDragging(false));
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", () => setIsDragging(false));
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <div
      ref={(ref) => { 
        containerRef.current = ref as HTMLDivElement;
        connect(drag(ref as HTMLElement)); 
      }}
      className="relative w-full aspect-video select-none overflow-hidden bg-gray-100"
      style={{ 
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {/* Background (After) Image */}
      <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      
      {/* Foreground (Before) Image mapped by clip-path */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      </div>

      {/* Labels */}
      {beforeLabel && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow">
          {beforeLabel}
        </div>
      )}
      {afterLabel && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow">
          {afterLabel}
        </div>
      )}

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 cursor-col-resize z-10 hover:w-1.5 transition-all"
        style={{ left: `${sliderPosition}%`, backgroundColor: sliderColor, transform: 'translateX(-50%)' }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: sliderColor }}
        >
          <MoveHorizontal size={18} className="text-gray-800" />
        </div>
      </div>
    </div>
  );
};

ImageComparison.craft = {
  displayName: "Before/After Slider",
  props: { 
    beforeImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80&grayscale",
    beforeLabel: "Before",
    afterLabel: "After",
    sliderColor: "#ffffff",
    borderRadius: 12
  },
  rules: { canDrag: () => true },
  related: { settings: ImageComparisonSettings },
};

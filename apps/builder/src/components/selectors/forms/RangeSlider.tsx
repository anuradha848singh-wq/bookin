"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

interface RangeSliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  primaryColor?: string;
}

export const RangeSliderSettings = () => {
  const { actions: { setProp }, label, min, max, step, prefix, suffix, primaryColor } = useNode((node) => ({
    label: node.data.props.label,
    min: node.data.props.min,
    max: node.data.props.max,
    step: node.data.props.step,
    prefix: node.data.props.prefix,
    suffix: node.data.props.suffix,
    primaryColor: node.data.props.primaryColor,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Label & Display</label>
        <input type="text" value={label || ""} onChange={(e) => setProp((p: RangeSliderProps) => { p.label = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Label (e.g. Budget)" />
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={prefix || ""} onChange={(e) => setProp((p: RangeSliderProps) => { p.prefix = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none" placeholder="Prefix (e.g. $)" />
          <input type="text" value={suffix || ""} onChange={(e) => setProp((p: RangeSliderProps) => { p.suffix = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none" placeholder="Suffix (e.g. USD)" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Range</label>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500">Min</span>
            <input type="number" value={min !== undefined ? min : 0} onChange={(e) => setProp((p: RangeSliderProps) => { p.min = parseFloat(e.target.value) || 0; })} className="w-full px-2 py-1 text-[11px] bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500">Max</span>
            <input type="number" value={max !== undefined ? max : 100} onChange={(e) => setProp((p: RangeSliderProps) => { p.max = parseFloat(e.target.value) || 100; })} className="w-full px-2 py-1 text-[11px] bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500">Step</span>
            <input type="number" value={step !== undefined ? step : 1} onChange={(e) => setProp((p: RangeSliderProps) => { p.step = parseFloat(e.target.value) || 1; })} className="w-full px-2 py-1 text-[11px] bg-[#FAFAFA] border border-[#E5E5E5] rounded focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Accent Color</div>
          <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: RangeSliderProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
      </div>
    </div>
  );
};

export const RangeSlider = ({ 
  label = "Budget Range",
  min = 0,
  max = 1000,
  step = 50,
  prefix = "$",
  suffix = "",
  primaryColor = "#0066FF"
}: RangeSliderProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [value, setValue] = useState((min + max) / 2);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Ensure value stays within bounds if props change
  useEffect(() => {
    if (value < min) setValue(min);
    if (value > max) setValue(max);
  }, [min, max]);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValueFromMouse = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    let rawValue = percent * (max - min) + min;
    
    // Snap to step
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, steppedValue));
    setValue(finalValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) return;
    isDragging.current = true;
    updateValueFromMouse(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updateValueFromMouse(e.clientX);
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSelected) return;
    isDragging.current = true;
    updateValueFromMouse(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    updateValueFromMouse(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full relative flex flex-col gap-4 py-2"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      <div className="flex justify-between items-end">
        {label && <label className="block text-sm font-semibold text-gray-800">{label}</label>}
        <span className="text-xl font-bold" style={{ color: primaryColor }}>
          {prefix}{value.toLocaleString()}{suffix}
        </span>
      </div>

      <div 
        className="w-full h-8 flex items-center cursor-pointer relative"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={sliderRef}
      >
        {/* Track Background */}
        <div className="w-full h-2 bg-gray-200 rounded-full absolute" />
        
        {/* Track Fill */}
        <div 
          className="h-2 rounded-full absolute pointer-events-none" 
          style={{ width: `${percentage}%`, backgroundColor: primaryColor }} 
        />
        
        {/* Thumb */}
        <div 
          className="w-6 h-6 bg-white border-2 rounded-full absolute shadow-md transform -translate-x-1/2 pointer-events-none transition-transform"
          style={{ 
            left: `${percentage}%`, 
            borderColor: primaryColor,
            transform: isDragging.current ? 'translate(-50%, 0) scale(1.15)' : 'translate(-50%, 0)'
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
};

RangeSlider.craft = {
  displayName: "Range Slider",
  props: { 
    label: "Budget Range",
    min: 0,
    max: 1000,
    step: 50,
    prefix: "$",
    suffix: "",
    primaryColor: "#0066FF"
  },
  rules: { canDrag: () => true },
  related: { settings: RangeSliderSettings },
};

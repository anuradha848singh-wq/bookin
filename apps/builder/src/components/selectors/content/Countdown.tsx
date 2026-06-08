"use client";

import React, { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";

interface CountdownProps {
  targetDate?: string;
  textColor?: string;
  numberBgColor?: string;
  labelColor?: string;
  size?: "sm" | "md" | "lg";
}

export const CountdownSettings = () => {
  const { actions: { setProp }, targetDate, textColor, numberBgColor, labelColor, size } = useNode((node) => ({
    targetDate: node.data.props.targetDate,
    textColor: node.data.props.textColor,
    numberBgColor: node.data.props.numberBgColor,
    labelColor: node.data.props.labelColor,
    size: node.data.props.size,
  }));

  // Set default future date if not set
  useEffect(() => {
    if (!targetDate) {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setProp((p: CountdownProps) => { p.targetDate = d.toISOString().slice(0, 16); });
    }
  }, [targetDate, setProp]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Target Date & Time</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <input 
            type="datetime-local" 
            value={targetDate || ""} 
            onChange={(e) => setProp((p: CountdownProps) => { p.targetDate = e.target.value; })} 
            className="w-full h-full px-3 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Size</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={size || "md"} 
            onChange={(e) => setProp((p: CountdownProps) => { p.size = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Box BG</div>
            <input type="color" value={numberBgColor || "#f3f4f6"} onChange={(e) => setProp((p: CountdownProps) => { p.numberBgColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Numbers</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: CountdownProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Labels</div>
          <input type="color" value={labelColor || "#6b7280"} onChange={(e) => setProp((p: CountdownProps) => { p.labelColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
      </div>
    </div>
  );
};

export const Countdown = ({ 
  targetDate,
  textColor = "#111827",
  numberBgColor = "#f3f4f6",
  labelColor = "#6b7280",
  size = "md"
}: CountdownProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // If no target date, set to 7 days from now for preview
    const target = targetDate ? new Date(targetDate).getTime() : new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return { box: "w-12 h-12 text-lg", label: "text-[10px]" };
      case "lg": return { box: "w-24 h-24 text-4xl", label: "text-sm" };
      case "md":
      default: return { box: "w-16 h-16 text-2xl", label: "text-xs" };
    }
  };

  const classes = getSizeClasses();

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="inline-flex gap-2 sm:gap-4"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
        transition: "outline 0.15s"
      }}
    >
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" }
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div 
            className={`flex items-center justify-center rounded-lg font-bold shadow-sm ${classes.box}`}
            style={{ backgroundColor: numberBgColor, color: textColor }}
          >
            {item.value.toString().padStart(2, '0')}
          </div>
          <span className={`font-semibold uppercase tracking-wider ${classes.label}`} style={{ color: labelColor }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

Countdown.craft = {
  displayName: "Countdown Timer",
  props: { 
    textColor: "#111827",
    numberBgColor: "#f3f4f6",
    labelColor: "#6b7280",
    size: "md"
  },
  rules: { canDrag: () => true },
  related: { settings: CountdownSettings },
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNode } from "@craftjs/core";

interface StatItem {
  id: string;
  value: number;
  prefix: string;
  suffix: string;
  label: string;
}

interface StatsCounterProps {
  stats?: StatItem[];
  animate?: boolean;
  layout?: "grid" | "flex";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const StatsCounterSettings = () => {
  const { actions: { setProp }, stats, animate, layout, backgroundColor, textColor, accentColor } = useNode((node) => ({
    stats: node.data.props.stats as StatItem[],
    animate: node.data.props.animate,
    layout: node.data.props.layout,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
  }));

  const updateStat = (index: number, key: keyof StatItem, value: any) => {
    setProp((props: StatsCounterProps) => {
      if (props.stats && props.stats[index]) {
        (props.stats[index] as any)[key] = value;
      }
    });
  };

  const removeStat = (index: number) => {
    setProp((props: StatsCounterProps) => {
      if (props.stats) props.stats.splice(index, 1);
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Design</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Layout</div>
          <select 
            value={layout || "grid"} 
            onChange={(e) => setProp((p: StatsCounterProps) => { p.layout = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="grid">Grid (Equal Widths)</option>
            <option value="flex">Flex (Auto Widths)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: StatsCounterProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: StatsCounterProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 col-span-2">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Number</div>
            <input type="color" value={accentColor || "#0066FF"} onChange={(e) => setProp((p: StatsCounterProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Behavior</label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8">
          <input 
            type="checkbox" 
            checked={animate} 
            onChange={(e) => setProp((p: StatsCounterProps) => { p.animate = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Animate numbers counting up on scroll
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Statistics ({stats?.length || 0})</label>
        {stats && stats.map((stat, index) => (
          <div key={stat.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Stat {index + 1}</span>
              <button onClick={() => removeStat(index)} className="text-[10px] text-red-500 font-semibold uppercase">Remove</button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={stat.prefix} onChange={(e) => updateStat(index, "prefix", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Prefix (e.g. $)" />
              <input type="number" value={stat.value} onChange={(e) => updateStat(index, "value", parseInt(e.target.value) || 0)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none font-bold" placeholder="Number" />
              <input type="text" value={stat.suffix} onChange={(e) => updateStat(index, "suffix", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Suffix (e.g. %)" />
            </div>
            
            <input type="text" value={stat.label} onChange={(e) => updateStat(index, "label", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Label (e.g. Happy Patients)" />
          </div>
        ))}
        <button 
          onClick={() => {
            setProp((p: StatsCounterProps) => {
              if (!p.stats) p.stats = [];
              p.stats.push({ id: Date.now().toString(), prefix: "", value: 100, suffix: "+", label: "New Stat" });
            });
          }}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Stat
        </button>
      </div>
    </div>
  );
};

// Animated Number Component
const AnimatedNumber = ({ end, duration = 2000, startAnimating = true }: { end: number, duration?: number, startAnimating: boolean }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startAnimating) {
      setValue(0);
      return;
    }
    
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, startAnimating]);

  return <span>{value.toLocaleString()}</span>;
};

export const StatsCounter = ({ 
  stats = [
    { id: "1", prefix: "", value: 10000, suffix: "+", label: "Happy Patients" },
    { id: "2", prefix: "", value: 15, suffix: "", label: "Years Experience" },
    { id: "3", prefix: "", value: 24, suffix: "/7", label: "Support Available" },
    { id: "4", prefix: "", value: 99, suffix: "%", label: "Satisfaction Rate" },
  ],
  animate = true,
  layout = "grid",
  backgroundColor = "#ffffff",
  textColor = "#111827",
  accentColor = "#0066FF"
}: StatsCounterProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isSelected || !animate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isSelected, animate]);

  return (
    <div
      ref={(ref) => { 
        containerRef.current = ref as HTMLDivElement;
        connect(drag(ref as HTMLElement)); 
      }}
      className="w-full py-16 px-4"
      style={{ 
        backgroundColor,
        color: textColor,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className={`max-w-6xl mx-auto ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12' : 'flex flex-wrap justify-center gap-12 md:gap-24'}`}>
        {stats && stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center text-center">
            <div className="flex items-baseline mb-2" style={{ color: accentColor }}>
              <span className="text-3xl md:text-5xl font-black tracking-tight">{stat.prefix}</span>
              <span className="text-4xl md:text-6xl font-black tracking-tight">
                {animate ? <AnimatedNumber end={stat.value} startAnimating={isVisible} /> : stat.value.toLocaleString()}
              </span>
              <span className="text-3xl md:text-5xl font-black tracking-tight">{stat.suffix}</span>
            </div>
            <p className="text-sm md:text-base font-semibold uppercase tracking-wider opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

StatsCounter.craft = {
  displayName: "Stats Counter",
  props: { 
    stats: [
      { id: "1", prefix: "", value: 10000, suffix: "+", label: "Happy Patients" },
      { id: "2", prefix: "", value: 15, suffix: "", label: "Years Experience" },
      { id: "3", prefix: "", value: 24, suffix: "/7", label: "Support Available" },
      { id: "4", prefix: "", value: 99, suffix: "%", label: "Satisfaction Rate" },
    ],
    animate: true,
    layout: "grid",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    accentColor: "#0066FF"
  },
  rules: { canDrag: () => true },
  related: { settings: StatsCounterSettings },
};

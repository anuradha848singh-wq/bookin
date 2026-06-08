"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Clock } from "lucide-react";

interface DayHours {
  day: string;
  hours: string;
  isClosed: boolean;
}

interface BusinessHoursProps {
  title?: string;
  schedule?: DayHours[];
  highlightToday?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: number;
}

export const BusinessHoursSettings = () => {
  const { actions: { setProp }, title, schedule, highlightToday, backgroundColor, textColor, accentColor, borderRadius } = useNode((node) => ({
    title: node.data.props.title,
    schedule: node.data.props.schedule as DayHours[],
    highlightToday: node.data.props.highlightToday,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const updateDay = (index: number, key: keyof DayHours, value: any) => {
    setProp((props: BusinessHoursProps) => {
      if (props.schedule && props.schedule[index]) {
        (props.schedule[index] as any)[key] = value;
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Header</label>
        <input type="text" value={title || ""} onChange={(e) => setProp((p: BusinessHoursProps) => { p.title = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Title (e.g. Opening Hours)" />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors & Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: BusinessHoursProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: BusinessHoursProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Highlight</div>
            <input type="color" value={accentColor || "#10B981"} onChange={(e) => setProp((p: BusinessHoursProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 16} onChange={(e) => setProp((p: BusinessHoursProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
        
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8 mt-1">
          <input 
            type="checkbox" 
            checked={highlightToday} 
            onChange={(e) => setProp((p: BusinessHoursProps) => { p.highlightToday = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Automatically highlight current day
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Schedule</label>
        {schedule && schedule.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <input 
              type="text" 
              value={item.day} 
              onChange={(e) => updateDay(index, "day", e.target.value)} 
              className="w-[80px] px-2 py-1.5 text-[11px] font-semibold border border-[#E5E5E5] rounded focus:outline-none bg-gray-50" 
            />
            <input 
              type="text" 
              value={item.hours} 
              onChange={(e) => updateDay(index, "hours", e.target.value)} 
              disabled={item.isClosed}
              className={`flex-1 px-2 py-1.5 text-[11px] border border-[#E5E5E5] rounded focus:outline-none ${item.isClosed ? 'bg-gray-100 opacity-50' : 'bg-white'}`} 
              placeholder="9:00 AM - 5:00 PM"
            />
            <label className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer shrink-0 w-[50px]">
              <input 
                type="checkbox" 
                checked={item.isClosed} 
                onChange={(e) => updateDay(index, "isClosed", e.target.checked)}
                className="rounded border-gray-300"
              />
              Closed
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BusinessHours = ({ 
  title = "Opening Hours",
  schedule = [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", isClosed: false },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isClosed: false },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isClosed: false },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", isClosed: false },
    { day: "Friday", hours: "9:00 AM - 4:00 PM", isClosed: false },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM", isClosed: false },
    { day: "Sunday", hours: "Closed", isClosed: true },
  ],
  highlightToday = true,
  backgroundColor = "#ffffff",
  textColor = "#111827",
  accentColor = "#10B981",
  borderRadius = 16
}: BusinessHoursProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  // Get current day index (0 = Sunday, 1 = Monday, etc.)
  const todayIndex = new Date().getDay();
  // Map standard Date.getDay() to our list where Monday is usually first.
  // Assuming schedule[0] is Monday:
  const dayMap = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 0
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full border border-[#E5E5E5] shadow-sm p-6 sm:p-8"
      style={{ 
        backgroundColor,
        color: textColor,
        borderRadius: `${borderRadius}px`,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      {title && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <Clock size={24} style={{ color: accentColor }} />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      )}

      <div className="flex flex-col">
        {schedule && schedule.map((item, index) => {
          // Check if this is "today"
          // We do a simple string match against the day map
          const itemDayNum = (dayMap as any)[item.day];
          const isToday = highlightToday && itemDayNum === todayIndex;

          return (
            <div 
              key={index} 
              className={`flex justify-between items-center py-3 px-3 rounded-lg transition-colors ${isToday ? 'bg-opacity-10' : ''}`}
              style={{ 
                backgroundColor: isToday ? accentColor : 'transparent',
                fontWeight: isToday ? 'bold' : 'normal'
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-24 sm:w-32">{item.day}</span>
                {isToday && (
                  <span 
                    className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: accentColor, color: '#fff' }}
                  >
                    Today
                  </span>
                )}
              </div>
              
              <span className={item.isClosed ? "opacity-50" : ""}>
                {item.isClosed ? "Closed" : item.hours}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

BusinessHours.craft = {
  displayName: "Business Hours",
  props: { 
    title: "Opening Hours",
    schedule: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", isClosed: false },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", isClosed: false },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", isClosed: false },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", isClosed: false },
      { day: "Friday", hours: "9:00 AM - 4:00 PM", isClosed: false },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM", isClosed: false },
      { day: "Sunday", hours: "Closed", isClosed: true },
    ],
    highlightToday: true,
    backgroundColor: "#ffffff",
    textColor: "#111827",
    accentColor: "#10B981",
    borderRadius: 16
  },
  rules: { canDrag: () => true },
  related: { settings: BusinessHoursSettings },
};

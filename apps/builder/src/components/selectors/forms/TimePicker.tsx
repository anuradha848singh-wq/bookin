"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Clock } from "lucide-react";

interface TimePickerProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  interval?: 15 | 30 | 60;
  startHour?: number;
  endHour?: number;
  primaryColor?: string;
  borderRadius?: number;
}

export const TimePickerSettings = () => {
  const { actions: { setProp }, label, placeholder, required, interval, startHour, endHour, primaryColor, borderRadius } = useNode((node) => ({
    label: node.data.props.label,
    placeholder: node.data.props.placeholder,
    required: node.data.props.required,
    interval: node.data.props.interval,
    startHour: node.data.props.startHour,
    endHour: node.data.props.endHour,
    primaryColor: node.data.props.primaryColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Field Settings</label>
        <input type="text" value={label || ""} onChange={(e) => setProp((p: TimePickerProps) => { p.label = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Label (e.g. Select Time)" />
        <input type="text" value={placeholder || ""} onChange={(e) => setProp((p: TimePickerProps) => { p.placeholder = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Placeholder" />
        
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8 border border-[#E5E5E5] bg-[#FAFAFA] rounded-md px-3">
          <input 
            type="checkbox" 
            checked={required} 
            onChange={(e) => setProp((p: TimePickerProps) => { p.required = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Required Field
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Schedule Settings</label>
        
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Interval</div>
          <select value={interval || 30} onChange={(e) => setProp((p: TimePickerProps) => { p.interval = parseInt(e.target.value) as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Start</div>
            <select value={startHour || 9} onChange={(e) => setProp((p: TimePickerProps) => { p.startHour = parseInt(e.target.value); })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={`start-${i}`} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">End</div>
            <select value={endHour || 17} onChange={(e) => setProp((p: TimePickerProps) => { p.endHour = parseInt(e.target.value); })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={`end-${i}`} value={i}>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: TimePickerProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 8} onChange={(e) => setProp((p: TimePickerProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimePicker = ({ 
  label = "Select Time",
  placeholder = "Pick a time",
  required = true,
  interval = 30,
  startHour = 9,
  endHour = 17,
  primaryColor = "#0066FF",
  borderRadius = 8
}: TimePickerProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate times based on start, end, interval
  const generateTimes = () => {
    const times = [];
    let currentMins = startHour * 60;
    const endMins = endHour * 60;

    while (currentMins <= endMins) {
      const h = Math.floor(currentMins / 60);
      const m = currentMins % 60;
      
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m.toString().padStart(2, '0');
      
      times.push(`${displayH}:${displayM} ${ampm}`);
      currentMins += interval;
    }
    
    return times;
  };

  const times = generateTimes();

  const toggleOpen = () => {
    if (isSelected) return;
    setIsOpen(!isOpen);
  };

  const selectTime = (t: string) => {
    setSelectedTime(t);
    setIsOpen(false);
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full relative flex flex-col gap-2"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div 
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <span className={selectedTime ? "text-gray-900 font-medium" : "text-gray-400"}>
          {selectedTime ? selectedTime : placeholder}
        </span>
        <Clock size={18} className="text-gray-500" />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-200 shadow-xl z-50 w-full max-w-[200px] max-h-[250px] overflow-y-auto"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          <div className="flex flex-col gap-1">
            {times.length === 0 ? (
              <div className="p-3 text-sm text-center text-gray-500">Invalid time range</div>
            ) : (
              times.map((t, idx) => {
                const isActive = selectedTime === t;
                return (
                  <div 
                    key={idx}
                    onClick={() => selectTime(t)}
                    className="px-4 py-2 text-sm rounded cursor-pointer transition-colors font-medium"
                    style={{
                      backgroundColor: isActive ? primaryColor : 'transparent',
                      color: isActive ? 'white' : '#374151'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#F3F4F6';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {t}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

TimePicker.craft = {
  displayName: "Time Picker",
  props: { 
    label: "Select Time",
    placeholder: "Pick a time",
    required: true,
    interval: 30,
    startHour: 9,
    endHour: 17,
    primaryColor: "#0066FF",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: TimePickerSettings },
};

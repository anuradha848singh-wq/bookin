"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  minDate?: "today" | "none";
  primaryColor?: string;
  borderRadius?: number;
}

export const DatePickerSettings = () => {
  const { actions: { setProp }, label, placeholder, required, minDate, primaryColor, borderRadius } = useNode((node) => ({
    label: node.data.props.label,
    placeholder: node.data.props.placeholder,
    required: node.data.props.required,
    minDate: node.data.props.minDate,
    primaryColor: node.data.props.primaryColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Field Settings</label>
        <input type="text" value={label || ""} onChange={(e) => setProp((p: DatePickerProps) => { p.label = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Label (e.g. Select Date)" />
        <input type="text" value={placeholder || ""} onChange={(e) => setProp((p: DatePickerProps) => { p.placeholder = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Placeholder" />
        
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8 border border-[#E5E5E5] bg-[#FAFAFA] rounded-md px-3">
          <input 
            type="checkbox" 
            checked={required} 
            onChange={(e) => setProp((p: DatePickerProps) => { p.required = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Required Field
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Validation</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Min Date</div>
          <select value={minDate || "today"} onChange={(e) => setProp((p: DatePickerProps) => { p.minDate = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="today">Today (No Past Dates)</option>
            <option value="none">Any Date (Allow Past)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: DatePickerProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 8} onChange={(e) => setProp((p: DatePickerProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DatePicker = ({ 
  label = "Select Date",
  placeholder = "Pick a date",
  required = true,
  minDate = "today",
  primaryColor = "#0066FF",
  borderRadius = 8
}: DatePickerProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Basic calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const isPastDate = (day: number) => {
    if (minDate === "none") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() && 
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const selectDate = (day: number) => {
    if (isPastDate(day)) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setIsOpen(false);
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const toggleOpen = () => {
    if (isSelected) return;
    setIsOpen(!isOpen);
  };

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
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
        <span className={selectedDate ? "text-gray-900 font-medium" : "text-gray-400"}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <CalendarIcon size={18} className="text-gray-500" />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 shadow-xl z-50 w-full max-w-[320px]"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft size={20} /></button>
            <span className="font-bold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronRight size={20} /></button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-gray-400">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(b => <div key={`blank-${b}`} className="w-8 h-8"></div>)}
            {days.map(d => {
              const disabled = isPastDate(d);
              const selected = isSelectedDate(d);
              return (
                <div 
                  key={d} 
                  onClick={() => selectDate(d)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm mx-auto transition-colors
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'} 
                    ${selected ? 'text-white font-bold' : 'text-gray-700'}`}
                  style={{ backgroundColor: selected ? primaryColor : undefined }}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

DatePicker.craft = {
  displayName: "Date Picker",
  props: { 
    label: "Select Date",
    placeholder: "Pick a date",
    required: true,
    minDate: "today",
    primaryColor: "#0066FF",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: DatePickerSettings },
};

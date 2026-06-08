"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Circle } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events?: TimelineEvent[];
  lineColor?: string;
  dotColor?: string;
  dateColor?: string;
  titleColor?: string;
  textColor?: string;
}

export const TimelineSettings = () => {
  const { actions: { setProp }, events, lineColor, dotColor, dateColor, titleColor, textColor } = useNode((node) => ({
    events: node.data.props.events as TimelineEvent[],
    lineColor: node.data.props.lineColor,
    dotColor: node.data.props.dotColor,
    dateColor: node.data.props.dateColor,
    titleColor: node.data.props.titleColor,
    textColor: node.data.props.textColor,
  }));

  const addEvent = () => {
    setProp((props: TimelineProps) => {
      if (!props.events) props.events = [];
      props.events.push({ id: Date.now().toString(), date: "New Date", title: "New Milestone", description: "Describe the milestone here." });
    });
  };

  const updateEvent = (index: number, key: keyof TimelineEvent, value: string) => {
    setProp((props: TimelineProps) => {
      if (props.events && props.events[index]) {
        props.events[index][key] = value;
      }
    });
  };

  const removeEvent = (index: number) => {
    setProp((props: TimelineProps) => {
      if (props.events) {
        props.events.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Design Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Line</div>
            <input type="color" value={lineColor || "#e5e7eb"} onChange={(e) => setProp((p: TimelineProps) => { p.lineColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Dot</div>
            <input type="color" value={dotColor || "#0066FF"} onChange={(e) => setProp((p: TimelineProps) => { p.dotColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text Colors</label>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] text-gray-400">Date</span>
            <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 w-full">
              <input type="color" value={dateColor || "#6b7280"} onChange={(e) => setProp((p: TimelineProps) => { p.dateColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] text-gray-400">Title</span>
            <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 w-full">
              <input type="color" value={titleColor || "#111827"} onChange={(e) => setProp((p: TimelineProps) => { p.titleColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] text-gray-400">Text</span>
            <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 w-full">
              <input type="color" value={textColor || "#4b5563"} onChange={(e) => setProp((p: TimelineProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Events</label>
        {events && events.map((ev, index) => (
          <div key={ev.id} className="border border-[#E5E5E5] p-3 rounded-md bg-[#FAFAFA] flex flex-col gap-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={ev.date} 
                onChange={(e) => updateEvent(index, "date", e.target.value)}
                className="w-1/3 px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none"
                placeholder="Date"
              />
              <input 
                type="text" 
                value={ev.title} 
                onChange={(e) => updateEvent(index, "title", e.target.value)}
                className="w-2/3 px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none"
                placeholder="Title"
              />
            </div>
            <textarea 
              value={ev.description} 
              onChange={(e) => updateEvent(index, "description", e.target.value)}
              className="w-full px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none h-16"
              placeholder="Description"
            />
            <button 
              onClick={() => removeEvent(index)}
              className="text-[10px] text-red-500 font-semibold uppercase tracking-wide text-left mt-1"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          onClick={addEvent}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Event
        </button>
      </div>
    </div>
  );
};

export const Timeline = ({ 
  events = [
    { id: "1", date: "2020", title: "Clinic Founded", description: "We opened our doors with a mission to provide the best care." },
    { id: "2", date: "2022", title: "Expanded Services", description: "Added specialized therapies and hired 5 new experts." },
    { id: "3", date: "Present", title: "New Facility", description: "Moved into our state-of-the-art facility to serve more patients." }
  ],
  lineColor = "#e5e7eb",
  dotColor = "#0066FF",
  dateColor = "#6b7280",
  titleColor = "#111827",
  textColor = "#4b5563"
}: TimelineProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
      className="w-full py-4 pl-4"
    >
      <div className="relative border-l-2 ml-3 space-y-8" style={{ borderColor: lineColor }}>
        {events && events.map((ev, index) => (
          <div key={ev.id} className="relative pl-8">
            {/* Dot */}
            <div 
              className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: dotColor }}
            />
            
            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-1">
              <span style={{ color: titleColor }} className="text-lg font-bold">
                {ev.title}
              </span>
              <span style={{ color: dateColor }} className="text-sm font-semibold whitespace-nowrap">
                {ev.date}
              </span>
            </div>
            
            <p style={{ color: textColor }} className="text-base leading-relaxed">
              {ev.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

Timeline.craft = {
  displayName: "Timeline",
  props: { 
    events: [
      { id: "1", date: "2020", title: "Clinic Founded", description: "We opened our doors with a mission to provide the best care." },
      { id: "2", date: "2022", title: "Expanded Services", description: "Added specialized therapies and hired 5 new experts." },
      { id: "3", date: "Present", title: "New Facility", description: "Moved into our state-of-the-art facility to serve more patients." }
    ],
    lineColor: "#e5e7eb",
    dotColor: "#0066FF",
    dateColor: "#6b7280",
    titleColor: "#111827",
    textColor: "#4b5563"
  },
  rules: { canDrag: () => true },
  related: { settings: TimelineSettings },
};

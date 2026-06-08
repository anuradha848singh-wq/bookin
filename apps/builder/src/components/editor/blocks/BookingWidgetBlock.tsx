"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";

export type BookingWidgetBlockProps = {
  themeColor?: string;
  defaultCategory?: string;
};

export const BookingWidgetBlock = ({ themeColor = "#3b82f6", defaultCategory }: BookingWidgetBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      className={`relative w-full max-w-3xl mx-auto my-8 border-2 ${selected ? "border-blue-500 shadow-md" : "border-dashed border-gray-300"} bg-white rounded-xl p-6 transition-all`}
    >
      {/* Builder Placeholder Overlay */}
      <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-xl z-10 pointer-events-none">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border font-semibold text-sm flex items-center text-gray-700">
          <CalendarIcon className="w-4 h-4 mr-2 text-blue-600" />
          Smart Block: Booking Engine
        </div>
        <p className="text-xs text-gray-500 mt-2">This will render the live interactive booking funnel on the public site.</p>
      </div>

      {/* Mockup UI underneath */}
      <div className="opacity-40 select-none">
        <div className="flex space-x-4 border-b pb-4 mb-6">
          <div className="flex-1 flex flex-col items-center justify-center p-3 border rounded-lg bg-gray-50">
            <span className="font-bold text-sm">1. Service</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 border rounded-lg text-gray-400">
            <span className="font-bold text-sm">2. Time</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 border rounded-lg text-gray-400">
            <span className="font-bold text-sm">3. Details</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-16 border rounded-lg flex items-center px-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 mr-4"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          </div>
          <div className="h-16 border rounded-lg flex items-center px-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 mr-4"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingWidgetBlockSettings = () => {
  const { actions: { setProp }, themeColor, defaultCategory } = useNode((node) => ({
    themeColor: node.data.props.themeColor,
    defaultCategory: node.data.props.defaultCategory,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
        <div className="flex items-center space-x-2">
          <input 
            type="color" 
            value={themeColor || "#3b82f6"} 
            onChange={(e) => setProp((props: any) => props.themeColor = e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border"
          />
          <span className="text-sm text-gray-500 uppercase">{themeColor || "#3b82f6"}</span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Default Category Filter (Optional)</label>
        <input 
          type="text" 
          value={defaultCategory || ""} 
          onChange={(e) => setProp((props: any) => props.defaultCategory = e.target.value)}
          placeholder="e.g. consultations"
          className="w-full text-sm p-2 border rounded-md"
        />
        <p className="text-xs text-gray-400 mt-1">Leave blank to show all services.</p>
      </div>
    </div>
  );
};

BookingWidgetBlock.craft = {
  name: "BookingWidgetBlock",
  props: {
    themeColor: "#3b82f6",
    defaultCategory: "",
  },
  related: {
    settings: BookingWidgetBlockSettings,
  },
};

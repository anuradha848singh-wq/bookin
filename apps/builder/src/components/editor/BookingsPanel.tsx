"use client";

import React from "react";
import { Calendar, Clock, Users, DollarSign, Settings, Sparkles } from "lucide-react";

export const BookingsPanel = () => {
  
  const bookingWidgets = [
    { 
      id: "inline-calendar", 
      icon: <Calendar size={16} />, 
      label: "Inline Calendar", 
      desc: "Full calendar view with availability",
      color: "bg-blue-50 text-blue-600"
    },
    { 
      id: "booking-button", 
      icon: <Sparkles size={16} />, 
      label: "Book Now Button", 
      desc: "Opens booking modal on click",
      color: "bg-purple-50 text-purple-600"
    },
    { 
      id: "service-selector", 
      icon: <Settings size={16} />, 
      label: "Service Selector", 
      desc: "Choose service before booking",
      color: "bg-emerald-50 text-emerald-600"
    },
    { 
      id: "staff-picker", 
      icon: <Users size={16} />, 
      label: "Staff Picker", 
      desc: "Select preferred staff member",
      color: "bg-orange-50 text-orange-600"
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
      
      {/* Booking Widgets */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">BOOKING WIDGETS</h4>
        <div className="flex flex-col gap-2">
          {bookingWidgets.map((widget) => (
            <div 
              key={widget.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E5E5] bg-white hover:border-black hover:shadow-sm cursor-grab transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${widget.color} flex items-center justify-center flex-shrink-0`}>
                {widget.icon}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-gray-900">{widget.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{widget.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Settings */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">BOOKING SETTINGS</h4>
        <div className="flex flex-col gap-3 p-3 bg-white rounded-lg border border-[#E5E5E5]">
          
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Time Slot Duration</label>
            <select className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors">
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Buffer Time</label>
            <select className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors">
              <option value="0">No buffer</option>
              <option value="5">5 minutes</option>
              <option value="10" selected>10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
            <span className="text-[11px] font-medium text-gray-700">Require Deposit</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-700">Send Reminders</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-gray-700">Allow Cancellation</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">BOOKING STATS</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-lg border border-[#E5E5E5]">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={12} className="text-blue-500" />
              <span className="text-[10px] text-gray-500">This Week</span>
            </div>
            <p className="text-[18px] font-bold text-gray-900">24</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E5E5E5]">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={12} className="text-emerald-500" />
              <span className="text-[10px] text-gray-500">Revenue</span>
            </div>
            <p className="text-[18px] font-bold text-gray-900">₹48K</p>
          </div>
        </div>
      </div>
    </div>
  );
};

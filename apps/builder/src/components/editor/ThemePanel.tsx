"use client";

import React, { useState } from "react";
import { Palette, Type, Layout } from "lucide-react";

export const ThemePanel = () => {
  const [primaryColor, setPrimaryColor] = useState("#0066FF");
  const [secondaryColor, setSecondaryColor] = useState("#111827");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState(8);

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
      
      {/* Colors */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <Palette size={14} /> BRAND COLORS
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              />
              <div>
                <p className="text-[12px] font-medium text-gray-900">Primary</p>
                <p className="text-[10px] text-gray-500">{primaryColor}</p>
              </div>
            </div>
            <input 
              type="color" 
              value={primaryColor} 
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
                style={{ backgroundColor: secondaryColor }}
              />
              <div>
                <p className="text-[12px] font-medium text-gray-900">Secondary</p>
                <p className="text-[10px] text-gray-500">{secondaryColor}</p>
              </div>
            </div>
            <input 
              type="color" 
              value={secondaryColor} 
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <Type size={14} /> TYPOGRAPHY
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Font Family</label>
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full py-2 px-3 text-[12px] bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <Layout size={14} /> LAYOUT
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Border Radius</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min={0} 
                max={24} 
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-[12px] font-medium text-gray-700 w-12 text-right">{borderRadius}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">THEME PRESETS</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-white border border-[#E5E5E5] rounded-lg hover:border-black transition-all text-left">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <div className="w-4 h-4 rounded bg-gray-900" />
            </div>
            <p className="text-[11px] font-medium text-gray-900">Modern</p>
          </button>
          <button className="p-3 bg-white border border-[#E5E5E5] rounded-lg hover:border-black transition-all text-left">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 rounded bg-emerald-500" />
              <div className="w-4 h-4 rounded bg-teal-700" />
            </div>
            <p className="text-[11px] font-medium text-gray-900">Nature</p>
          </button>
          <button className="p-3 bg-white border border-[#E5E5E5] rounded-lg hover:border-black transition-all text-left">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 rounded bg-purple-500" />
              <div className="w-4 h-4 rounded bg-pink-500" />
            </div>
            <p className="text-[11px] font-medium text-gray-900">Vibrant</p>
          </button>
          <button className="p-3 bg-white border border-[#E5E5E5] rounded-lg hover:border-black transition-all text-left">
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 rounded bg-gray-800" />
              <div className="w-4 h-4 rounded bg-gray-600" />
            </div>
            <p className="text-[11px] font-medium text-gray-900">Minimal</p>
          </button>
        </div>
      </div>
    </div>
  );
};

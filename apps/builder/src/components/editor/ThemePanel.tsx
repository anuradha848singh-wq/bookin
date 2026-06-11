"use client";

import React from "react";
import { Palette, Type, Layout, Check, Plus, Trash2 } from "lucide-react";
import { useThemeTokens, ThemeToken } from "./ThemeTokenContext";

export const ThemePanel = () => {
  const { tokens, updateToken, addToken, deleteToken } = useThemeTokens();
  
  const colors = tokens.filter(t => t.category === 'colors');
  const typography = tokens.filter(t => t.category === 'typography');
  const spacing = tokens.filter(t => t.category === 'spacing');
  const radius = tokens.filter(t => t.category === 'radius');

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
      
      {/* Colors */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2"><Palette size={14} /> BRAND COLORS</div>
          <button className="text-gray-400 hover:text-white" onClick={() => addToken({ name: 'New Color', value: '#000000', category: 'colors' })}><Plus size={14}/></button>
        </h4>
        <div className="flex flex-col gap-3">
          {colors.map(color => (
            <div key={color.id} className="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded-lg group">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm shrink-0"
                  style={{ backgroundColor: color.value }}
                />
                <div className="flex flex-col w-24">
                  <input 
                    type="text" 
                    value={color.name}
                    onChange={(e) => updateToken(color.id, color.value, e.target.value)}
                    className="text-[12px] font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-1 -ml-1 w-full truncate"
                  />
                  <input 
                    type="text" 
                    value={color.value}
                    onChange={(e) => updateToken(color.id, e.target.value)}
                    className="text-[10px] text-gray-500 bg-transparent border-none outline-none font-mono uppercase focus:bg-gray-50 rounded px-1 -ml-1 w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="relative overflow-hidden w-6 h-6 rounded flex items-center justify-center bg-gray-100 hover:bg-gray-200 cursor-pointer">
                  <input 
                    type="color" 
                    value={color.value} 
                    onChange={(e) => updateToken(color.id, e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Palette size={12} className="text-gray-600 pointer-events-none" />
                </div>
                {!color.isDefault && (
                   <button onClick={() => deleteToken(color.id)} className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <Type size={14} /> TYPOGRAPHY
        </h4>
        <div className="flex flex-col gap-3">
          {typography.map(font => (
            <div key={font.id} className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{font.name}</label>
              <select 
                value={font.value}
                onChange={(e) => updateToken(font.id, e.target.value)}
                className="w-full py-2 px-3 text-[12px] bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <Layout size={14} /> LAYOUT
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Spacing Scale</label>
            <div className="flex flex-col gap-2 bg-white border border-[#E5E5E5] rounded-lg p-2">
               {spacing.map(space => (
                 <div key={space.id} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 w-8">{space.name}</span>
                    <input 
                      type="text" 
                      value={space.value} 
                      onChange={(e) => updateToken(space.id, e.target.value)}
                      className="text-[11px] bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full"
                    />
                 </div>
               ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Border Radii</label>
            <div className="flex flex-col gap-2 bg-white border border-[#E5E5E5] rounded-lg p-2">
               {radius.map(rad => (
                 <div key={rad.id} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-400 w-8">{rad.name}</span>
                    <input 
                      type="text" 
                      value={rad.value} 
                      onChange={(e) => updateToken(rad.id, e.target.value)}
                      className="text-[11px] bg-gray-50 border border-gray-200 rounded px-2 py-1 w-full"
                    />
                 </div>
               ))}
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

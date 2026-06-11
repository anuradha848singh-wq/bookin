"use client";

import React, { useState, useEffect } from "react";
import { Search, Image as ImageIcon, Globe, Type, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export const SeoSettingsPanel = ({ activeSlug }: { activeSlug: string }) => {
  const [seoData, setSeoData] = useState({
    title: 'Bookin - {{clinic_name}}',
    description: 'Book your next consultation easily. We provide top tier {{service_name}}.',
    ogImage: ''
  });

  // Mock data for CMS parser preview
  const mockContext = {
    clinic_name: 'Apex Health',
    service_name: 'Dermatology'
  };

  const parseTokens = (str: string) => {
    let parsed = str;
    for (const [key, value] of Object.entries(mockContext)) {
      parsed = parsed.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return parsed;
  };

  const titleLength = seoData.title.length;
  const descLength = seoData.description.length;
  const parsedTitle = parseTokens(seoData.title);
  const parsedDesc = parseTokens(seoData.description);

  // SEO Audit Status
  const getStatusColor = (current: number, min: number, max: number) => {
    if (current === 0) return "text-red-500";
    if (current >= min && current <= max) return "text-emerald-400";
    return "text-amber-400";
  };

  const StatusIcon = ({ current, min, max }: { current: number, min: number, max: number }) => {
    if (current === 0) return <XCircle size={14} className="text-red-500" />;
    if (current >= min && current <= max) return <CheckCircle size={14} className="text-emerald-400" />;
    return <AlertCircle size={14} className="text-amber-400" />;
  };

  return (
    <div className="flex flex-col gap-5 mt-6 pt-6 border-t border-[#2C2D33]">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Page Settings</span>
        <h3 className="text-sm font-semibold text-white">SEO & Social Meta</h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-medium text-gray-300">Meta Title</span>
            <span className={`text-[10px] ${getStatusColor(titleLength, 30, 60)}`}>{titleLength} / 60</span>
          </div>
          <div className="builder-settings-input">
            <Type size={14} className="text-gray-500 absolute left-2 top-2" />
            <input 
              type="text" 
              value={seoData.title}
              onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
              className="w-full bg-[#111115] border border-[#2C2D33] rounded px-8 py-1.5 text-[11px] text-white outline-none focus:border-indigo-500"
              placeholder="Page Title"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-medium text-gray-300">Meta Description</span>
            <span className={`text-[10px] ${getStatusColor(descLength, 120, 160)}`}>{descLength} / 160</span>
          </div>
          <div className="builder-settings-input h-auto">
            <textarea 
              value={seoData.description}
              onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
              className="w-full bg-[#111115] border border-[#2C2D33] rounded px-3 py-2 text-[11px] text-white outline-none focus:border-indigo-500 min-h-[60px] resize-y"
              placeholder="Brief description of the page..."
            />
          </div>
        </div>

        {/* OG Image */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-gray-300">Open Graph Image</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded border border-[#2C2D33] bg-[#111115] flex items-center justify-center overflow-hidden flex-shrink-0">
              {seoData.ogImage ? (
                <img src={seoData.ogImage} alt="OG" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={16} className="text-gray-600" />
              )}
            </div>
            <input 
              type="text" 
              value={seoData.ogImage}
              onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
              className="w-full bg-[#111115] border border-[#2C2D33] rounded px-3 py-1.5 text-[11px] text-white outline-none focus:border-indigo-500 h-8"
              placeholder="https://... (Image URL)"
            />
          </div>
        </div>
      </div>

      {/* SEO Audit & Parser Preview */}
      <div className="flex flex-col gap-2 p-3 bg-[#1A1A1E] border border-[#2C2D33] rounded-md mt-2">
        <div className="flex items-center gap-1.5 mb-2">
          <Globe size={14} className="text-indigo-400" />
          <span className="text-xs font-semibold text-white">Google Preview</span>
        </div>
        
        <div className="flex flex-col bg-white p-3 rounded-sm gap-1">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-gray-200"></div>
             <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-[#202124] leading-tight">Your Website</span>
                <span className="text-[9px] text-[#4d5156] leading-tight">https://bookin.com/{activeSlug}</span>
             </div>
          </div>
          <span className="text-[13px] text-[#1a0dab] font-medium leading-tight mt-1 hover:underline cursor-pointer truncate">
            {parsedTitle || "Page Title"}
          </span>
          <span className="text-[11px] text-[#4d5156] leading-tight line-clamp-2">
            {parsedDesc || "Page description will appear here..."}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-[#2C2D33]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SEO Audit Score</span>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <StatusIcon current={titleLength} min={30} max={60} /> Title Length (30-60 chars)
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <StatusIcon current={descLength} min={120} max={160} /> Description Length (120-160 chars)
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            {seoData.ogImage ? <CheckCircle size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-amber-400" />} OG Image Present
          </div>
        </div>

      </div>

    </div>
  );
};

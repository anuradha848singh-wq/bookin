"use client";

import React, { useState } from "react";
import { Search, FileText, Image, Link, Globe, CheckCircle, AlertCircle } from "lucide-react";

export const SEOPanel = () => {
  const [metaTitle, setMetaTitle] = useState("Bookin - Professional Booking Platform");
  const [metaDescription, setMetaDescription] = useState("Book appointments with ease. Manage your schedule, services, and clients all in one place.");
  
  const seoScore = 85;

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
      
      {/* SEO Score */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">SEO SCORE</h4>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-gray-700">Overall Score</span>
            <span className="text-[24px] font-bold text-emerald-600">{seoScore}</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
              style={{ width: `${seoScore}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600 mt-2">Good! A few improvements will boost your ranking.</p>
        </div>
      </div>

      {/* Meta Tags */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <FileText size={14} /> META TAGS
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
              <span>Page Title</span>
              <span className={`text-[10px] ${metaTitle.length <= 60 ? 'text-emerald-500' : 'text-orange-500'}`}>
                {metaTitle.length}/60
              </span>
            </label>
            <input 
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full py-2 px-3 text-[12px] bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Enter page title..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
              <span>Meta Description</span>
              <span className={`text-[10px] ${metaDescription.length <= 160 ? 'text-emerald-500' : 'text-orange-500'}`}>
                {metaDescription.length}/160
              </span>
            </label>
            <textarea 
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full py-2 px-3 text-[12px] bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors resize-none"
              placeholder="Enter meta description..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Keywords</label>
            <input 
              type="text"
              defaultValue="booking, appointments, scheduling"
              className="w-full py-2 px-3 text-[12px] bg-white border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors"
              placeholder="Comma separated keywords..."
            />
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1 flex items-center gap-2">
          <Globe size={14} /> SOCIAL SHARING
        </h4>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">OG Image</label>
            <div className="w-full aspect-video bg-[#FAFAFA] border-2 border-dashed border-[#E5E5E5] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[#0066FF] cursor-pointer transition-all">
              <Image size={20} className="text-gray-400" />
              <span className="text-[10px] text-gray-500">Upload preview image</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Checklist */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">SEO CHECKLIST</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E5E5E5]">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] text-gray-700">Title tag optimized</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E5E5E5]">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] text-gray-700">Meta description present</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E5E5E5]">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[11px] text-gray-700">Mobile responsive</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E5E5E5]">
            <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />
            <span className="text-[11px] text-gray-700">Add alt text to images</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E5E5E5]">
            <AlertCircle size={14} className="text-orange-500 flex-shrink-0" />
            <span className="text-[11px] text-gray-700">Improve page load speed</span>
          </div>
        </div>
      </div>

      {/* Sitemap & Robots */}
      <div>
        <h4 className="text-[11px] font-medium text-gray-400 mb-3 px-1">ADVANCED</h4>
        <div className="flex flex-col gap-2">
          <button className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#0066FF] transition-all text-left">
            <span className="text-[12px] font-medium text-gray-800">Generate Sitemap</span>
            <FileText size={14} className="text-gray-400" />
          </button>
          <button className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E5E5] hover:border-[#0066FF] transition-all text-left">
            <span className="text-[12px] font-medium text-gray-800">Edit Robots.txt</span>
            <FileText size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

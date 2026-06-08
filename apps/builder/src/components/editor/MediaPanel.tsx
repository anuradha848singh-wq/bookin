"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Video, File, Search, Grid3x3, List } from "lucide-react";

export const MediaPanel = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const mockMedia = [
    { id: 1, type: "image", name: "hero-bg.jpg", url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400", size: "2.4 MB" },
    { id: 2, type: "image", name: "service-1.jpg", url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400", size: "1.8 MB" },
    { id: 3, type: "image", name: "staff-photo.jpg", url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400", size: "1.2 MB" },
    { id: 4, type: "image", name: "product-shot.jpg", url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400", size: "3.1 MB" },
  ];

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      
      {/* Upload Area */}
      <div className="p-3 border-b border-[#E5E5E5]">
        <div className="border-2 border-dashed border-[#E5E5E5] rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-[#0066FF] hover:bg-blue-50/30 transition-all cursor-pointer">
          <Upload size={24} className="text-gray-400" />
          <p className="text-[12px] font-medium text-gray-700">Upload Media</p>
          <p className="text-[10px] text-gray-400">Drag & drop or click to browse</p>
        </div>
      </div>

      {/* Search & View Toggle */}
      <div className="p-3 border-b border-[#E5E5E5] flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066FF] transition-colors"
          />
        </div>
        <div className="flex border border-[#E5E5E5] rounded-lg overflow-hidden">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
          >
            <Grid3x3 size={14} />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="flex-1 p-3">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-2">
            {mockMedia.map((item) => (
              <div 
                key={item.id}
                className="aspect-square rounded-lg overflow-hidden border border-[#E5E5E5] hover:border-[#0066FF] cursor-pointer group relative"
              >
                <img 
                  src={item.url} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <ImageIcon size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {mockMedia.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg border border-[#E5E5E5] hover:border-[#0066FF] cursor-pointer group"
              >
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.size}</p>
                </div>
                <ImageIcon size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-3 border-t border-[#E5E5E5] bg-[#FAFAFA]">
        <p className="text-[10px] text-gray-500 text-center">
          {mockMedia.length} files • 8.5 MB used
        </p>
      </div>
    </div>
  );
};

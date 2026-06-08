"use client";

import React, { useState } from "react";
import { useEditor, Element } from "@craftjs/core";
import { Search, LayoutTemplate, Square, MessageCircle, Zap, Layout } from "lucide-react";
import { HeroSection } from "../selectors/structure/HeroSection";
import { ServicesGrid } from "../selectors/structure/ServicesGrid";
import { Footer } from "../selectors/structure/Footer";
import { CallToAction } from "../selectors/business/CallToAction";

const categories = [
  { id: "hero", name: "Hero Blocks", icon: Square },
  { id: "feature", name: "Features", icon: LayoutTemplate },
  { id: "cta", name: "Calls to Action", icon: Zap },
  { id: "header", name: "Headers", icon: Layout },
  { id: "footer", name: "Footers", icon: Layout },
];

export const BlocksPanel = () => {
  const { connectors, actions } = useEditor();
  const [activeCategory, setActiveCategory] = useState("hero");
  const [searchQuery, setSearchQuery] = useState("");

  const getBlocksForCategory = (categoryId: string) => {
    switch (categoryId) {
      case "hero":
        return Array.from({ length: 10 }).map((_, i) => ({
          name: `Hero Layout ${i + 1}`,
          component: <Element is={HeroSection} background={i % 2 === 0 ? "#f9fafb" : "#ffffff"} paddingY={100 + (i * 10)} parallax={i % 3 === 0} canvas />,
        }));
      case "feature":
        return Array.from({ length: 10 }).map((_, i) => ({
          name: `Feature Grid ${i + 1}`,
          component: <Element is={ServicesGrid} backgroundColor={i % 2 === 0 ? "#ffffff" : "#f3f4f6"} canvas />,
        }));
      case "cta":
        return Array.from({ length: 10 }).map((_, i) => ({
          name: `CTA Banner ${i + 1}`,
          component: <Element is={CallToAction} backgroundColor={i % 2 === 0 ? "var(--theme-primary, #000)" : "#f9fafb"} canvas />,
        }));
      case "footer":
        return Array.from({ length: 10 }).map((_, i) => ({
          name: `Footer Style ${i + 1}`,
          component: <Element is={Footer} backgroundColor={i % 2 === 0 ? "#111827" : "#1f2937"} canvas />,
        }));
      case "header":
        // Fallback for header blocks to simple container for now
        return Array.from({ length: 10 }).map((_, i) => ({
          name: `Header Style ${i + 1}`,
          component: <Element is={HeroSection} paddingY={20} canvas />, // Reusing Hero as a simple header block for mock
        }));
      default:
        return [];
    }
  };

  const blocks = getBlocksForCategory(activeCategory).filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search */}
      <div className="p-3 border-b border-[#E5E5E5]">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-md text-[12px] focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex overflow-x-auto border-b border-[#E5E5E5] hide-scrollbar bg-[#FAFAFA]">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors ${activeCategory === cat.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              <Icon size={12} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        <div className="grid grid-cols-1 gap-4">
          {blocks.map((block, i) => (
            <div 
              key={i}
              ref={(ref) => { connectors.create(ref as HTMLElement, block.component); }}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden cursor-grab hover:border-indigo-500 hover:shadow-md transition-all relative"
            >
              {/* Thumbnail Placeholder */}
              <div className="h-24 bg-gray-100 border-b border-gray-100 flex items-center justify-center relative overflow-hidden group-hover:bg-indigo-50/30 transition-colors">
                <div className="w-16 h-8 bg-white border border-gray-200 rounded shadow-sm opacity-50 flex items-center justify-center">
                  <LayoutTemplate size={14} className="text-gray-400" />
                </div>
                {/* Drag Overlay */}
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                    Drag to canvas
                  </span>
                </div>
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-[12px] font-bold text-gray-800">{block.name}</span>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">{activeCategory}</span>
              </div>
            </div>
          ))}
          {blocks.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-xs font-medium">
              No blocks found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

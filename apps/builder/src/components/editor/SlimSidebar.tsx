"use client";

import React, { useState } from "react";
import { Plus, Layers, Settings, Image as ImageIcon, LayoutTemplate, Square, FileText, MousePointerClick } from "lucide-react";
import { useEditor, Element } from "@craftjs/core";
import { Container } from "../selectors/structure/Container";
import { Text } from "../selectors/content/Text";
import { Button } from "../selectors/content/Button";
import { HeroSection } from "../selectors/structure/HeroSection";
import { ServicesGrid } from "../selectors/structure/ServicesGrid";

export const SlimSidebar = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { connectors } = useEditor();

  const togglePanel = (panel: string) => {
    if (activePanel === panel) setActivePanel(null);
    else setActivePanel(panel);
  };

  return (
    <div className="relative flex h-full">
      {/* Slim Sidebar */}
      <div className="w-[60px] h-full bg-[#1b1b2f] flex flex-col items-center py-4 z-20 shadow-lg">
        <button 
          onClick={() => togglePanel("add")}
          className={`w-10 h-10 rounded-full mb-4 flex items-center justify-center transition-colors ${activePanel === "add" ? "bg-[#ff5722] text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
          title="Add Elements"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={() => togglePanel("pages")}
          className={`w-10 h-10 rounded-full mb-4 flex items-center justify-center transition-colors ${activePanel === "pages" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
          title="Pages & Menu"
        >
          <LayoutTemplate size={18} />
        </button>
        <button 
          onClick={() => togglePanel("theme")}
          className={`w-10 h-10 rounded-full mb-4 flex items-center justify-center transition-colors ${activePanel === "theme" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
          title="Site Design"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Slide-out Panel */}
      <div 
        className={`absolute left-[60px] top-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-10 overflow-hidden flex flex-col ${activePanel ? "w-[300px]" : "w-0"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">
            {activePanel === "add" ? "Add Elements" : activePanel === "pages" ? "Pages & Menu" : "Site Theme"}
          </h2>
          <button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activePanel === "add" && (
            <div className="flex flex-col gap-6">
              
              {/* Clinic Blocks Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Clinic Blocks</h3>
                <div className="flex flex-col gap-2">
                  <div 
                    ref={(ref) => { connectors.create(ref as HTMLElement, <Element is={HeroSection} canvas />); }}
                    className="p-3 border border-gray-200 rounded-lg flex items-center gap-3 cursor-grab hover:border-[#ff5722] hover:bg-[#fff0ed] transition-colors"
                    onDragStart={() => setActivePanel(null)}
                  >
                    <Square size={16} className="text-[#ff5722]" />
                    <span className="text-sm font-medium text-gray-700">Hero Section</span>
                  </div>
                  <div 
                    ref={(ref) => { connectors.create(ref as HTMLElement, <Element is={ServicesGrid} canvas />); }}
                    className="p-3 border border-gray-200 rounded-lg flex items-center gap-3 cursor-grab hover:border-[#ff5722] hover:bg-[#fff0ed] transition-colors"
                    onDragStart={() => setActivePanel(null)}
                  >
                    <LayoutTemplate size={16} className="text-[#ff5722]" />
                    <span className="text-sm font-medium text-gray-700">Services Grid</span>
                  </div>
                </div>
              </div>

              {/* Layout Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Layout</h3>
                <div 
                  ref={(ref) => { connectors.create(ref as HTMLElement, <Element is={Container} padding={20} canvas />); }}
                  className="p-3 border border-gray-200 rounded-lg flex items-center gap-3 cursor-grab hover:border-[#ff5722] hover:bg-[#fff0ed] transition-colors"
                  onDragStart={() => setActivePanel(null)}
                >
                  <Layers size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Container</span>
                </div>
              </div>
              
              {/* Basic Section */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    ref={(ref) => { connectors.create(ref as HTMLElement, <Text text="Heading" fontSize={32} fontWeight="700" />); }}
                    className="p-3 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 cursor-grab hover:border-[#ff5722] hover:bg-[#fff0ed] transition-colors"
                    onDragStart={() => setActivePanel(null)}
                  >
                    <FileText size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-bold">Heading</span>
                  </div>
                  <div 
                    ref={(ref) => { connectors.create(ref as HTMLElement, <Text text="Paragraph text..." fontSize={16} />); }}
                    className="p-3 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 cursor-grab hover:border-[#ff5722] hover:bg-[#fff0ed] transition-colors"
                    onDragStart={() => setActivePanel(null)}
                  >
                    <FileText size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Paragraph</span>
                  </div>
                  <div 
                    ref={(ref) => { connectors.create(ref as HTMLElement, <Button text="Click Me" />); }}
                    className="p-3 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 cursor-grab hover:border-[#ff5722] hover:bg-[#fff0ed] transition-colors"
                    onDragStart={() => setActivePanel(null)}
                  >
                    <MousePointerClick size={20} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Button</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePanel === "pages" && (
            <div className="text-sm text-gray-500 text-center py-8">
              Page management coming soon.
            </div>
          )}

          {activePanel === "theme" && (
            <div className="text-sm text-gray-500 text-center py-8">
              Global theme settings coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

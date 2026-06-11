"use client";

import React, { useState } from "react";
import { useEditor, Element } from "@craftjs/core";
import { Container } from "./blocks/Container";
import { Text } from "./blocks/Text";
import { Button } from "./blocks/Button";
import { HeroSection } from "./blocks/HeroSection";
import { ServicesGrid } from "./blocks/ServicesGrid";
import { ServiceShowcase } from "./blocks/ServiceShowcase";
import { StaffShowcase } from "./blocks/StaffShowcase";
import { BookingWidgetConnector, CRMFormConnector } from "./blocks/Connectors";
import { BookingWidgetBlock } from "./blocks/BookingWidgetBlock";
import { FormEmbed } from "./blocks/FormEmbed";
import { Image } from "./blocks/Image";
import { Video } from "./blocks/Video";
import { Divider } from "./blocks/Divider";
import { Spacer } from "./blocks/Spacer";
import { Icon } from "./blocks/Icon";
import { Accordion } from "./blocks/Accordion";
import { Modal } from "./blocks/Modal";
import { Toggle } from "./blocks/Toggle";
import { Dropdown } from "./blocks/Dropdown";
import { Tabs } from "./blocks/Tabs";
import { Search, X, Square, Columns, LayoutGrid, Layers, Type, Heading1, MousePointerClick, Image as ImageIcon, Smile, Minus, Space, Video as VideoIcon, PictureInPicture, SlidersHorizontal, FormInput, MapPin, Table, AlignJustify, Menu, ToggleLeft, CalendarDays, ConciergeBell, Clock, Users, Repeat, Baseline, List, CreditCard, Code2, Star, Link, ArrowUpDown, PlaySquare, FileText, MonitorPlay, MousePointer2, Sparkles, Wand2, ChevronRight, LayoutTemplate, MoreHorizontal, FilePlus, Folders } from "lucide-react";

interface BuilderPageMeta {
  id?: string;
  name: string;
  slug: string;
  is_home?: boolean;
}

export const LeftPanel = ({ 
  activeTab,
  activeSlug,
  onPageSwitch
}: { 
  activeTab: string;
  activeSlug: string;
  onPageSwitch: (newSlug: string) => void;
}) => {
  const { connectors, actions, query } = useEditor();

  const handleAddClick = React.useCallback((element: React.ReactElement) => {
    const node = query.parseReactElement(element).toNodeTree();
    actions.addNodeTree(node, "ROOT");
  }, [actions, query]);

  const DraggableBlock = ({ element, icon, label, desc, recommended }: { element: React.ReactElement, icon: React.ReactNode, label: string, desc?: string, recommended?: boolean }) => {
    return (
      <div 
        className="builder-element-item"
        ref={(ref) => { if (ref) connectors.create(ref, element); }}
        onClick={() => handleAddClick(element)}
      >
        <div className="builder-element-icon">{icon}</div>
        <div className="builder-element-details flex-1">
          <div className="flex items-center justify-between">
            <span className="builder-element-name">{label}</span>
            {recommended && <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-1.5 py-0.5 rounded font-bold">AI</span>}
          </div>
          {desc && <span className="builder-element-desc truncate w-[180px]">{desc}</span>}
        </div>
      </div>
    );
  };

  const [pages, setPages] = React.useState<BuilderPageMeta[]>([
    { name: "Home Landing", slug: "home", is_home: true },
    { name: "About Clinic", slug: "about" },
    { name: "Clinical Specialties", slug: "services" },
    { name: "Our Specialists", slug: "staff" },
    { name: "Schedule Appointment", slug: "booking" },
  ]);

  if (!activeTab || activeTab === "settings" || activeTab === "none") return null;

  return (
    <div className="builder-panel">
      {/* Search Header (Common for most tabs) */}
      <div className="builder-panel-header">
        <span className="builder-panel-title">
          {activeTab === "add" && "Add Elements"}
          {activeTab === "pages" && "Pages"}
          {activeTab === "layers" && "Layers"}
          {activeTab === "components" && "Components"}
          {activeTab === "sections" && "Sections"}
          {activeTab === "theme" && "Theme Settings"}
          {activeTab === "cms" && "CMS Collections"}
          {activeTab === "forms" && "Forms & Submissions"}
          {activeTab === "bookings" && "Bookings"}
          {activeTab === "store" && "Store & Products"}
          {activeTab === "media" && "Media Manager"}
          {activeTab === "integrations" && "Integrations"}
          {activeTab === "analytics" && "Analytics"}
          {activeTab === "seo" && "SEO & Meta"}
        </span>
        <button className="text-gray-400 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
      </div>

      <div className="builder-panel-search-wrap">
        <div className="builder-panel-search">
          <Search size={14} className="builder-panel-search-icon" />
          <input type="text" placeholder={`Search ${activeTab}...`} />
        </div>
      </div>

      <div className="builder-panel-content hide-scrollbar">
        
        {/* ======================================= */}
        {/* ADD ELEMENTS TAB */}
        {/* ======================================= */}
        {activeTab === "add" && (
          <div className="flex flex-col pb-8">
            <div className="flex items-center gap-2 px-5 pt-3 pb-2">
              <button className="flex-1 py-1.5 text-xs font-semibold bg-indigo-500 text-white rounded-md flex items-center justify-center gap-1.5 shadow-[0_2px_10px_rgba(99,102,241,0.2)]">
                <Sparkles size={12} /> All Elements
              </button>
              <button className="flex-1 py-1.5 text-xs font-semibold bg-[#1E1E24] text-gray-400 rounded-md border border-[#2C2D33] hover:text-white transition-colors">
                Templates
              </button>
            </div>

            <h4 className="builder-category-header mt-2">Recently Used</h4>
            <div className="builder-element-list">
              <DraggableBlock element={<Element is={HeroSection} canvas />} icon={<LayoutTemplate size={16} />} label="Hero Section" desc="Main landing header with CTA" recommended />
              <DraggableBlock element={<Element is={Text} text="Heading" fontSize={32} fontWeight="bold" />} icon={<Heading1 size={16} />} label="Heading" desc="Large bold typography" />
            </div>

            <h4 className="builder-category-header mt-4">Layout</h4>
            <div className="builder-element-list">
              <DraggableBlock element={<Element is={Container} padding={20} canvas />} icon={<Square size={16} />} label="Container" desc="Basic layout wrapper" />
              <DraggableBlock element={<Element is={ServicesGrid} canvas />} icon={<LayoutGrid size={16} />} label="Grid" desc="Responsive grid layout" />
              <DraggableBlock element={<Element is={Container} padding={10} canvas />} icon={<Columns size={16} />} label="Columns" desc="Side by side layout" />
            </div>

            <h4 className="builder-category-header mt-4">Basic Elements</h4>
            <div className="builder-element-list">
              <DraggableBlock element={<Element is={Text} text="Text Block" />} icon={<Type size={16} />} label="Text" desc="Paragraphs and rich text" />
              <DraggableBlock element={<Element is={Button} text="Button" />} icon={<MousePointerClick size={16} />} label="Button" desc="Clickable actions & links" />
              <DraggableBlock element={<Element is={Image} canvas />} icon={<ImageIcon size={16} />} label="Image" desc="Upload or select images" />
              <DraggableBlock element={<Element is={Video} canvas />} icon={<VideoIcon size={16} />} label="Video" desc="Embed YouTube/Vimeo" />
              <DraggableBlock element={<Element is={Icon} canvas />} icon={<Smile size={16} />} label="Icon" desc="Vector symbols" />
              <DraggableBlock element={<Element is={Divider} canvas />} icon={<Minus size={16} />} label="Divider" desc="Horizontal rule" />
            </div>

            <h4 className="builder-category-header mt-4">Advanced Components</h4>
            <div className="builder-element-list">
              <DraggableBlock element={<Element is={Accordion} canvas />} icon={<AlignJustify size={16} />} label="Accordion" desc="Collapsible content panels" />
              <DraggableBlock element={<Element is={Tabs as any} canvas />} icon={<Folders size={16} />} label="Tabs" desc="Horizontal content switchers" />
              <DraggableBlock element={<Element is={Modal as any} canvas />} icon={<PictureInPicture size={16} />} label="Modal" desc="Popup overlay windows" />
              <DraggableBlock element={<Element is={FormEmbed as any} canvas />} icon={<FormInput size={16} />} label="Form" desc="Lead capture and contact" />
            </div>

            <h4 className="builder-category-header mt-4">Booking & Data</h4>
            <div className="builder-element-list">
              <DraggableBlock element={<Element is={BookingWidgetBlock} canvas />} icon={<CalendarDays size={16} />} label="Booking Widget" desc="Interactive scheduling" recommended />
              <DraggableBlock element={<Element is={ServiceShowcase} canvas />} icon={<ConciergeBell size={16} />} label="Services List" desc="Dynamic CMS services" />
              <DraggableBlock element={<Element is={StaffShowcase} canvas />} icon={<Users size={16} />} label="Staff Profiles" desc="Dynamic CMS staff members" />
            </div>

            {/* AI Generation Mockup */}
            <div className="builder-ai-generator mt-6">
              <div className="builder-ai-title"><Wand2 size={16} className="text-indigo-400" /> AI Section Generator</div>
              <p className="text-[10px] text-gray-400 mb-3">Describe what you need and AI will generate a complete section layout instantly.</p>
              <textarea 
                className="builder-ai-input" 
                rows={3} 
                placeholder="e.g. A pricing table with 3 tiers for a SaaS product..."
              />
              <button className="builder-ai-btn">
                <Sparkles size={14} /> Generate Section
              </button>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* PAGES TAB */}
        {/* ======================================= */}
        {activeTab === "pages" && (
          <div className="flex flex-col px-5 pb-8">
            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="text-xs font-semibold text-gray-400">SITE PAGES</span>
              <button className="text-indigo-400 hover:text-indigo-300"><FilePlus size={14} /></button>
            </div>
            <div className="flex flex-col gap-1">
              {pages.map(page => (
                <div 
                  key={page.slug} 
                  onClick={() => onPageSwitch(page.slug)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors ${activeSlug === page.slug ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-[#1E1E24] border border-transparent'}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={14} className={activeSlug === page.slug ? 'text-indigo-400' : 'text-gray-500'} />
                    <span className={`text-xs font-medium ${activeSlug === page.slug ? 'text-white' : 'text-gray-300'}`}>{page.name}</span>
                  </div>
                  {page.is_home && <span className="bg-[#1E1E24] text-gray-400 text-[9px] px-1.5 py-0.5 rounded font-semibold border border-[#2C2D33]">HOME</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* LAYERS MOCK */}
        {/* ======================================= */}
        {activeTab === "layers" && (
          <div className="flex flex-col px-5 pb-8">
            <p className="text-xs text-gray-400 text-center mt-10">Hierarchical layer tree will be displayed here.</p>
          </div>
        )}

        {/* ======================================= */}
        {/* THEME MOCK */}
        {/* ======================================= */}
        {activeTab === "theme" && (
           <div className="flex flex-col pb-8">
             <h4 className="builder-category-header mt-2">Design Tokens</h4>
             <div className="px-5 flex flex-col gap-3">
               <div className="flex items-center justify-between p-3 rounded-md bg-[#1E1E24] border border-[#2C2D33]">
                 <span className="text-xs text-gray-300">Brand Primary</span>
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded bg-indigo-500 border border-[#2C2D33]"></div>
                   <span className="text-[10px] text-gray-500">#6366F1</span>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 rounded-md bg-[#1E1E24] border border-[#2C2D33]">
                 <span className="text-xs text-gray-300">Brand Secondary</span>
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded bg-teal-500 border border-[#2C2D33]"></div>
                   <span className="text-[10px] text-gray-500">#14B8A6</span>
                 </div>
               </div>
               <div className="flex items-center justify-between p-3 rounded-md bg-[#1E1E24] border border-[#2C2D33]">
                 <span className="text-xs text-gray-300">Background</span>
                 <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded bg-[#0A0A0C] border border-[#2C2D33]"></div>
                   <span className="text-[10px] text-gray-500">#0A0A0C</span>
                 </div>
               </div>
             </div>
             
             <h4 className="builder-category-header mt-6">Typography</h4>
             <div className="px-5 flex flex-col gap-3">
               <div className="flex flex-col gap-1 p-3 rounded-md bg-[#1E1E24] border border-[#2C2D33]">
                 <span className="text-[10px] text-gray-500 uppercase tracking-wider">Heading Font</span>
                 <span className="text-sm text-white font-medium">Inter, sans-serif</span>
               </div>
               <div className="flex flex-col gap-1 p-3 rounded-md bg-[#1E1E24] border border-[#2C2D33]">
                 <span className="text-[10px] text-gray-500 uppercase tracking-wider">Body Font</span>
                 <span className="text-sm text-white">System UI</span>
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

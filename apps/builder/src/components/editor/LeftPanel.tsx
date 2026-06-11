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
import { Tabs as TabsBlock } from "./blocks/Tabs";
import { Search, X, Sparkles, Wand2, FilePlus, FileText, MoreHorizontal } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleAddClick = React.useCallback((element: React.ReactElement) => {
    const node = query.parseReactElement(element).toNodeTree();
    actions.addNodeTree(node, "ROOT");
  }, [actions, query]);

  const DraggableThumbnail = ({ element, label, thumbnailType, badge }: { element: React.ReactElement, label: string, thumbnailType: "hero" | "header" | "feature" | "text" | "button" | "form" | "grid", badge?: string }) => {
    return (
      <div 
        className="builder-thumbnail-card"
        ref={(ref) => { if (ref) connectors.create(ref, element); }}
        onClick={() => handleAddClick(element)}
      >
        <div className={`builder-thumbnail-visual type-${thumbnailType}`}>
           {/* Visual CSS-based mock of the component */}
           {thumbnailType === "hero" && <div className="mock-hero"><div className="mock-h1"></div><div className="mock-p"></div><div className="mock-btn"></div></div>}
           {thumbnailType === "feature" && <div className="mock-feature"><div className="mock-box"></div><div className="mock-box"></div><div className="mock-box"></div></div>}
           {thumbnailType === "grid" && <div className="mock-grid"><div className="mock-item"></div><div className="mock-item"></div><div className="mock-item"></div><div className="mock-item"></div></div>}
           {thumbnailType === "text" && <div className="mock-text"><div className="mock-line w-3/4"></div><div className="mock-line w-full"></div><div className="mock-line w-5/6"></div></div>}
           {thumbnailType === "button" && <div className="mock-button-only"><div className="mock-btn"></div></div>}
           {thumbnailType === "form" && <div className="mock-form"><div className="mock-input"></div><div className="mock-input"></div><div className="mock-btn"></div></div>}
           {thumbnailType === "header" && <div className="mock-header"><div className="mock-logo"></div><div className="mock-nav"></div></div>}
        </div>
        <div className="builder-thumbnail-footer">
          <span>{label}</span>
          {badge && <span className="builder-thumbnail-badge">{badge}</span>}
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
    <div className={`builder-panel ${activeTab === "add" ? "builder-panel-wide" : ""}`}>
      {/* Dynamic Header */}
      <div className="builder-panel-header">
        <span className="builder-panel-title">
          {activeTab === "add" && "Add Elements"}
          {activeTab === "pages" && "Pages"}
          {activeTab === "layers" && "Layers"}
          {activeTab === "components" && "Components"}
          {activeTab === "sections" && "Sections"}
          {activeTab === "theme" && "Theme Settings"}
          {activeTab === "cms" && "CMS Collections"}
        </span>
        <button className="text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><X size={16} /></button>
      </div>

      <div className="builder-panel-search-wrap">
        <div className="builder-panel-search">
          <Search size={14} className="builder-panel-search-icon" />
          <input type="text" placeholder={`Search elements...`} />
        </div>
      </div>

      <div className="builder-panel-content hide-scrollbar p-0">
        
        {/* ======================================= */}
        {/* ADD ELEMENTS DUAL-COLUMN UI */}
        {/* ======================================= */}
        {activeTab === "add" && (
          <div className="builder-add-layout">
            {/* Left Category Menu */}
            <div className="builder-add-sidebar">
              <button className={`builder-cat-btn ${selectedCategory === "all" ? "active" : ""}`} onClick={() => setSelectedCategory("all")}>All Elements</button>
              <div className="builder-cat-divider" />
              <button className={`builder-cat-btn ${selectedCategory === "hero" ? "active" : ""}`} onClick={() => setSelectedCategory("hero")}>Hero Sections</button>
              <button className={`builder-cat-btn ${selectedCategory === "header" ? "active" : ""}`} onClick={() => setSelectedCategory("header")}>Headers</button>
              <button className={`builder-cat-btn ${selectedCategory === "nav" ? "active" : ""}`} onClick={() => setSelectedCategory("nav")}>Navigation</button>
              <button className={`builder-cat-btn ${selectedCategory === "features" ? "active" : ""}`} onClick={() => setSelectedCategory("features")}>Features</button>
              <button className={`builder-cat-btn ${selectedCategory === "testimonials" ? "active" : ""}`} onClick={() => setSelectedCategory("testimonials")}>Testimonials</button>
              <button className={`builder-cat-btn ${selectedCategory === "pricing" ? "active" : ""}`} onClick={() => setSelectedCategory("pricing")}>Pricing</button>
              <button className={`builder-cat-btn ${selectedCategory === "faqs" ? "active" : ""}`} onClick={() => setSelectedCategory("faqs")}>FAQs</button>
              <button className={`builder-cat-btn ${selectedCategory === "contact" ? "active" : ""}`} onClick={() => setSelectedCategory("contact")}>Contact</button>
              <button className={`builder-cat-btn ${selectedCategory === "blogs" ? "active" : ""}`} onClick={() => setSelectedCategory("blogs")}>Blogs</button>
              <button className={`builder-cat-btn ${selectedCategory === "footers" ? "active" : ""}`} onClick={() => setSelectedCategory("footers")}>Footers</button>
              
              {/* AI Section Generator Mockup (Bottom Left) */}
              <div className="builder-ai-generator-small mt-auto mb-4 mx-2">
                <div className="builder-ai-title"><Wand2 size={14} className="text-indigo-400" /> AI Generator</div>
                <p className="text-[9px] text-gray-400 mb-2 leading-tight">Describe the section you want and AI will generate it for you.</p>
              </div>
            </div>

            {/* Right Thumbnails Area */}
            <div className="builder-add-content hide-scrollbar">
              
              {(selectedCategory === "all" || selectedCategory === "hero") && (
                <>
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <span className="text-xs font-semibold text-white">Hero Sections</span>
                    <span className="text-[10px] text-indigo-400 cursor-pointer">See all</span>
                  </div>
                  <div className="builder-thumbnail-grid">
                    <DraggableThumbnail element={<Element is={HeroSection} position="absolute" x={50} y={50} canvas />} label="Hero Left Align" thumbnailType="hero" badge="New" />
                    <DraggableThumbnail element={<Element is={HeroSection} position="absolute" x={50} y={50} canvas />} label="Hero Center" thumbnailType="hero" />
                    <DraggableThumbnail element={<Element is={HeroSection} position="absolute" x={50} y={50} canvas />} label="Hero Split" thumbnailType="hero" badge="AI" />
                  </div>
                </>
              )}

              {(selectedCategory === "all" || selectedCategory === "features") && (
                <>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <span className="text-xs font-semibold text-white">Features</span>
                    <span className="text-[10px] text-indigo-400 cursor-pointer">See all</span>
                  </div>
                  <div className="builder-thumbnail-grid">
                    <DraggableThumbnail element={<Element is={ServicesGrid} position="absolute" x={50} y={50} canvas />} label="Feature Grid 3x3" thumbnailType="feature" />
                    <DraggableThumbnail element={<Element is={ServicesGrid} position="absolute" x={50} y={50} canvas />} label="Feature Cards" thumbnailType="feature" badge="New" />
                  </div>
                </>
              )}

              {(selectedCategory === "all" || selectedCategory === "basic") && (
                <>
                  <div className="flex items-center justify-between mb-3 mt-6">
                    <span className="text-xs font-semibold text-white">Basic Elements</span>
                  </div>
                  <div className="builder-thumbnail-grid">
                    <DraggableThumbnail element={<Element is={Text} text="Heading" fontSize={32} fontWeight="bold" position="absolute" x={100} y={100} />} label="Heading" thumbnailType="text" />
                    <DraggableThumbnail element={<Element is={Text} text="Paragraph text goes here." position="absolute" x={100} y={100} />} label="Paragraph" thumbnailType="text" />
                    <DraggableThumbnail element={<Element is={Button} text="Button" position="absolute" x={100} y={100} />} label="Button" thumbnailType="button" />
                    <DraggableThumbnail element={<Element is={Image} position="absolute" x={100} y={100} width={300} height={200} canvas />} label="Image" thumbnailType="grid" />
                  </div>
                </>
              )}
              
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* PAGES TAB */}
        {/* ======================================= */}
        {activeTab === "pages" && (
          <div className="flex flex-col px-5 pb-8 pt-4">
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

      </div>
    </div>
  );
};

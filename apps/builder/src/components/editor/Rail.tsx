"use client";

import React from "react";
import { Plus, LayoutTemplate, Layers, Search, Image as ImageIcon, FormInput, Calendar, ShoppingBag, Settings, Paintbrush, FileText, Database, Share2, Component, BarChart, Clock } from "lucide-react";

export const Rail = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  
  const railItems = [
    { id: "layers", icon: <Layers size={20} strokeWidth={1.5} />, label: "Layers" },
    { id: "pages", icon: <FileText size={20} strokeWidth={1.5} />, label: "Pages" },
    { id: "components", icon: <Component size={20} strokeWidth={1.5} />, label: "Components" },
    { id: "sections", icon: <LayoutTemplate size={20} strokeWidth={1.5} />, label: "Sections" },
    { id: "theme", icon: <Paintbrush size={20} strokeWidth={1.5} />, label: "Theme" },
    { id: "versions", icon: <Clock size={20} strokeWidth={1.5} />, label: "History" },
    { id: "cms", icon: <Database size={20} strokeWidth={1.5} />, label: "CMS" },
    { id: "forms", icon: <FormInput size={20} strokeWidth={1.5} />, label: "Forms" },
    { id: "bookings", icon: <Calendar size={20} strokeWidth={1.5} />, label: "Bookings" },
    { id: "store", icon: <ShoppingBag size={20} strokeWidth={1.5} />, label: "Store" },
    { id: "media", icon: <ImageIcon size={20} strokeWidth={1.5} />, label: "Media" },
    { id: "integrations", icon: <Share2 size={20} strokeWidth={1.5} />, label: "Integrations" },
    { id: "analytics", icon: <BarChart size={20} strokeWidth={1.5} />, label: "Analytics" },
    { id: "seo", icon: <Search size={20} strokeWidth={1.5} />, label: "SEO" },
  ];

  return (
    <div className="builder-rail">
      <div className="builder-rail-nav">
        {/* + Add Button */}
        <button 
          onClick={() => setActiveTab("add")}
          className="builder-rail-add-btn"
          title="Add Elements"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>

        {/* Tab Items */}
        {railItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`builder-rail-item ${activeTab === item.id ? "active" : ""}`}
            title={item.label}
          >
            {item.icon}
            <span className="builder-rail-item-text">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Bottom Button */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`builder-rail-item ${activeTab === "settings" ? "active" : ""}`}
          title="Settings"
        >
          <Settings size={20} strokeWidth={1.5} />
          <span className="builder-rail-item-text">Settings</span>
        </button>
      </div>
    </div>
  );
};

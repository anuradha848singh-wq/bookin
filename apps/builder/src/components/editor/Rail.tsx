"use client";

import React from "react";
import { Plus, LayoutTemplate, Layers, Search, Image as ImageIcon, FormInput, Calendar, ShoppingBag, Settings, Paintbrush, FileText, Database, Share2 } from "lucide-react";

export const Rail = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  
  const railItems = [
    { id: "layers", icon: <Layers size={16} strokeWidth={2} />, label: "Layers" },
    { id: "pages", icon: <FileText size={16} strokeWidth={2} />, label: "Pages" },
    { id: "sections", icon: <LayoutTemplate size={16} strokeWidth={2} />, label: "Sections" },
    { id: "theme", icon: <Paintbrush size={16} strokeWidth={2} />, label: "Theme" },
    { id: "cms", icon: <Database size={16} strokeWidth={2} />, label: "CMS" },
    { id: "forms", icon: <FormInput size={16} strokeWidth={2} />, label: "Forms" },
    { id: "bookings", icon: <Calendar size={16} strokeWidth={2} />, label: "Bookings" },
    { id: "store", icon: <ShoppingBag size={16} strokeWidth={2} />, label: "Store" },
    { id: "media", icon: <ImageIcon size={16} strokeWidth={2} />, label: "Media" },
    { id: "integrations", icon: <Share2 size={16} strokeWidth={2} />, label: "Integrations" },
    { id: "seo", icon: <Search size={16} strokeWidth={2} />, label: "SEO" },
  ];

  return (
    <div className="builder-rail">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* + Add Button */}
        <div>
          <button 
            onClick={() => setActiveTab("add")}
            className="builder-rail-add-btn"
            title="Add Elements"
          >
            <Plus size={16} strokeWidth={3} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Add</span>
          </button>
        </div>

        {/* Tab Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          {railItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`builder-rail-item ${activeTab === item.id ? "active" : ""}`}
              title={item.label}
            >
              <div style={{ color: activeTab === item.id ? '#111827' : '#6b7280' }}>
                {item.icon}
              </div>
              <span className="builder-rail-item-text">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Bottom Button */}
      <div style={{ marginTop: '16px' }}>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`builder-rail-item ${activeTab === "settings" ? "active" : ""}`}
          title="Settings"
        >
          <div style={{ color: activeTab === "settings" ? '#111827' : '#6b7280' }}>
            <Settings size={16} strokeWidth={2} />
          </div>
          <span className="builder-rail-item-text">Settings</span>
        </button>
      </div>
    </div>
  );
};

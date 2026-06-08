"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { PlusCircle, Trash2 } from "lucide-react";

interface TabsProps {
  tabs?: { id: string; label: string }[];
  className?: string;
  children?: React.ReactNode;
}

export const TabsSettings = () => {
  const { actions: { setProp }, tabs } = useNode((node) => ({
    tabs: node.data.props.tabs || [{ id: 'tab1', label: 'Tab 1' }],
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";

  const addTab = () => {
    setProp((p: TabsProps) => {
      const newId = `tab${Math.random().toString(36).substr(2, 5)}`;
      if (!p.tabs) p.tabs = [];
      p.tabs.push({ id: newId, label: `New Tab` });
    });
  };

  const removeTab = (index: number) => {
    setProp((p: TabsProps) => {
      if (p.tabs && p.tabs.length > 1) {
        p.tabs.splice(index, 1);
      }
    });
  };

  const updateTabLabel = (index: number, label: string) => {
    setProp((p: TabsProps) => {
      if (p.tabs && p.tabs[index]) {
        p.tabs[index].label = label;
      }
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Tabs Items</h4>
        <div className="flex flex-col gap-2">
          {tabs.map((tab: { id: string, label: string }, idx: number) => (
            <div key={tab.id} className="flex items-center gap-2">
              <input 
                type="text" 
                value={tab.label} 
                onChange={(e) => updateTabLabel(idx, e.target.value)} 
                className={inputClass}
              />
              <button 
                onClick={() => removeTab(idx)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={tabs.length <= 1}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button 
            onClick={addTab}
            className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
          >
            <PlusCircle size={14} /> Add Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export const Tabs = ({ tabs = [{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }], className, children }: TabsProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'tab1');

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className || ''}`}
      style={{
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px",
      }}
    >
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-b-2 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 bg-white min-h-[100px] relative">
        {/* Editor representation simply shows the children area */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
          Active: {tabs.find(t => t.id === activeTab)?.label}
        </div>
        {children}
      </div>
    </div>
  );
};

Tabs.craft = {
  displayName: "Tabs",
  props: { 
    tabs: [{ id: 'tab1', label: 'Tab 1' }, { id: 'tab2', label: 'Tab 2' }]
  },
  rules: { canDrag: () => true },
  related: { settings: TabsSettings },
};

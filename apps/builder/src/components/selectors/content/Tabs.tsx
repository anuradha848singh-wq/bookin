"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Container } from "../structure/Container";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs?: TabItem[];
  activeTabColor?: string;
  inactiveTabColor?: string;
  textColor?: string;
  activeTextColor?: string;
}

export const TabsSettings = () => {
  const { actions: { setProp }, tabs, activeTabColor, inactiveTabColor, textColor, activeTextColor } = useNode((node) => ({
    tabs: node.data.props.tabs as TabItem[],
    activeTabColor: node.data.props.activeTabColor,
    inactiveTabColor: node.data.props.inactiveTabColor,
    textColor: node.data.props.textColor,
    activeTextColor: node.data.props.activeTextColor,
  }));

  const addTab = () => {
    setProp((props: TabsProps) => {
      if (!props.tabs) props.tabs = [];
      props.tabs.push({ id: `tab-${Date.now()}`, label: `Tab ${props.tabs.length + 1}` });
    });
  };

  const updateTab = (index: number, label: string) => {
    setProp((props: TabsProps) => {
      if (props.tabs && props.tabs[index]) {
        props.tabs[index].label = label;
      }
    });
  };

  const removeTab = (index: number) => {
    setProp((props: TabsProps) => {
      if (props.tabs) {
        props.tabs.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tab Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Active</div>
            <input type="color" value={activeTabColor || "#0066FF"} onChange={(e) => setProp((p: TabsProps) => { p.activeTabColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Inactive</div>
            <input type="color" value={inactiveTabColor || "#F3F4F6"} onChange={(e) => setProp((p: TabsProps) => { p.inactiveTabColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Active</div>
            <input type="color" value={activeTextColor || "#ffffff"} onChange={(e) => setProp((p: TabsProps) => { p.activeTextColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Inactive</div>
            <input type="color" value={textColor || "#4B5563"} onChange={(e) => setProp((p: TabsProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Manage Tabs</label>
        {tabs && tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center gap-2">
            <input 
              type="text" 
              value={tab.label} 
              onChange={(e) => updateTab(index, e.target.value)}
              className="w-full px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none"
            />
            {tabs.length > 1 && (
              <button onClick={() => removeTab(index)} className="text-[10px] text-red-500 font-semibold px-2">X</button>
            )}
          </div>
        ))}
        <button 
          onClick={addTab}
          className="w-full py-1.5 mt-2 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Tab
        </button>
      </div>
    </div>
  );
};

export const Tabs = ({ 
  tabs = [
    { id: "tab-1", label: "Details" },
    { id: "tab-2", label: "Pricing" },
    { id: "tab-3", label: "Reviews" }
  ],
  activeTabColor = "#0066FF",
  inactiveTabColor = "#F3F4F6",
  textColor = "#4B5563",
  activeTextColor = "#ffffff",
}: TabsProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [activeTabId, setActiveTabId] = useState(tabs && tabs.length > 0 ? tabs[0].id : "");

  // Update local active tab if props change
  React.useEffect(() => {
    if (tabs && tabs.length > 0 && !tabs.find(t => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
      className="w-full"
    >
      {/* Tab Headers */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-[#E5E5E5]">
        {tabs && tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{
                backgroundColor: isActive ? activeTabColor : inactiveTabColor,
                color: isActive ? activeTextColor : textColor,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
              }}
              className="px-6 py-3 rounded-t-lg font-semibold text-sm transition-colors whitespace-nowrap focus:outline-none"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents - using CraftJS Canvas so users can drop items in */}
      <div className="w-full border border-t-0 border-[#E5E5E5] rounded-b-lg p-6 bg-white min-h-[150px]">
        {tabs && tabs.map((tab) => (
          <div key={tab.id} style={{ display: activeTabId === tab.id ? "block" : "none" }}>
            <Element id={`tab-content-${tab.id}`} is={Container} canvas padding={0} background="transparent" />
          </div>
        ))}
      </div>
    </div>
  );
};

Tabs.craft = {
  displayName: "Tabs",
  props: { 
    tabs: [
      { id: "tab-1", label: "Details" },
      { id: "tab-2", label: "Pricing" },
      { id: "tab-3", label: "Reviews" }
    ],
    activeTabColor: "#111827",
    inactiveTabColor: "#F3F4F6",
    textColor: "#4B5563",
    activeTextColor: "#ffffff",
  },
  rules: { canDrag: () => true },
  related: { settings: TabsSettings },
};

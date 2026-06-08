"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items?: AccordionItem[];
  titleColor?: string;
  contentColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
}

export const AccordionSettings = () => {
  const { actions: { setProp }, items, titleColor, contentColor, backgroundColor, borderColor, borderRadius } = useNode((node) => ({
    items: node.data.props.items as AccordionItem[],
    titleColor: node.data.props.titleColor,
    contentColor: node.data.props.contentColor,
    backgroundColor: node.data.props.backgroundColor,
    borderColor: node.data.props.borderColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const addItem = () => {
    setProp((props: AccordionProps) => {
      if (!props.items) props.items = [];
      props.items.push({ id: Date.now().toString(), title: "New Item", content: "Item content here." });
    });
  };

  const updateItem = (index: number, key: keyof AccordionItem, value: string) => {
    setProp((props: AccordionProps) => {
      if (props.items && props.items[index]) {
        props.items[index][key] = value;
      }
    });
  };

  const removeItem = (index: number) => {
    setProp((props: AccordionProps) => {
      if (props.items) {
        props.items.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: AccordionProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Border</div>
            <input type="color" value={borderColor || "#e5e7eb"} onChange={(e) => setProp((p: AccordionProps) => { p.borderColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Title</div>
            <input type="color" value={titleColor || "#111827"} onChange={(e) => setProp((p: AccordionProps) => { p.titleColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={contentColor || "#4b5563"} onChange={(e) => setProp((p: AccordionProps) => { p.contentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Radius (px)</div>
          <input 
            type="number" 
            value={borderRadius || 8} 
            onChange={(e) => setProp((p: AccordionProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Items</label>
        {items && items.map((item, index) => (
          <div key={item.id} className="border border-[#E5E5E5] p-3 rounded-md bg-[#FAFAFA] flex flex-col gap-2">
            <input 
              type="text" 
              value={item.title} 
              onChange={(e) => updateItem(index, "title", e.target.value)}
              className="w-full px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none"
              placeholder="Title"
            />
            <textarea 
              value={item.content} 
              onChange={(e) => updateItem(index, "content", e.target.value)}
              className="w-full px-2 py-1 text-[12px] border border-[#E5E5E5] rounded focus:outline-none h-16"
              placeholder="Content"
            />
            <button 
              onClick={() => removeItem(index)}
              className="text-[10px] text-red-500 font-semibold uppercase tracking-wide text-left"
            >
              Remove
            </button>
          </div>
        ))}
        <button 
          onClick={addItem}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
};

export const Accordion = ({ 
  items = [
    { id: "1", title: "What services do you offer?", content: "We offer a wide range of services..." },
    { id: "2", title: "How do I book an appointment?", content: "You can book an appointment online..." }
  ],
  titleColor = "#111827",
  contentColor = "#4b5563",
  backgroundColor = "#ffffff",
  borderColor = "#e5e7eb",
  borderRadius = 8
}: AccordionProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [openId, setOpenId] = useState<string | null>(items && items.length > 0 ? items[0].id : null);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
      className="w-full flex flex-col gap-4"
    >
      {items && items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div 
            key={item.id}
            style={{ backgroundColor, borderColor, borderRadius: `${borderRadius}px` }}
            className="border overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
            >
              <span style={{ color: titleColor }} className="font-semibold">{item.title}</span>
              <ChevronDown 
                size={20} 
                style={{ color: titleColor }} 
                className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
              />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div style={{ color: contentColor }} className="p-4 pt-0 text-sm leading-relaxed whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Accordion.craft = {
  displayName: "Accordion / FAQ",
  props: { 
    items: [
      { id: "1", title: "What services do you offer?", content: "We offer a wide range of clinic services including checkups, diagnostics, and therapy. Please view our Services page for more details." },
      { id: "2", title: "Do you accept walk-ins?", content: "We highly recommend booking an appointment online to ensure you get a spot, but we do accept walk-ins based on availability." },
      { id: "3", title: "How long does a session take?", content: "A standard session usually takes about 45 minutes to an hour, depending on the specific service requested." }
    ],
    titleColor: "#111827",
    contentColor: "#4b5563",
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: AccordionSettings },
};

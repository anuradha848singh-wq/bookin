"use client";

import React, { useState } from "react";
import { useNode, useEditor, Element } from "@craftjs/core";
import { ChevronDown, AlignJustify } from "lucide-react";
import { Container } from "./Container";
import { Text } from "./Text";

interface AccordionProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const AccordionSettings = () => {
  const { actions: { setProp }, title } = useNode((node) => ({
    title: node.data.props.title,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Accordion Settings</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Title</label>
          <input 
            type="text" 
            value={title || "Accordion Title"} 
            onChange={(e) => setProp((p: AccordionProps) => { p.title = e.target.value; })} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export const Accordion = ({ title = "Accordion Title", className, children }: AccordionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className || ''}`}
      style={{
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px",
        marginBottom: "10px",
      }}
    >
      <div 
        className="cursor-pointer font-semibold p-4 bg-gray-50 flex justify-between items-center select-none hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown 
          size={18} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-white min-h-[50px]">
          {children}
        </div>
      )}
    </div>
  );
};

Accordion.craft = {
  displayName: "Accordion",
  props: { 
    title: "Accordion Title"
  },
  rules: { canDrag: () => true },
  related: { settings: AccordionSettings },
};

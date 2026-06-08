"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  buttonText?: string;
  className?: string;
  children?: React.ReactNode;
}

export const DropdownSettings = () => {
  const { actions: { setProp }, buttonText } = useNode((node) => ({
    buttonText: node.data.props.buttonText,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Dropdown Settings</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Button Text</label>
          <input 
            type="text" 
            value={buttonText || "Options"} 
            onChange={(e) => setProp((p: DropdownProps) => { p.buttonText = e.target.value; })} 
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export const Dropdown = ({ buttonText = "Options", className, children }: DropdownProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`relative inline-block text-left ${className || ''}`}
      style={{
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "2px",
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
      >
        {buttonText}
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden min-h-[40px]">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

Dropdown.craft = {
  displayName: "Dropdown",
  props: { 
    buttonText: "Options"
  },
  rules: { canDrag: () => true },
  related: { settings: DropdownSettings },
};

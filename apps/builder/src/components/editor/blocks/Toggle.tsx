"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ToggleLeft } from "lucide-react";

interface ToggleProps {
  label?: string;
  defaultChecked?: boolean;
  className?: string;
}

export const ToggleSettings = () => {
  const { actions: { setProp }, label, defaultChecked } = useNode((node) => ({
    label: node.data.props.label,
    defaultChecked: node.data.props.defaultChecked,
  }));

  const inputClass = "w-full text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-gray-800 font-medium";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-gray-700">Toggle Settings</h4>
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Label Text</label>
          <input 
            type="text" 
            value={label || "Enable Feature"} 
            onChange={(e) => setProp((p: ToggleProps) => { p.label = e.target.value; })} 
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="defaultChecked"
            checked={defaultChecked || false} 
            onChange={(e) => setProp((p: ToggleProps) => { p.defaultChecked = e.target.checked; })} 
          />
          <label htmlFor="defaultChecked" className="text-xs font-semibold text-gray-700 cursor-pointer">Checked by default</label>
        </div>
      </div>
    </div>
  );
};

export const Toggle = ({ label = "Enable Feature", defaultChecked = false, className }: ToggleProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${className || ''}`}
      onClick={() => setIsChecked(!isChecked)}
      style={{
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "4px",
      }}
    >
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isChecked ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
      {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
    </div>
  );
};

Toggle.craft = {
  displayName: "Toggle",
  props: { 
    label: "Enable Feature",
    defaultChecked: false
  },
  rules: { canDrag: () => true },
  related: { settings: ToggleSettings },
};

"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options?: RadioOption[];
  required?: boolean;
  layout?: "vertical" | "horizontal" | "cards";
  primaryColor?: string;
  borderRadius?: number;
}

export const RadioGroupSettings = () => {
  const { actions: { setProp }, label, options, required, layout, primaryColor, borderRadius } = useNode((node) => ({
    label: node.data.props.label,
    options: node.data.props.options as RadioOption[],
    required: node.data.props.required,
    layout: node.data.props.layout,
    primaryColor: node.data.props.primaryColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const updateOption = (index: number, key: keyof RadioOption, value: string) => {
    setProp((props: RadioGroupProps) => {
      if (props.options && props.options[index]) {
        props.options[index][key] = value;
      }
    });
  };

  const removeOption = (index: number) => {
    setProp((props: RadioGroupProps) => {
      if (props.options) {
        props.options.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Field Settings</label>
        <input type="text" value={label || ""} onChange={(e) => setProp((p: RadioGroupProps) => { p.label = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Group Label (e.g. Select Method)" />
        
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8 border border-[#E5E5E5] bg-[#FAFAFA] rounded-md px-3">
          <input 
            type="checkbox" 
            checked={required} 
            onChange={(e) => setProp((p: RadioGroupProps) => { p.required = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Required Field
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout & Style</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Style</div>
          <select value={layout || "vertical"} onChange={(e) => setProp((p: RadioGroupProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="vertical">Standard List (Vertical)</option>
            <option value="horizontal">Inline List (Horizontal)</option>
            <option value="cards">Selectable Cards</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: RadioGroupProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 8} onChange={(e) => setProp((p: RadioGroupProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Options ({options?.length || 0})</label>
        {options && options.map((opt, index) => (
          <div key={opt.id} className="border border-[#E5E5E5] p-3 rounded-md bg-white flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Option {index + 1}</span>
              <button onClick={() => removeOption(index)} className="text-[10px] text-red-500 font-semibold uppercase">Remove</button>
            </div>
            <input type="text" value={opt.label} onChange={(e) => updateOption(index, "label", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Display Label" />
            <input type="text" value={opt.value} onChange={(e) => updateOption(index, "value", e.target.value)} className="w-full px-2 py-1 text-[11px] border border-[#E5E5E5] rounded focus:outline-none" placeholder="Internal Value" />
          </div>
        ))}
        <button 
          onClick={() => {
            setProp((p: RadioGroupProps) => {
              if (!p.options) p.options = [];
              const count = p.options.length + 1;
              p.options.push({ id: Date.now().toString(), label: `Option ${count}`, value: `opt_${count}` });
            });
          }}
          className="w-full py-1.5 border border-dashed border-gray-300 rounded text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:border-gray-400"
        >
          + Add Option
        </button>
      </div>
    </div>
  );
};

export const RadioGroup = ({ 
  label = "Select Preference",
  options = [
    { id: "1", label: "Morning (9am - 12pm)", value: "morning" },
    { id: "2", label: "Afternoon (12pm - 4pm)", value: "afternoon" },
    { id: "3", label: "Evening (4pm - 8pm)", value: "evening" },
  ],
  required = true,
  layout = "vertical",
  primaryColor = "#0066FF",
  borderRadius = 8
}: RadioGroupProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (val: string) => {
    if (isSelected) return;
    setSelectedValue(val);
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full relative flex flex-col gap-3"
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden input for form validation */}
      <input type="hidden" required={required} value={selectedValue || ""} />

      {layout === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {options?.map((opt) => {
            const isActive = selectedValue === opt.value;
            return (
              <div 
                key={opt.id}
                onClick={() => handleSelect(opt.value)}
                className={`p-4 border-2 cursor-pointer transition-all flex flex-col items-center justify-center text-center ${isActive ? 'bg-blue-50' : 'bg-white hover:border-gray-300'}`}
                style={{ 
                  borderRadius: `${borderRadius}px`,
                  borderColor: isActive ? primaryColor : '#E5E7EB',
                }}
              >
                <div 
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center mb-3 transition-colors"
                  style={{ borderColor: isActive ? primaryColor : '#D1D5DB' }}
                >
                  {isActive && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />}
                </div>
                <span className="font-medium text-sm text-gray-800">{opt.label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`flex ${layout === 'horizontal' ? 'flex-row flex-wrap gap-6' : 'flex-col gap-3'}`}>
          {options?.map((opt) => {
            const isActive = selectedValue === opt.value;
            return (
              <label 
                key={opt.id}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={(e) => { e.preventDefault(); handleSelect(opt.value); }}
              >
                <div 
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors group-hover:border-gray-400"
                  style={{ borderColor: isActive ? primaryColor : '#D1D5DB' }}
                >
                  {isActive && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />}
                </div>
                <span className="text-sm font-medium text-gray-700 select-none group-hover:text-gray-900">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

RadioGroup.craft = {
  displayName: "Radio Group",
  props: { 
    label: "Select Preference",
    options: [
      { id: "1", label: "Morning (9am - 12pm)", value: "morning" },
      { id: "2", label: "Afternoon (12pm - 4pm)", value: "afternoon" },
      { id: "3", label: "Evening (4pm - 8pm)", value: "evening" },
    ],
    required: true,
    layout: "vertical",
    primaryColor: "#0066FF",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: RadioGroupSettings },
};

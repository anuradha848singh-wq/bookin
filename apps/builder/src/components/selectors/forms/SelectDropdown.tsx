"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { ChevronDown, Check } from "lucide-react";
import { useFormLogic } from "./FormLogicContext";

interface Option {
  id: string;
  label: string;
  value: string;
}

interface SelectDropdownProps {
  label?: string;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  primaryColor?: string;
  borderRadius?: number;
  fieldId?: string;
  conditionalRules?: any[];
  conditionalLogic?: "AND" | "OR";
}

export const SelectDropdownSettings = () => {
  const { actions: { setProp }, label, placeholder, options, required, primaryColor, borderRadius } = useNode((node) => ({
    label: node.data.props.label,
    placeholder: node.data.props.placeholder,
    options: node.data.props.options as Option[],
    required: node.data.props.required,
    primaryColor: node.data.props.primaryColor,
    borderRadius: node.data.props.borderRadius,
  }));

  const updateOption = (index: number, key: keyof Option, value: string) => {
    setProp((props: SelectDropdownProps) => {
      if (props.options && props.options[index]) {
        props.options[index][key] = value;
      }
    });
  };

  const removeOption = (index: number) => {
    setProp((props: SelectDropdownProps) => {
      if (props.options) {
        props.options.splice(index, 1);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Field Settings</label>
        <input type="text" value={label || ""} onChange={(e) => setProp((p: SelectDropdownProps) => { p.label = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Label (e.g. Select Service)" />
        <input type="text" value={placeholder || ""} onChange={(e) => setProp((p: SelectDropdownProps) => { p.placeholder = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Placeholder" />
        
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer h-8 border border-[#E5E5E5] bg-[#FAFAFA] rounded-md px-3">
          <input 
            type="checkbox" 
            checked={required} 
            onChange={(e) => setProp((p: SelectDropdownProps) => { p.required = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600"
          />
          Required Field
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Style</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: SelectDropdownProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 8} onChange={(e) => setProp((p: SelectDropdownProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
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
            setProp((p: SelectDropdownProps) => {
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

export const SelectDropdown = ({ 
  label = "Select Service",
  placeholder = "Choose an option",
  options = [
    { id: "1", label: "General Consultation", value: "general" },
    { id: "2", label: "Specialist Review", value: "specialist" },
    { id: "3", label: "Follow-up Appointment", value: "follow_up" },
  ],
  required = true,
  primaryColor = "#0066FF",
  borderRadius = 8,
  ...props
}: SelectDropdownProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  
  const { setValue, evaluateRules } = useFormLogic();
  const isVisible = evaluateRules(props.conditionalRules, props.conditionalLogic);

  const toggleOpen = () => {
    if (isSelected) return;
    setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    setIsOpen(false);
    if (props.fieldId) {
      setValue(props.fieldId, val);
    }
  };

  const selectedOption = options?.find(o => o.value === selectedValue);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full relative flex flex-col gap-2 transition-all duration-300 ${!isVisible ? "opacity-40 grayscale" : ""}`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      {!isVisible && (
        <div className="absolute -top-3 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 shadow shadow-black/20">
          Hidden by Logic
        </div>
      )}
      {label && (
        <label className="block text-sm font-semibold text-gray-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden native input for form submission if used natively */}
      <input type="hidden" required={required} value={selectedValue || ""} />

      <div 
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 py-2 bg-white border border-gray-200 shadow-xl z-50 w-full max-h-[250px] overflow-y-auto"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          <div className="flex flex-col">
            {(!options || options.length === 0) ? (
              <div className="px-4 py-2 text-sm text-gray-500 italic">No options available</div>
            ) : (
              options.map((opt) => {
                const isActive = selectedValue === opt.value;
                return (
                  <div 
                    key={opt.id}
                    onClick={() => handleSelect(opt.value)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isActive ? `${primaryColor}15` : 'transparent',
                      color: isActive ? primaryColor : '#374151',
                      fontWeight: isActive ? 600 : 400
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {opt.label}
                    {isActive && <Check size={16} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

SelectDropdown.craft = {
  displayName: "Select Dropdown",
  props: { 
    label: "Select Service",
    placeholder: "Choose an option",
    options: [
      { id: "1", label: "General Consultation", value: "general" },
      { id: "2", label: "Specialist Review", value: "specialist" },
      { id: "3", label: "Follow-up Appointment", value: "follow_up" },
    ],
    required: true,
    primaryColor: "#0066FF",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: SelectDropdownSettings },
};

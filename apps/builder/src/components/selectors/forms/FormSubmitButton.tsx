"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Send, Check, AlertCircle } from "lucide-react";

interface FormSubmitButtonProps {
  buttonText?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  width?: "auto" | "full";
  size?: "sm" | "md" | "lg";
  primaryColor?: string;
  borderRadius?: number;
}

export const FormSubmitButtonSettings = () => {
  const { actions: { setProp }, buttonText, loadingText, successText, errorText, width, size, primaryColor, borderRadius } = useNode((node) => ({
    buttonText: node.data.props.buttonText,
    loadingText: node.data.props.loadingText,
    successText: node.data.props.successText,
    errorText: node.data.props.errorText,
    width: node.data.props.width,
    size: node.data.props.size,
    primaryColor: node.data.props.primaryColor,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text States</label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[10px] font-bold text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[75px]">Default</div>
            <input type="text" value={buttonText || ""} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.buttonText = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="Submit" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[10px] font-bold text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[75px]">Loading</div>
            <input type="text" value={loadingText || ""} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.loadingText = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="Submitting..." />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[10px] font-bold text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[75px]">Success</div>
            <input type="text" value={successText || ""} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.successText = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="Done!" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[10px] font-bold text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[75px]">Error</div>
            <input type="text" value={errorText || ""} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.errorText = e.target.value; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" placeholder="Failed" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout & Style</label>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Size</div>
            <select value={size || "md"} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.size = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[50px]">Width</div>
            <select value={width || "full"} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.width = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
              <option value="auto">Auto</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Color</div>
            <input type="color" value={primaryColor || "#0066FF"} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.primaryColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Rad</div>
            <input type="number" value={borderRadius || 8} onChange={(e) => setProp((p: FormSubmitButtonProps) => { p.borderRadius = parseInt(e.target.value) || 0; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormSubmitButton = ({ 
  buttonText = "Submit",
  loadingText = "Submitting...",
  successText = "Success!",
  errorText = "Error",
  width = "full",
  size = "md",
  primaryColor = "#0066FF",
  borderRadius = 8
}: FormSubmitButtonProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent actual form submit in builder
    if (isSelected) return;
    
    // Cycle states for demonstration purposes in the builder when clicked
    if (status === "idle") {
      setStatus("loading");
      setTimeout(() => setStatus("success"), 1500);
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const getPadding = () => {
    switch(size) {
      case "sm": return "px-4 py-2 text-sm";
      case "lg": return "px-8 py-4 text-lg";
      default: return "px-6 py-3 text-base";
    }
  };

  const getBackgroundColor = () => {
    switch(status) {
      case "success": return "#10B981"; // green
      case "error": return "#EF4444"; // red
      default: return primaryColor;
    }
  };

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`relative ${width === 'full' ? 'w-full' : 'w-auto inline-block'}`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        className={`${getPadding()} font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2 w-full`}
        style={{ 
          backgroundColor: getBackgroundColor(),
          borderRadius: `${borderRadius}px`
        }}
      >
        {status === "idle" && (
          <>
            {buttonText}
            <Send size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
          </>
        )}
        
        {status === "loading" && (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {loadingText}
          </>
        )}

        {status === "success" && (
          <>
            <Check size={size === "sm" ? 14 : size === "lg" ? 20 : 16} strokeWidth={3} />
            {successText}
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle size={size === "sm" ? 14 : size === "lg" ? 20 : 16} strokeWidth={3} />
            {errorText}
          </>
        )}
      </button>
      
      {isSelected && (
        <div className="absolute top-full left-0 right-0 mt-2 text-[10px] text-gray-400 text-center pointer-events-none">
          (Click to test states in preview mode)
        </div>
      )}
    </div>
  );
};

FormSubmitButton.craft = {
  displayName: "Submit Button",
  props: { 
    buttonText: "Submit",
    loadingText: "Submitting...",
    successText: "Success!",
    errorText: "Error",
    width: "full",
    size: "md",
    primaryColor: "#0066FF",
    borderRadius: 8
  },
  rules: { canDrag: () => true },
  related: { settings: FormSubmitButtonSettings },
};

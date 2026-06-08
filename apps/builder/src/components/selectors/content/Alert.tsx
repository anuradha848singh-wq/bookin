"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message?: string;
  isDismissible?: boolean;
}

export const AlertSettings = () => {
  const { actions: { setProp }, type, title, message, isDismissible } = useNode((node) => ({
    type: node.data.props.type,
    title: node.data.props.title,
    message: node.data.props.message,
    isDismissible: node.data.props.isDismissible,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Type</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={type || "info"} 
            onChange={(e) => setProp((p: AlertProps) => { p.type = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="info">Info (Blue)</option>
            <option value="success">Success (Green)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="error">Error (Red)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Content</label>
        <input 
          type="text" 
          value={title || ""} 
          onChange={(e) => setProp((p: AlertProps) => { p.title = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Alert Title"
        />
        <textarea 
          value={message || ""} 
          onChange={(e) => setProp((p: AlertProps) => { p.message = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[60px]" 
          placeholder="Alert Message"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Options</label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isDismissible} 
            onChange={(e) => setProp((p: AlertProps) => { p.isDismissible = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Dismissible (Show Close Button)
        </label>
      </div>
    </div>
  );
};

export const Alert = ({ 
  type = "info",
  title = "Notice",
  message = "This is an important alert message.",
  isDismissible = true
}: AlertProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [isVisible, setIsVisible] = useState(true);

  // Re-show alert in editor if it was dismissed
  React.useEffect(() => {
    if (isSelected) setIsVisible(true);
  }, [isSelected]);

  if (!isVisible) return null;

  const getConfig = () => {
    switch(type) {
      case "success": return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", icon: <CheckCircle className="text-green-500" size={20} /> };
      case "error": return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", icon: <XCircle className="text-red-500" size={20} /> };
      case "warning": return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", icon: <AlertCircle className="text-yellow-500" size={20} /> };
      case "info":
      default: return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", icon: <Info className="text-blue-500" size={20} /> };
    }
  };

  const config = getConfig();

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full rounded-lg border p-4 flex items-start gap-3 ${config.bg} ${config.border}`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div className={`flex-1 ${config.text}`}>
        {title && <h3 className="text-sm font-bold mb-1">{title}</h3>}
        {message && <div className="text-sm opacity-90">{message}</div>}
      </div>
      {isDismissible && (
        <button 
          onClick={() => setIsVisible(false)}
          className={`shrink-0 ml-4 p-1 rounded-md opacity-50 hover:opacity-100 transition-opacity ${config.text}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

Alert.craft = {
  displayName: "Alert Banner",
  props: { 
    type: "info",
    title: "New Feature Available",
    message: "We just launched our new patient portal. Check it out today!",
    isDismissible: true
  },
  rules: { canDrag: () => true },
  related: { settings: AlertSettings },
};

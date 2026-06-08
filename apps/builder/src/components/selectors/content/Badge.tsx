"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";

interface BadgeProps {
  text?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export const BadgeSettings = () => {
  const { actions: { setProp }, text, variant, size, rounded } = useNode((node) => ({
    text: node.data.props.text,
    variant: node.data.props.variant,
    size: node.data.props.size,
    rounded: node.data.props.rounded,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Text</label>
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setProp((p: BadgeProps) => { p.text = e.target.value; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Variant</label>
        <select 
          value={variant} 
          onChange={(e) => setProp((p: BadgeProps) => { p.variant = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="default">Default</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="info">Info</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Size</label>
        <select 
          value={size} 
          onChange={(e) => setProp((p: BadgeProps) => { p.size = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-700">Fully Rounded</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={rounded}
            onChange={(e) => setProp((p: BadgeProps) => { p.rounded = e.target.checked; })}
            className="sr-only peer" 
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
        </label>
      </div>
    </div>
  );
};

export const Badge = ({ 
  text = "Badge", 
  variant = "default",
  size = "md",
  rounded = false
}: BadgeProps) => {
  const { connectors: { connect, drag }, isSelected, actions: { setProp } } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [isEditing, setIsEditing] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing && badgeRef.current) {
      badgeRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(badgeRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (badgeRef.current) {
      const newText = badgeRef.current.textContent || "Badge";
      setProp((props: BadgeProps) => {
        props.text = newText;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      badgeRef.current?.blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      if (badgeRef.current) {
        badgeRef.current.textContent = text;
      }
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return { bg: "#10B981", color: "#FFFFFF" };
      case "warning":
        return { bg: "#F59E0B", color: "#FFFFFF" };
      case "error":
        return { bg: "#EF4444", color: "#FFFFFF" };
      case "info":
        return { bg: "#3B82F6", color: "#FFFFFF" };
      default:
        return { bg: "#6B7280", color: "#FFFFFF" };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { fontSize: "11px", padding: "2px 8px" };
      case "lg":
        return { fontSize: "14px", padding: "6px 16px" };
      default:
        return { fontSize: "12px", padding: "4px 12px" };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <span
      ref={(ref) => {
        if (!isEditing && ref) {
          connect(drag(ref));
        }
        badgeRef.current = ref;
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{
        display: "inline-block",
        backgroundColor: variantStyles.bg,
        color: variantStyles.color,
        fontSize: sizeStyles.fontSize,
        padding: sizeStyles.padding,
        borderRadius: rounded ? "9999px" : "6px",
        fontWeight: 600,
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        cursor: isEditing ? "text" : "default",
        userSelect: isEditing ? "text" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
};

Badge.craft = {
  displayName: "Badge",
  props: { text: "Badge", variant: "default", size: "md", rounded: false },
  related: { settings: BadgeSettings },
};

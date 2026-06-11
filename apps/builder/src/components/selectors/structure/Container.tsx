"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface ContainerProps {
  background?: string;
  padding?: number;
  paddingY?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: string;
  parallax?: boolean;
  width?: string;
  height?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: number;
  children?: React.ReactNode;
}

export const ContainerSettings = () => {
  const { actions: { setProp }, background, padding, borderRadius, parallax } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    parallax: node.data.props.parallax,
  }));

  // SettingsPanel handles the detailed inputs via its own hooks now, 
  // but we keep this minimal version for fallback or quick edits.
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Quick Settings</label>
        <div className="text-xs text-gray-400">Use the main properties panel to adjust full layout constraints, box model spacing, and flex alignments.</div>
      </div>
    </div>
  );
};

export const Container = ({ 
  background = "transparent", 
  padding = 0, 
  paddingY,
  borderRadius = 0, 
  borderWidth = 0,
  borderColor = "#E5E7EB",
  shadow = "",
  parallax = false, 
  width = "100%",
  height = "auto",
  display = "flex",
  flexDirection = "column",
  justifyContent = "flex-start",
  alignItems = "stretch",
  gap = 0,
  children 
}: ContainerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const py = paddingY !== undefined ? paddingY : padding;
  const px = padding;

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        background, 
        padding: `${py}px ${px}px`, 
        borderRadius: `${borderRadius}px`, 
        border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : undefined,
        boxShadow: shadow || undefined,
        width,
        height,
        display,
        flexDirection: display === 'flex' ? (flexDirection as any) : undefined,
        justifyContent: display === 'flex' ? justifyContent : undefined,
        alignItems: display === 'flex' ? alignItems : undefined,
        gap: display === 'flex' ? `${gap}px` : undefined,
        outline: isSelected ? "2px solid #0066FF" : "none", 
        outlineOffset: "-2px", 
        minHeight: "40px", 
        transition: "outline 0.15s",
        backgroundAttachment: parallax ? "fixed" : "scroll",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
      className={`relative ${!background || background === "transparent" ? "border border-dashed border-[#E5E5E5]" : ""} ${parallax ? 'bg-fixed' : ''}`}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: { 
    background: "transparent", 
    padding: 20, 
    borderRadius: 0, 
    borderWidth: 0,
    borderColor: "#E5E7EB",
    shadow: "",
    parallax: false,
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: 0
  },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};

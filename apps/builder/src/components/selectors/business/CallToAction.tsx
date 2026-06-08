"use client";

import React from "react";
import { useNode } from "@craftjs/core";

interface CallToActionProps {
  headline?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  layout?: "center" | "split";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const CallToActionSettings = () => {
  const { actions: { setProp }, headline, description, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, layout, backgroundColor, textColor, accentColor } = useNode((node) => ({
    headline: node.data.props.headline,
    description: node.data.props.description,
    primaryButtonText: node.data.props.primaryButtonText,
    primaryButtonLink: node.data.props.primaryButtonLink,
    secondaryButtonText: node.data.props.secondaryButtonText,
    secondaryButtonLink: node.data.props.secondaryButtonLink,
    layout: node.data.props.layout,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    accentColor: node.data.props.accentColor,
  }));

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Content</label>
        <input type="text" value={headline || ""} onChange={(e) => setProp((p: CallToActionProps) => { p.headline = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-bold text-gray-800" placeholder="Headline" />
        <textarea value={description || ""} onChange={(e) => setProp((p: CallToActionProps) => { p.description = e.target.value; })} className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700 min-h-[80px]" placeholder="Description..." />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Primary Button</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" value={primaryButtonText || ""} onChange={(e) => setProp((p: CallToActionProps) => { p.primaryButtonText = e.target.value; })} className="px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Text" />
          <input type="text" value={primaryButtonLink || ""} onChange={(e) => setProp((p: CallToActionProps) => { p.primaryButtonLink = e.target.value; })} className="px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="URL" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Secondary Button (Optional)</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="text" value={secondaryButtonText || ""} onChange={(e) => setProp((p: CallToActionProps) => { p.secondaryButtonText = e.target.value; })} className="px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="Text" />
          <input type="text" value={secondaryButtonLink || ""} onChange={(e) => setProp((p: CallToActionProps) => { p.secondaryButtonLink = e.target.value; })} className="px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" placeholder="URL" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Layout & Style</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Layout</div>
          <select value={layout || "center"} onChange={(e) => setProp((p: CallToActionProps) => { p.layout = e.target.value as any; })} className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700">
            <option value="center">Centered Stack</option>
            <option value="split">Split (Text Left, Buttons Right)</option>
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#0066FF"} onChange={(e) => setProp((p: CallToActionProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#ffffff"} onChange={(e) => setProp((p: CallToActionProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BTN</div>
            <input type="color" value={accentColor || "#ffffff"} onChange={(e) => setProp((p: CallToActionProps) => { p.accentColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CallToAction = ({ 
  headline = "Ready to get started?",
  description = "Join thousands of satisfied clinics already using our platform to grow their business.",
  primaryButtonText = "Book a Demo",
  primaryButtonLink = "#",
  secondaryButtonText = "Learn More",
  secondaryButtonLink = "#",
  layout = "center",
  backgroundColor = "#0066FF",
  textColor = "#ffffff",
  accentColor = "#ffffff"
}: CallToActionProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const isCenter = layout === "center";

  // Compute button text color based on accent color to ensure contrast
  // A simple hack: if accent is white, text is blue (or bg color), else text is white
  const isAccentWhite = accentColor.toLowerCase() === "#ffffff" || accentColor.toLowerCase() === "#fff";
  const btnTextColor = isAccentWhite ? backgroundColor : "#ffffff";

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className="w-full py-16 px-6 md:px-12"
      style={{ 
        backgroundColor,
        color: textColor,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      <div className={`max-w-5xl mx-auto flex ${isCenter ? 'flex-col text-center items-center' : 'flex-col md:flex-row justify-between items-center text-left'} gap-8`}>
        
        <div className={`flex flex-col gap-4 max-w-2xl ${isCenter ? 'items-center' : ''}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {headline}
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-xl">
            {description}
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 shrink-0 ${isCenter ? 'mt-4' : ''}`}>
          {primaryButtonText && (
            <a 
              href={primaryButtonLink}
              onClick={e => isSelected && e.preventDefault()}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-transform hover:-translate-y-1 shadow-lg flex items-center justify-center text-center"
              style={{ backgroundColor: accentColor, color: btnTextColor }}
            >
              {primaryButtonText}
            </a>
          )}
          {secondaryButtonText && (
            <a 
              href={secondaryButtonLink}
              onClick={e => isSelected && e.preventDefault()}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-transform hover:-translate-y-1 flex items-center justify-center text-center border-2"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
        
      </div>
    </div>
  );
};

CallToAction.craft = {
  displayName: "Call To Action",
  props: { 
    headline: "Ready to get started?",
    description: "Join thousands of satisfied clinics already using our platform to grow their business.",
    primaryButtonText: "Book a Demo",
    primaryButtonLink: "#",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "#",
    layout: "center",
    backgroundColor: "#0066FF",
    textColor: "#ffffff",
    accentColor: "#ffffff"
  },
  rules: { canDrag: () => true },
  related: { settings: CallToActionSettings },
};

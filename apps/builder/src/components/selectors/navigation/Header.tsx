"use client";

import React, { useState } from "react";
import { useNode, Element } from "@craftjs/core";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  backgroundColor?: string;
  textColor?: string;
  logoText?: string;
  logoImageUrl?: string;
  isSticky?: boolean;
  padding?: number;
  links?: { label: string; url: string }[];
  showButton?: boolean;
  buttonText?: string;
}

export const HeaderSettings = () => {
  const { actions: { setProp }, backgroundColor, textColor, logoText, isSticky, showButton, buttonText } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    logoText: node.data.props.logoText,
    isSticky: node.data.props.isSticky,
    showButton: node.data.props.showButton,
    buttonText: node.data.props.buttonText,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Brand</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <span className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[60px]">Text</span>
          <input 
            type="text" 
            value={logoText || ""} 
            onChange={(e) => setProp((p: HeaderProps) => { p.logoText = e.target.value; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Colors</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">BG</div>
            <input type="color" value={backgroundColor || "#ffffff"} onChange={(e) => setProp((p: HeaderProps) => { p.backgroundColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Text</div>
            <input type="color" value={textColor || "#111827"} onChange={(e) => setProp((p: HeaderProps) => { p.textColor = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Options</label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isSticky} 
            onChange={(e) => setProp((p: HeaderProps) => { p.isSticky = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Sticky Header
        </label>
        <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showButton} 
            onChange={(e) => setProp((p: HeaderProps) => { p.showButton = e.target.checked; })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Show CTA Button
        </label>
      </div>

      {showButton && (
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">CTA Text</label>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <input 
              type="text" 
              value={buttonText || ""} 
              onChange={(e) => setProp((p: HeaderProps) => { p.buttonText = e.target.value; })} 
              className="w-full h-full px-3 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const Header = ({ 
  backgroundColor = "#ffffff", 
  textColor = "#111827", 
  logoText = "Brand",
  logoImageUrl = "",
  isSticky = false,
  padding = 16,
  links = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Services", url: "/services" },
    { label: "Contact", url: "/contact" }
  ],
  showButton = true,
  buttonText = "Book Now"
}: HeaderProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      style={{ 
        backgroundColor, 
        color: textColor,
        position: isSticky ? "sticky" : "relative",
        top: 0,
        zIndex: 50,
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s, background-color 0.3s"
      }}
      className={`w-full border-b border-black/5 shadow-sm`}
    >
      <div style={{ padding: `${padding}px 24px` }} className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 cursor-pointer no-underline group">
          {logoImageUrl ? (
            <img src={logoImageUrl} alt={logoText} className="h-8 w-auto object-contain" />
          ) : (
            <div style={{ color: textColor }} className="text-xl font-bold tracking-tight">
              {logoText}
            </div>
          )}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {links.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                style={{ color: textColor }} 
                className="text-[14px] font-medium opacity-80 hover:opacity-100 transition-opacity no-underline"
                onClick={(e) => e.preventDefault()} // Prevent nav in editor
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {showButton && (
            <button 
              className="px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: textColor, color: backgroundColor }}
            >
              {buttonText}
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: textColor }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 w-full border-t border-black/5 shadow-lg"
          style={{ backgroundColor }}
        >
          <div className="flex flex-col p-4 gap-4">
            {links.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                style={{ color: textColor }} 
                className="text-base font-medium py-2 border-b border-black/5 no-underline"
              >
                {link.label}
              </a>
            ))}
            {showButton && (
              <button 
                className="w-full mt-2 px-5 py-3 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: textColor, color: backgroundColor }}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Header.craft = {
  displayName: "Header Navbar",
  props: { 
    backgroundColor: "#ffffff", 
    textColor: "#111827", 
    logoText: "My Clinic",
    isSticky: true,
    showButton: true,
    buttonText: "Book Appointment"
  },
  rules: { canDrag: () => true },
  related: { settings: HeaderSettings },
};

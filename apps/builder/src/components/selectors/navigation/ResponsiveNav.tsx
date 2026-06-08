"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Menu, X } from "lucide-react";

interface ResponsiveNavProps {
  logo?: string;
  links?: string[];
  backgroundColor?: string;
  textColor?: string;
  sticky?: boolean;
}

export const ResponsiveNavSettings = () => {
  const { actions: { setProp }, logo, links, backgroundColor, textColor, sticky } = useNode((node) => ({
    logo: node.data.props.logo,
    links: node.data.props.links,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    sticky: node.data.props.sticky,
  }));

  const [newLink, setNewLink] = useState("");

  const addLink = () => {
    if (newLink.trim()) {
      setProp((p: ResponsiveNavProps) => {
        p.links = [...(p.links || []), newLink.trim()];
      });
      setNewLink("");
    }
  };

  const removeLink = (index: number) => {
    setProp((p: ResponsiveNavProps) => {
      p.links = p.links?.filter((_, i) => i !== index) || [];
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Logo Text</label>
        <input 
          type="text" 
          value={logo} 
          onChange={(e) => setProp((p: ResponsiveNavProps) => { p.logo = e.target.value; })}
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Navigation Links</label>
        <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
          {links?.map((link: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input 
                type="text" 
                value={link}
                onChange={(e) => {
                  setProp((p: ResponsiveNavProps) => {
                    if (p.links) p.links[index] = e.target.value;
                  });
                }}
                className="flex-1 border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#0066FF]"
              />
              <button
                onClick={() => removeLink(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
            placeholder="Add link..."
            className="flex-1 border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
          <button
            onClick={addLink}
            className="px-3 py-1.5 bg-[#0066FF] text-white text-[11px] font-medium hover:bg-[#0052CC] rounded transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Background</label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setProp((p: ResponsiveNavProps) => { p.backgroundColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Text Color</label>
          <input 
            type="color" 
            value={textColor} 
            onChange={(e) => setProp((p: ResponsiveNavProps) => { p.textColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-700">Sticky Navigation</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={sticky}
            onChange={(e) => setProp((p: ResponsiveNavProps) => { p.sticky = e.target.checked; })}
            className="sr-only peer" 
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
        </label>
      </div>
    </div>
  );
};

export const ResponsiveNav = ({ 
  logo = "Brand",
  links = ["Home", "About", "Services", "Contact"],
  backgroundColor = "#FFFFFF",
  textColor = "#111827",
  sticky = false
}: ResponsiveNavProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        backgroundColor,
        color: textColor,
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : "auto",
        zIndex: sticky ? 50 : "auto",
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
      }}
      className="responsive-nav"
    >
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Logo */}
        <div style={{ fontSize: "20px", fontWeight: 700 }}>
          {logo}
        </div>

        {/* Desktop Links */}
        <div className="desktop-links" style={{ display: "flex", gap: "32px" }}>
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              style={{ 
                color: textColor, 
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                transition: "opacity 0.2s"
              }}
              className="hover:opacity-70"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: textColor,
            padding: "8px"
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: "16px",
            padding: "16px 24px",
            borderTop: `1px solid ${textColor}20`
          }}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              style={{ 
                color: textColor, 
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 500
              }}
            >
              {link}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-menu {
            display: ${mobileMenuOpen ? 'flex' : 'none'} !important;
          }
        }
      `}</style>
    </nav>
  );
};

ResponsiveNav.craft = {
  displayName: "Responsive Nav",
  props: { 
    logo: "Brand",
    links: ["Home", "About", "Services", "Contact"],
    backgroundColor: "#FFFFFF",
    textColor: "#111827",
    sticky: false
  },
  related: { settings: ResponsiveNavSettings },
};

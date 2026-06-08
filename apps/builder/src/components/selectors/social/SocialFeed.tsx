"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { FaInstagram, FaTwitter } from "react-icons/fa";

interface SocialFeedProps {
  platform?: "instagram" | "twitter";
  handle?: string;
  theme?: "light" | "dark";
  height?: number;
}

export const SocialFeedSettings = () => {
  const { actions: { setProp }, platform, handle, theme, height } = useNode((node) => ({
    platform: node.data.props.platform,
    handle: node.data.props.handle,
    theme: node.data.props.theme,
    height: node.data.props.height,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Platform</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <select 
            value={platform || "instagram"} 
            onChange={(e) => setProp((p: SocialFeedProps) => { p.platform = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="instagram">Instagram Grid</option>
            <option value="twitter">X (Twitter) Timeline</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Account</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <span className="px-3 text-[12px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[40px]">@</span>
          <input 
            type="text" 
            value={handle || ""} 
            onChange={(e) => setProp((p: SocialFeedProps) => { p.handle = e.target.value; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            placeholder="username"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Appearance</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Theme</div>
            <select 
              value={theme || "light"} 
              onChange={(e) => setProp((p: SocialFeedProps) => { p.theme = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">H (px)</div>
            <input 
              type="number" 
              value={height || 600} 
              onChange={(e) => setProp((p: SocialFeedProps) => { p.height = parseInt(e.target.value) || 0; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700" 
            />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
        <p className="text-[11px] text-yellow-700 leading-relaxed font-medium">
          <strong>Note:</strong> Social feeds require 3rd party scripts to load. The builder will display a preview placeholder to prevent script injection issues during editing.
        </p>
      </div>
    </div>
  );
};

export const SocialFeed = ({ 
  platform = "instagram",
  handle = "clinicname",
  theme = "light",
  height = 600
}: SocialFeedProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  // In the editor, always show a placeholder to prevent hydration and iframe hijacking issues.
  // In a real published app, this would conditionally load the Instagram or Twitter embed script.

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`w-full border rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center`}
      style={{ 
        height: `${height}px`,
        backgroundColor: theme === 'dark' ? '#111827' : '#FAFAFA',
        borderColor: theme === 'dark' ? '#374151' : '#E5E5E5',
        color: theme === 'dark' ? '#ffffff' : '#111827',
        outline: isSelected ? "2px solid #0066FF" : isHovered ? "1px solid #3b82f6" : "none", 
        outlineOffset: "-2px", 
        transition: "outline 0.15s"
      }}
    >
      {platform === "instagram" ? (
        <FaInstagram size={48} className={`mb-4 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
      ) : (
        <FaTwitter size={48} className={`mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
      )}
      
      <h3 className="font-bold text-lg mb-2 capitalize">{platform} Feed Placeholder</h3>
      <p className="opacity-70 text-sm max-w-sm">
        When published, this area will display the live {platform} feed for <span className="font-semibold">@{handle}</span>.
      </p>
    </div>
  );
};

SocialFeed.craft = {
  displayName: "Social Feed",
  props: { 
    platform: "instagram",
    handle: "clinicname",
    theme: "light",
    height: 400
  },
  rules: { canDrag: () => true },
  related: { settings: SocialFeedSettings },
};

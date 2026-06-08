"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { Link as LinkIcon, Mail, Share2 } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

interface ShareButtonsProps {
  platforms?: string[];
  layout?: "inline" | "floating-left" | "floating-right";
  style?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  color?: string;
  shareUrl?: string;
  shareText?: string;
}

export const ShareButtonsSettings = () => {
  const { actions: { setProp }, platforms, layout, style, size, color, shareUrl, shareText } = useNode((node) => ({
    platforms: node.data.props.platforms || ["facebook", "twitter", "linkedin", "copy"],
    layout: node.data.props.layout,
    style: node.data.props.style,
    size: node.data.props.size,
    color: node.data.props.color,
    shareUrl: node.data.props.shareUrl,
    shareText: node.data.props.shareText,
  }));

  const togglePlatform = (platform: string) => {
    setProp((props: ShareButtonsProps) => {
      if (!props.platforms) props.platforms = [];
      if (props.platforms.includes(platform)) {
        props.platforms = props.platforms.filter(p => p !== platform);
      } else {
        props.platforms.push(platform);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Platforms</label>
        <div className="grid grid-cols-2 gap-2">
          {["facebook", "twitter", "linkedin", "email", "copy"].map(platform => (
            <label key={platform} className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer capitalize">
              <input 
                type="checkbox" 
                checked={platforms?.includes(platform) || false} 
                onChange={() => togglePlatform(platform)}
                className="rounded border-gray-300 text-blue-600"
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Design</label>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Layout</div>
          <select 
            value={layout || "inline"} 
            onChange={(e) => setProp((p: ShareButtonsProps) => { p.layout = e.target.value as any; })} 
            className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
          >
            <option value="inline">Inline Horizontal</option>
            <option value="floating-left">Floating Left</option>
            <option value="floating-right">Floating Right</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Style</div>
            <select 
              value={style || "solid"} 
              onChange={(e) => setProp((p: ShareButtonsProps) => { p.style = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
          <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8">
            <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white">Size</div>
            <select 
              value={size || "md"} 
              onChange={(e) => setProp((p: ShareButtonsProps) => { p.size = e.target.value as any; })} 
              className="w-full h-full px-2 text-[12px] bg-transparent focus:outline-none font-medium text-gray-700"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
        </div>
        <div className="flex items-center border border-[#E5E5E5] bg-[#FAFAFA] rounded-md overflow-hidden h-8 mt-1">
          <div className="px-3 text-[11px] font-medium text-gray-400 border-r border-[#E5E5E5] h-full flex items-center bg-white min-w-[70px]">Color</div>
          <input type="color" value={color || "#0066FF"} onChange={(e) => setProp((p: ShareButtonsProps) => { p.color = e.target.value; })} className="w-full h-full cursor-pointer border-none bg-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Share Settings</label>
        <input 
          type="text" 
          value={shareUrl || ""} 
          onChange={(e) => setProp((p: ShareButtonsProps) => { p.shareUrl = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Custom URL (leave empty for current page)"
        />
        <input 
          type="text" 
          value={shareText || ""} 
          onChange={(e) => setProp((p: ShareButtonsProps) => { p.shareText = e.target.value; })} 
          className="w-full px-3 py-2 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded-md focus:outline-none font-medium text-gray-700" 
          placeholder="Custom Share Text"
        />
      </div>
    </div>
  );
};

export const ShareButtons = ({ 
  platforms = ["facebook", "twitter", "linkedin", "copy"],
  layout = "inline",
  style = "solid",
  size = "md",
  color = "#0066FF",
  shareUrl = "",
  shareText = "Check this out!"
}: ShareButtonsProps) => {
  const { connectors: { connect, drag }, isSelected, isHovered } = useNode((state) => ({
    isSelected: state.events.selected,
    isHovered: state.events.hovered,
  }));

  const getSizeClasses = () => {
    switch(size) {
      case "sm": return "w-8 h-8";
      case "lg": return "w-12 h-12";
      case "md":
      default: return "w-10 h-10";
    }
  };

  const getIconSize = () => {
    switch(size) {
      case "sm": return 16;
      case "lg": return 24;
      case "md":
      default: return 20;
    }
  };

  const getButtonStyle = () => {
    if (style === "outline") return { border: `2px solid ${color}`, color: color, backgroundColor: "transparent" };
    if (style === "ghost") return { color: color, backgroundColor: "transparent" };
    return { backgroundColor: color, color: "white" };
  };

  const getIcon = (platform: string) => {
    const s = getIconSize();
    switch(platform) {
      case "facebook": return <FaFacebook size={s} />;
      case "twitter": return <FaTwitter size={s} />;
      case "linkedin": return <FaLinkedin size={s} />;
      case "email": return <Mail size={s} />;
      case "copy": return <LinkIcon size={s} />;
      default: return <Share2 size={s} />;
    }
  };

  const handleShare = (platform: string) => {
    if (isSelected) return; // Disable in builder
    const url = shareUrl || window.location.href;
    const text = encodeURIComponent(shareText || document.title);
    
    switch(platform) {
      case "facebook": window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank"); break;
      case "twitter": window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank"); break;
      case "linkedin": window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank"); break;
      case "email": window.location.href = `mailto:?subject=${text}&body=${url}`; break;
      case "copy": 
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
    }
  };

  const isFloating = layout.includes("floating");

  return (
    <div
      ref={(ref) => { connect(drag(ref as HTMLElement)); }}
      className={`${isFloating ? 'fixed top-1/2 -translate-y-1/2 z-50 flex-col gap-2' : 'flex gap-2 items-center flex-wrap'} ${layout === 'floating-left' ? 'left-4' : layout === 'floating-right' ? 'right-4' : ''}`}
      style={{ 
        outline: isSelected ? "2px solid #0066FF" : isHovered && !isFloating ? "1px solid #3b82f6" : "none", 
        outlineOffset: "4px", 
      }}
    >
      {platforms.map(platform => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          className={`${getSizeClasses()} rounded-full flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg`}
          style={getButtonStyle()}
          title={`Share on ${platform}`}
        >
          {getIcon(platform)}
        </button>
      ))}
    </div>
  );
};

ShareButtons.craft = {
  displayName: "Share Buttons",
  props: { 
    platforms: ["facebook", "twitter", "linkedin", "copy"],
    layout: "inline",
    style: "solid",
    size: "md",
    color: "#0066FF"
  },
  rules: { canDrag: () => true },
  related: { settings: ShareButtonsSettings },
};

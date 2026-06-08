"use client";

import React from "react";
import { useNode } from "@craftjs/core";
import { BriefcaseBusiness, Camera, MessageCircle, Play, ThumbsUp } from "lucide-react";

interface SocialEmbedProps {
  platform?: "instagram" | "twitter" | "facebook" | "linkedin" | "youtube";
  url?: string;
  width?: string;
  height?: string;
}

export const SocialEmbedSettings = () => {
  const { actions: { setProp }, platform, url, width, height } = useNode((node) => ({
    platform: node.data.props.platform,
    url: node.data.props.url,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Platform</label>
        <select 
          value={platform} 
          onChange={(e) => setProp((p: SocialEmbedProps) => { p.platform = e.target.value as any; })}
          className="w-full py-2 px-3 text-[12px] bg-[#FAFAFA] border border-[#E5E5E5] rounded outline-none focus:border-[#0066FF] transition-colors"
        >
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter/X</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Post URL</label>
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setProp((p: SocialEmbedProps) => { p.url = e.target.value; })}
          placeholder="https://..."
          className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-3 py-2 text-[12px] focus:outline-none focus:border-[#0066FF] transition-colors"
        />
        <p className="text-[10px] text-gray-500">Paste the full URL of the post</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Width</label>
          <input 
            type="text" 
            value={width} 
            onChange={(e) => setProp((p: SocialEmbedProps) => { p.width = e.target.value; })}
            placeholder="100%"
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Height</label>
          <input 
            type="text" 
            value={height} 
            onChange={(e) => setProp((p: SocialEmbedProps) => { p.height = e.target.value; })}
            placeholder="auto"
            className="w-full border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-2 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>
    </div>
  );
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <Camera size={48} className="text-pink-500" />;
    case "twitter":
      return <MessageCircle size={48} className="text-blue-400" />;
    case "facebook":
      return <ThumbsUp size={48} className="text-blue-600" />;
    case "linkedin":
      return <BriefcaseBusiness size={48} className="text-blue-700" />;
    case "youtube":
      return <Play size={48} className="text-red-600" />;
    default:
      return <Camera size={48} className="text-gray-400" />;
  }
};

const getPlatformName = (platform: string) => {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "twitter":
      return "Twitter/X";
    case "facebook":
      return "Facebook";
    case "linkedin":
      return "LinkedIn";
    case "youtube":
      return "YouTube";
    default:
      return "Social Media";
  }
};

export const SocialEmbed = ({ 
  platform = "instagram", 
  url = "",
  width = "100%",
  height = "auto"
}: SocialEmbedProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        width,
        minHeight: height === "auto" ? "400px" : height,
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        position: "relative",
      }}
    >
      {!url ? (
        <div className="w-full h-full min-h-[400px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3">
          {getPlatformIcon(platform)}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">{getPlatformName(platform)} Embed</p>
            <p className="text-xs text-gray-500 mt-1">Add a post URL in settings</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full min-h-[400px] bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-3 p-6">
          {getPlatformIcon(platform)}
          <div className="text-center max-w-[300px]">
            <p className="text-sm font-medium text-gray-700 mb-2">{getPlatformName(platform)} Post</p>
            <p className="text-xs text-gray-500 break-all">{url}</p>
            <p className="text-xs text-gray-400 mt-3">Embed will render on published site</p>
          </div>
        </div>
      )}
    </div>
  );
};

SocialEmbed.craft = {
  displayName: "Social Embed",
  props: { 
    platform: "instagram", 
    url: "",
    width: "100%",
    height: "auto"
  },
  related: { settings: SocialEmbedSettings },
};
